import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {useSanctusStore} from "@/modules/app/stores/sanctus.ts";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";
import {useRoute} from "vue-router";

export const useDateStore = defineStore('dateStore', () => {
    const currentDate = ref(new Date())

    const getCurrentDate = computed(() => currentDate.value)


    const updateDateParams = () => {
        const route = useRoute();

        if (!route.params.year || !route.params.month || !route.params.day) {
            return;
        }

        const year = Number.parseInt(route.params.year as string);
        const month = Number.parseInt(route.params.month as string);
        const day = Number.parseInt(route.params.day as string);

        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
            return;
        }
        const newDate = new Date(`${year.toString()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
        setDate(newDate);
    }


    const setDate = (newDate: Date) => {
        currentDate.value = newDate;
        useSanctusStore().updateSaint(newDate);
        useBreviariumStore().setBreviariumDate(newDate);
    }

    const resetDate = () => {
        currentDate.value = new Date()
    }

    return {
        currentDate,
        getCurrentDate,
        setDate,
        resetDate,
        updateDateParams
    }
})