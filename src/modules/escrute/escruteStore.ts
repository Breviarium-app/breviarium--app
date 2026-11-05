import {defineStore} from "pinia";
import {computed, ref, watch} from "vue";
import {Preferences} from "@capacitor/preferences";
import type {Passage} from "./reference";
import {branchTip, type Escrute, findLecture, type Lecture, pathTo, rootLecture, subtreeIds} from "./escrute";
import {
    getEscrutes,
    useCreateEscruteMutation,
    useDeleteEscruteMutation,
    useReplaceEscrutesMutation,
    useUpdateEscruteMutation,
} from "@/modules/escrute/queries/escruteQueries.ts";
import {useAccountStore} from "@/modules/account/stores/accountStore.ts";
import {debounce} from "@/modules/app/utils/debounce.ts";

const STORAGE_KEY = 'escrutes.v1';
const ONGOING_KEY = 'escrutes.ongoing.v1';

// crypto.randomUUID(), not a timestamp+Math.random() string: the latter can repeat under rapid
// calls (Date.now() ties within the same millisecond, and Math.random().toString(36) can yield a
// shorter-than-expected suffix), and these ids are now also the backend's primary key for the row.
const newId = (): string => crypto.randomUUID();

/** An escrute being read in the Bible: jumps made through cross-references are added to it until it is finished */
interface Ongoing {
    escruteId: string;
    /** Lecture being read now; the next jump hangs from it */
    lectureId: string;
    /** Deepest lecture of the current branch, so stepping back keeps the steps ahead in the trail */
    tipId: string;
}

async function load<T>(key: string, fallback: T): Promise<T> {
    try {
        const {value} = await Preferences.get({key});
        return JSON.parse(value ?? 'null') ?? fallback;
    } catch (error) {
        console.error(error);
        return fallback;
    }
}

export const useEscruteStore = defineStore('escrutes', () => {
    const escrutes = ref<Escrute[]>([]);
    const ongoing = ref<Ongoing | null>(null);
    let loaded = false;

    const save = (key: string, value: unknown) => {
        if (loaded) Preferences.set({key, value: JSON.stringify(value)}).catch(console.error);
    };
    watch(escrutes, value => save(STORAGE_KEY, value), {deep: true});
    watch(ongoing, value => save(ONGOING_KEY, value), {deep: true});

    // Preferences is async, so saved escrutes arrive shortly after the store is created; anything started meanwhile is kept
    const loadedPromise = Promise.all([load<Escrute[]>(STORAGE_KEY, []), load<Ongoing | null>(ONGOING_KEY, null)]).then(([savedEscrutes, savedOngoing]) => {
        escrutes.value = [...savedEscrutes, ...escrutes.value];
        ongoing.value ??= savedOngoing;
        loaded = true;
        save(ONGOING_KEY, ongoing.value);
    });

    /** Most recently touched first */
    const sorted = computed(() => [...escrutes.value].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));

    const find = (id: string) => escrutes.value.find(escrute => escrute.id === id);

    const touch = (escrute: Escrute) => escrute.updatedAt = new Date().toISOString();

    const createMutation = useCreateEscruteMutation();
    const updateMutation = useUpdateEscruteMutation();
    const deleteMutation = useDeleteEscruteMutation();
    const replaceMutation = useReplaceEscrutesMutation();

    // addLecture/updateNote can fire on every keystroke (note textareas), so pushes are debounced
    // and keyed by "whichever escrute was last touched" rather than one request per call.
    let touchedId: string | null = null;
    const pushTouched = debounce(() => {
        const escrute = touchedId && find(touchedId);
        if (!useAccountStore().signedIn || !escrute) return;
        updateMutation.mutateAsync({id: escrute.id, title: escrute.title, lectures: escrute.lectures}).catch((error) => {
            console.error('Error syncing escrute:', error);
        });
    }, 1000);
    const scheduleSync = (id: string) => {
        touchedId = id;
        pushTouched();
    };

    function create(title: string, passage: Passage): Escrute {
        const now = new Date().toISOString();
        const root: Lecture = {id: newId(), parentId: null, passage, note: '', createdAt: now};
        const escrute: Escrute = {id: newId(), title, lectures: [root], createdAt: now, updatedAt: now};
        escrutes.value.push(escrute);
        // A new escrute needs creating remotely, not patching, so this doesn't go through
        // scheduleSync()/pushTouched() - fire-and-forget, same best-effort spirit as the rest.
        if (useAccountStore().signedIn) {
            createMutation.mutateAsync({id: escrute.id, title: escrute.title, lectures: escrute.lectures}).catch((error) => {
                console.error('Error syncing new escrute:', error);
            });
        }
        // Return the reactive copy so later edits are tracked
        return escrutes.value[escrutes.value.length - 1];
    }

    function rename(id: string, title: string) {
        const escrute = find(id);
        if (!escrute) return;
        escrute.title = title;
        touch(escrute);
        scheduleSync(id);
    }

    function remove(id: string) {
        escrutes.value = escrutes.value.filter(escrute => escrute.id !== id);
        if (touchedId === id) touchedId = null;
        if (useAccountStore().signedIn) {
            deleteMutation.mutateAsync(id).catch((error) => {
                console.error('Error syncing escrute deletion:', error);
            });
        }
    }

    function addLecture(escruteId: string, parentId: string, passage: Passage, fromVerse?: string): Lecture | undefined {
        const escrute = find(escruteId);
        if (!escrute || !findLecture(escrute, parentId)) return undefined;
        const lecture: Lecture = {id: newId(), parentId, passage, fromVerse, note: '', createdAt: new Date().toISOString()};
        escrute.lectures.push(lecture);
        touch(escrute);
        scheduleSync(escruteId);
        return lecture;
    }

    function updateNote(escruteId: string, lectureId: string, note: string) {
        const escrute = find(escruteId);
        const lecture = escrute && findLecture(escrute, lectureId);
        if (!escrute || !lecture) return;
        lecture.note = note;
        touch(escrute);
        scheduleSync(escruteId);
    }

    /** Removes a lecture and every jump made from it. The starting lecture cannot be removed. */
    function removeLecture(escruteId: string, lectureId: string) {
        const escrute = find(escruteId);
        const lecture = escrute && findLecture(escrute, lectureId);
        if (!escrute || !lecture?.parentId) return;
        const removed = subtreeIds(escrute, lectureId);
        escrute.lectures = escrute.lectures.filter(l => !removed.has(l.id));
        touch(escrute);
        scheduleSync(escruteId);
    }

    const ongoingEscrute = computed(() => ongoing.value ? find(ongoing.value.escruteId) : undefined);

    /** Lectures from the start down to the tip of the current branch, and which one is being read */
    const trail = computed(() => {
        const escrute = ongoingEscrute.value;
        if (!escrute || !ongoing.value) return {lectures: [] as Lecture[], index: -1};
        // Lectures can be deleted from the escrute page meanwhile
        const current = findLecture(escrute, ongoing.value.lectureId) ?? rootLecture(escrute);
        const tip = findLecture(escrute, ongoing.value.tipId);
        const onBranch = tip && pathTo(escrute, tip.id).some(lecture => lecture.id === current.id);
        const lectures = pathTo(escrute, onBranch ? tip.id : current.id);
        return {lectures, index: lectures.findIndex(lecture => lecture.id === current.id)};
    });

    const currentLecture = computed(() => trail.value.lectures[trail.value.index]);

    function start(title: string, passage: Passage): Escrute {
        const escrute = create(title, passage);
        const root = rootLecture(escrute);
        ongoing.value = {escruteId: escrute.id, lectureId: root.id, tipId: root.id};
        return escrute;
    }

    /** Reads on from any lecture of any escrute, which becomes the ongoing one */
    function resume(escruteId: string, lectureId: string) {
        const escrute = find(escruteId);
        if (!escrute || !findLecture(escrute, lectureId)) return;
        ongoing.value = {escruteId, lectureId, tipId: branchTip(escrute, lectureId)};
    }

    /** Adds a jump from the lecture being read and makes it the current one */
    function follow(passage: Passage, fromVerse?: string): Lecture | undefined {
        const escrute = ongoingEscrute.value;
        const current = currentLecture.value;
        if (!escrute || !current) return undefined;
        const lecture = addLecture(escrute.id, current.id, passage, fromVerse);
        if (lecture) ongoing.value = {escruteId: escrute.id, lectureId: lecture.id, tipId: lecture.id};
        return lecture;
    }

    function goTo(lectureId: string) {
        if (ongoing.value) ongoing.value.lectureId = lectureId;
    }

    /** Stops adding jumps to the ongoing escrute; it stays as it is, with no status of its own */
    function finish() {
        ongoing.value = null;
    }

    // Pulls on sign-in: seeds the account from this device if it has none yet, otherwise applies
    // what's stored remotely (remote wins - logging in elsewhere follows you). `ongoing` (which
    // lecture you're currently reading) is local-only and untouched - reasonable to differ per device.
    async function syncOnSignIn() {
        await loadedPromise;
        try {
            const remote = await getEscrutes();
            if (remote.length === 0) {
                if (escrutes.value.length > 0) {
                    await replaceMutation.mutateAsync(
                        escrutes.value.map((escrute) => ({id: escrute.id, title: escrute.title, lectures: escrute.lectures}))
                    );
                }
            } else {
                escrutes.value = remote.map((item) => ({
                    id: item.id,
                    title: item.title,
                    lectures: item.lectures,
                    createdAt: item.created_at,
                    updatedAt: item.updated_at,
                }));
            }
        } catch (error) {
            console.error('Error syncing escrutes:', error);
        }
    }

    return {
        escrutes, sorted, find, create, rename, remove, addLecture, updateNote, removeLecture,
        ongoingEscrute, trail, currentLecture, start, resume, follow, goTo, finish, syncOnSignIn,
    };
});
