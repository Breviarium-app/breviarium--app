import Sanctus, {SaintInfo} from "sanctus";

import {defineStore} from "pinia";
import {Ref, ref} from "vue";
import {normalizeSearch} from "@/modules/app/constants/search.ts";

// Category 1 marks the principal saint of a day; San Patricio is the only entry with 0, also principal
const isPrincipal = (saint: SaintInfo) => saint.category <= 1;

export const useSanctusStore = defineStore("sanctus", () => {
    const sanctus = new Sanctus();
    const saintsOfDay: Ref<SaintInfo[] | undefined> = ref(sanctus.getSaintsOfDay());
    const selectedSaint: Ref<SaintInfo | undefined> = ref(sanctus.getSaint());

    const updateSaint = (date: Date) => {
        selectedSaint.value = sanctus.getSaint(date);
        saintsOfDay.value = sanctus.getSaintsOfDay(date);
    }

    // Built on first search: the santoral has ~5000 entries and most visits never search
    let searchIndex: { saint: SaintInfo; key: string }[] | undefined;
    const getSearchIndex = () => {
        searchIndex ??= sanctus.getAllSaints().map((saint) => ({saint, key: normalizeSearch(saint.name)}));
        return searchIndex;
    }

    const totalSaints = () => getSearchIndex().length;

    // Every word of the query must appear in the name; principal saints are listed first
    const searchSaints = (query: string): SaintInfo[] => {
        const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
        if (!words.length) return [];
        return getSearchIndex()
            .filter(({key}) => words.every((word) => key.includes(word)))
            .map(({saint}) => saint)
            .sort((a, b) => Number(isPrincipal(b)) - Number(isPrincipal(a)) || a.name.localeCompare(b.name));
    }

    const getSaintsOfMonthDay = (month: number, day: number): SaintInfo[] =>
        sanctus.getSaintsOfDay(new Date(2000, month - 1, day));

    const findSaint = (month: number, day: number, name: string): SaintInfo | undefined =>
        getSaintsOfMonthDay(month, day).find((saint) => saint.name === name);

    return {selectedSaint, sanctus, saintsOfDay, updateSaint, searchSaints, totalSaints, getSaintsOfMonthDay, findSaint};
});
