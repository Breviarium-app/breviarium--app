import Sanctus, {SaintInfo} from "sanctus";

import {defineStore} from "pinia";
import {Ref, ref} from "vue";

export const useSanctusStore = defineStore("sanctus", () => {
    const sanctus = new Sanctus();
    const saintsOfDay: Ref<SaintInfo[] | undefined> = ref(sanctus.getSaintsOfDay());
    const selectedSaint: Ref<SaintInfo | undefined> = ref(sanctus.getSaint());

    const updateSaint = (date: Date) => {
        selectedSaint.value = sanctus.getSaint(date);
        saintsOfDay.value = sanctus.getSaintsOfDay(date);
    }
    return {selectedSaint, sanctus, saintsOfDay, updateSaint};
});