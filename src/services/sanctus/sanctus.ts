import {SaintInfo, Sanctus} from "sanctus";
import {defineStore} from "pinia";
import {Ref, ref} from "vue";

export const useSanctusStore = defineStore("sanctus", () => {
    const selectedSaint: Ref<SaintInfo | undefined> = ref(undefined);
    const sanctus = ref<Sanctus | null>(null);

    const newSanctus = new Sanctus();
    const saintsOfDay = newSanctus.getSaintsOfDay();
    sanctus.value = newSanctus;
    selectedSaint.value = newSanctus.getSaint();

    return {selectedSaint, sanctus, saintsOfDay};
});