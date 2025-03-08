import {SaintInfo, Sanctus} from "sanctus";
import {defineStore} from "pinia";
import {Ref, ref} from "vue";

export const useSanctusStore = defineStore("sanctus", () => {
    const selectedSaint: Ref<SaintInfo | undefined> = ref(undefined);
    const sanctus = ref<Sanctus | null>(null);

    const newInstance = new Sanctus();
    const saintsOfDay = newInstance.getSaintsOfDay();
    sanctus.value = newInstance;
    selectedSaint.value = newInstance.getSaint();

    return {selectedSaint, sanctus, saintsOfDay};
});