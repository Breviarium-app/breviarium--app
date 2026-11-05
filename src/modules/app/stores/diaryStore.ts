import {defineStore} from "pinia";
import {ref} from "vue";
import {Preferences} from "@capacitor/preferences";
import {
    getDiaryEntries,
    useAddDiaryEntryMutation,
    useDeleteDiaryEntryMutation,
    useReplaceDiaryMutation,
    useUpdateDiaryEntryMutation,
} from "@/modules/app/queries/diaryQueries.ts";
import {useAccountStore} from "@/modules/account/stores/accountStore.ts";

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

    const addMutation = useAddDiaryEntryMutation()
    const updateMutation = useUpdateDiaryEntryMutation()
    const deleteMutation = useDeleteDiaryEntryMutation()
    const replaceMutation = useReplaceDiaryMutation()

    const addEntry = async (text: string, reference?: DiaryReference) => {
        await loaded
        const now = new Date().toISOString()
        // crypto.randomUUID(), not a timestamp+Math.random() string: the latter can repeat under
        // rapid calls, and this id is now also the backend's primary key for the row.
        const id = crypto.randomUUID()
        const trimmed = text.trim()
        entries.value.unshift({id, text: trimmed, createdAt: now, updatedAt: now, reference})
        await persist()
        if (useAccountStore().signedIn) {
            try {
                await addMutation.mutateAsync({id, text: trimmed, reference})
            } catch (error) {
                console.error('Error syncing new diary entry:', error)
            }
        }
    }

    const updateEntry = async (id: string, text: string) => {
        const entry = entries.value.find((item) => item.id === id)
        if (!entry) return
        entry.text = text.trim()
        entry.updatedAt = new Date().toISOString()
        await persist()
        if (useAccountStore().signedIn) {
            try {
                await updateMutation.mutateAsync({id, text: entry.text})
            } catch (error) {
                console.error('Error syncing diary entry update:', error)
            }
        }
    }

    const deleteEntry = async (id: string) => {
        entries.value = entries.value.filter((item) => item.id !== id)
        await persist()
        if (useAccountStore().signedIn) {
            try {
                await deleteMutation.mutateAsync(id)
            } catch (error) {
                console.error('Error syncing diary entry deletion:', error)
            }
        }
    }

    // Pulls on sign-in: seeds the account from this device if it has none yet, otherwise applies
    // what's stored remotely (remote wins - logging in elsewhere follows you).
    const syncOnSignIn = async () => {
        await loaded
        try {
            const remote = await getDiaryEntries()
            if (remote.length === 0) {
                if (entries.value.length > 0) {
                    await replaceMutation.mutateAsync(
                        entries.value.map((entry) => ({id: entry.id, text: entry.text, reference: entry.reference}))
                    )
                }
            } else {
                entries.value = remote.map((entry) => ({
                    id: entry.id,
                    text: entry.text,
                    createdAt: entry.created_at,
                    updatedAt: entry.updated_at,
                    reference: entry.reference ?? undefined,
                }))
                await persist()
            }
        } catch (error) {
            console.error('Error syncing diary:', error)
        }
    }

    return {
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        syncOnSignIn,
    }
})

// Liturgy pages live under /prayer/<hour>; the dated route keeps the note pointing to that day's texts.
export const datedPath = (path: string, date: Date): string => {
    const prefix = `/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
    if (path.startsWith('/prayer/')) return prefix + path.slice('/prayer'.length)
    if (path === '/saint') return prefix + path
    return path
}
