import {defineStore} from "pinia";
import {computed, ref} from "vue";

export type TrailEntry = {
    book: string;
    chapter: number;
    verse: number | null;
    label: string;
    quote?: string;
}

// The path followed through cross-references: the verse being read is the root and every
// reference opened from there is a child of the previous one.
export const bibleTrailStore = defineStore('bibleTrail', () => {
    const entries = ref<TrailEntry[]>([])
    const index = ref(-1)
    const collapsed = ref(false)

    const active = computed(() => entries.value.length > 1)

    // Opening a reference from the current entry drops whatever came after it (a new branch).
    const follow = (origin: TrailEntry, target: TrailEntry) => {
        const current = entries.value[index.value]
        // The root follows the verse the reader is on; deeper entries keep their own reference.
        if (index.value <= 0 || current.book !== origin.book || current.chapter !== origin.chapter) {
            entries.value = [origin]
        } else {
            entries.value = entries.value.slice(0, index.value + 1)
        }
        entries.value.push(target)
        index.value = entries.value.length - 1
    }

    const goTo = (position: number) => {
        if (position >= 0 && position < entries.value.length) index.value = position
    }

    const clear = () => {
        entries.value = []
        index.value = -1
        collapsed.value = false
    }

    // Called when a chapter opens, which may have been through the back button rather than the trail.
    const sync = (book: string, chapter: number) => {
        if (!entries.value.length) return
        const matches = (entry: TrailEntry) => entry.book === book && entry.chapter === chapter
        const current = entries.value[index.value]
        if (current && matches(current)) return
        let found = -1
        for (let i = Math.min(index.value, entries.value.length - 1); i >= 0 && found === -1; i--) {
            if (matches(entries.value[i])) found = i
        }
        if (found === -1) found = entries.value.findIndex(matches)
        if (found === -1) clear()
        else index.value = found
    }

    return {entries, index, collapsed, active, follow, goTo, clear, sync}
})
