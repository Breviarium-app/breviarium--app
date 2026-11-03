import {defineStore} from "pinia";
import {computed, ref, watch} from "vue";
import {Preferences} from "@capacitor/preferences";
import type {Passage} from "./reference";
import {branchTip, type Escrute, findLecture, type Lecture, pathTo, rootLecture, subtreeIds} from "./escrute";

const STORAGE_KEY = 'escrutes.v1';
const ONGOING_KEY = 'escrutes.ongoing.v1';

const newId = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

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
    Promise.all([load<Escrute[]>(STORAGE_KEY, []), load<Ongoing | null>(ONGOING_KEY, null)]).then(([savedEscrutes, savedOngoing]) => {
        escrutes.value = [...savedEscrutes, ...escrutes.value];
        ongoing.value ??= savedOngoing;
        loaded = true;
        save(ONGOING_KEY, ongoing.value);
    });

    /** Most recently touched first */
    const sorted = computed(() => [...escrutes.value].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));

    const find = (id: string) => escrutes.value.find(escrute => escrute.id === id);

    const touch = (escrute: Escrute) => escrute.updatedAt = new Date().toISOString();

    function create(title: string, passage: Passage): Escrute {
        const now = new Date().toISOString();
        const root: Lecture = {id: newId(), parentId: null, passage, note: '', createdAt: now};
        escrutes.value.push({id: newId(), title, lectures: [root], createdAt: now, updatedAt: now});
        // Return the reactive copy so later edits are tracked
        return escrutes.value[escrutes.value.length - 1];
    }

    function rename(id: string, title: string) {
        const escrute = find(id);
        if (!escrute) return;
        escrute.title = title;
        touch(escrute);
    }

    function remove(id: string) {
        escrutes.value = escrutes.value.filter(escrute => escrute.id !== id);
    }

    function addLecture(escruteId: string, parentId: string, passage: Passage, fromVerse?: string): Lecture | undefined {
        const escrute = find(escruteId);
        if (!escrute || !findLecture(escrute, parentId)) return undefined;
        const lecture: Lecture = {id: newId(), parentId, passage, fromVerse, note: '', createdAt: new Date().toISOString()};
        escrute.lectures.push(lecture);
        touch(escrute);
        return lecture;
    }

    function updateNote(escruteId: string, lectureId: string, note: string) {
        const escrute = find(escruteId);
        const lecture = escrute && findLecture(escrute, lectureId);
        if (!escrute || !lecture) return;
        lecture.note = note;
        touch(escrute);
    }

    /** Removes a lecture and every jump made from it. The starting lecture cannot be removed. */
    function removeLecture(escruteId: string, lectureId: string) {
        const escrute = find(escruteId);
        const lecture = escrute && findLecture(escrute, lectureId);
        if (!escrute || !lecture?.parentId) return;
        const removed = subtreeIds(escrute, lectureId);
        escrute.lectures = escrute.lectures.filter(l => !removed.has(l.id));
        touch(escrute);
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

    return {
        escrutes, sorted, find, create, rename, remove, addLecture, updateNote, removeLecture,
        ongoingEscrute, trail, currentLecture, start, resume, follow, goTo, finish,
    };
});
