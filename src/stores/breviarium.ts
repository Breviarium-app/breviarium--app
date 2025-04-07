import {defineStore} from "pinia";
import {Ref, ref} from "vue";
import Breviarium from "breviarium";
import {BreviariumInterface} from "breviarium/dist/breviarium-interface";

export const useBreviariumStore = defineStore("breviarium", () => {
    const breviarium: Ref<BreviariumInterface> = ref(new Breviarium());

    const setBreviariumDate = (date: Date): void => {
        breviarium.value?.setDate(date);
    }
    return {breviarium, setBreviariumDate};
});