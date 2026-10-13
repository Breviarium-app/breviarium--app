import {defineStore} from "pinia";
import {ref} from "vue";
import {Preferences} from "@capacitor/preferences";

// A link back to what the note was written about: a verse, a lecture or a prayer.
export type DiaryReference = {
    label: string;
    path: string;
    quote?: string;
}

export type DiaryEntry = {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    reference?: DiaryReference;
}

const STORAGE_KEY = 'diary.entries'

export const useDiaryStore = defineStore('diary', () => {
    const entries = ref<DiaryEntry[]>([])

    const load = async () => {
        try {
            const {value} = await Preferences.get({key: STORAGE_KEY})
            entries.value = value ? JSON.parse(value) : []
        } catch (error) {
            console.error(error)
        }
    }

    // Preferences is async, so entries arrive shortly after the store is created.
    const loaded = load()

    const persist = async () => {
        await Preferences.set({key: STORAGE_KEY, value: JSON.stringify(entries.value)})
    }

    const addEntry = async (text: string, reference?: DiaryReference) => {
        await loaded
        const now = new Date().toISOString()
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
        entries.value.unshift({id, text: text.trim(), createdAt: now, updatedAt: now, reference})
        await persist()
    }

    const updateEntry = async (id: string, text: string) => {
        const entry = entries.value.find((item) => item.id === id)
        if (!entry) return
        entry.text = text.trim()
        entry.updatedAt = new Date().toISOString()
        await persist()
    }

    const deleteEntry = async (id: string) => {
        entries.value = entries.value.filter((item) => item.id !== id)
        await persist()
    }

    return {
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
    }
})

// Liturgy pages live under /prayer/<hour>; the dated route keeps the note pointing to that day's texts.
export const datedPath = (path: string, date: Date): string => {
    const prefix = `/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
    if (path.startsWith('/prayer/')) return prefix + path.slice('/prayer'.length)
    if (path === '/saint') return prefix + path
    return path
}
