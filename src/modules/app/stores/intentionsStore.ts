import {defineStore} from "pinia";
import {ref, watch} from "vue";
import {Preferences} from "@capacitor/preferences";
import {getIntentions, useReplaceIntentionsMutation} from "@/modules/app/queries/intentionsQueries.ts";
import {useAccountStore} from "@/modules/account/stores/accountStore.ts";
import {debounce} from "@/modules/app/utils/debounce.ts";

export interface Intention {
    id: string;
    text: string;
    order: number;
}

const STORAGE_KEY = 'prayerIntentions.v1'
// Pre-dates this store: a plain localStorage key, migrated once below for existing installs.
const OLD_STORAGE_KEY = 'prayerIntentions'

// Reads the old localStorage format, including very old installs that stored a plain string array.
function migrateFromLocalStorage(): Intention[] {
    const stored = localStorage.getItem(OLD_STORAGE_KEY)
    if (!stored) return []
    try {
        const parsed = JSON.parse(stored)
        if (!Array.isArray(parsed)) return []
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
            return (parsed as string[]).map((text, order) => ({id: crypto.randomUUID(), text, order}))
        }
        return (parsed as Intention[]).sort((a, b) => a.order - b.order)
    } catch {
        return []
    }
}

export const useIntentionsStore = defineStore('intentions', () => {
    const intentions = ref<Intention[]>([])

    const load = async () => {
        try {
            const {value} = await Preferences.get({key: STORAGE_KEY})
            intentions.value = value ? JSON.parse(value) : migrateFromLocalStorage()
        } catch (error) {
            console.error(error)
        }
    }

    // Preferences is async, so intentions arrive shortly after the store is created.
    const loaded = load()

    const persist = async () => {
        await Preferences.set({key: STORAGE_KEY, value: JSON.stringify(intentions.value)})
    }

    const replaceMutation = useReplaceIntentionsMutation()
    // Skips pushing a sync that merely echoes what was just pulled or pushed
    let lastSynced = ''

    const push = async () => {
        if (!useAccountStore().signedIn) return
        const texts = intentions.value.map((intention) => intention.text)
        const snapshot = JSON.stringify(texts)
        if (snapshot === lastSynced) return
        try {
            await replaceMutation.mutateAsync(texts)
            lastSynced = snapshot
        } catch (error) {
            console.error('Error syncing intentions:', error)
        }
    }

    watch(intentions, debounce(push, 1000), {deep: true})

    // Pulls on sign-in: seeds the account from this device if it has none yet, otherwise applies
    // what's stored remotely (remote wins - logging in elsewhere follows you).
    const syncOnSignIn = async () => {
        await loaded
        try {
            const remoteTexts = await getIntentions()
            if (remoteTexts.length === 0) {
                await push()
            } else {
                intentions.value = remoteTexts.map((text, order) => ({id: crypto.randomUUID(), text, order}))
                lastSynced = JSON.stringify(remoteTexts)
                await persist()
            }
        } catch (error) {
            console.error('Error syncing intentions:', error)
        }
    }

    const addIntention = async (text: string) => {
        const trimmed = text.trim()
        if (!trimmed) return
        const nextOrder = intentions.value.reduce((max, intention) => Math.max(max, intention.order), -1) + 1
        intentions.value.push({id: crypto.randomUUID(), text: trimmed, order: nextOrder})
        await persist()
    }

    const updateIntention = async (index: number, text: string) => {
        const trimmed = text.trim()
        if (!trimmed || index < 0 || index >= intentions.value.length) return
        intentions.value[index].text = trimmed
        await persist()
    }

    const deleteIntention = async (index: number) => {
        intentions.value.splice(index, 1)
        await persist()
    }

    // Persists a new order after a drag-and-drop reorder
    const reorderIntentions = async (newList: Intention[]) => {
        newList.forEach((intention, index) => {
            intention.order = index
        })
        intentions.value = newList
        await persist()
    }

    return {
        intentions,
        addIntention,
        updateIntention,
        deleteIntention,
        reorderIntentions,
        syncOnSignIn,
    }
})
