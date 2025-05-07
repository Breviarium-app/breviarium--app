import {defineStore} from 'pinia'

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
        },

        resetDate() {
            this.currentDate = new Date()
        }
    }
})