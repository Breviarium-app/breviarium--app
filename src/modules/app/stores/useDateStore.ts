import {defineStore} from 'pinia'
import {useSanctusStore} from "@/modules/app/stores/sanctus.ts";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";

export const useDateStore = defineStore('dateStore', {
    state: () => ({
        currentDate: new Date()
    }),

    getters: {
        getCurrentDate: (state) => state.currentDate
    },

    actions: {
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