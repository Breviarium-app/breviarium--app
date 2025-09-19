import {defineStore} from 'pinia'
import {useSanctusStore} from "@/stores/sanctus.ts";
import {useBreviariumStore} from "@/stores/breviarium.ts";
import { useRoute } from 'vue-router';

export const useDateStore = defineStore('dateStore', {
    state: () => ({
        currentDate: new Date()
    }),

    getters: {
        getCurrentDate: (state) => state.currentDate
    },

    actions: {
        setup() {
            const route = useRoute();

            console.log(route.params);

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

            this.currentDate = newDate;
            useSanctusStore().updateSaint(newDate);
            useBreviariumStore().setBreviariumDate(newDate);
        },
        setDate(newDate: Date) {
            this.currentDate = newDate;
            useSanctusStore().updateSaint(newDate);
            useBreviariumStore().setBreviariumDate(newDate);
        },

        resetDate() {
            this.currentDate = new Date()
        }
    }
})