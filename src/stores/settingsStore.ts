// stores/settings.ts
import {defineStore} from 'pinia';
import {ref} from 'vue';
import {Preferences} from '@capacitor/preferences';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({
        laudesOfficium: false,
        laudesEvangelium: false,
        vesperaeOfficium: false,
        theme: 'light',
        deceased: false,
        hapticsActive: true,
    });

    const themes = [
        // {value: 'system', label: 'System'},
        {value: 'light', label: 'Light'},
        {value: 'paper', label: 'Paper'},
        {value: 'moon', label: 'Moon'},
        {value: 'dark', label: 'Dark'}
    ];


    const setHapticsState = (state: boolean) => {
        settings.value.hapticsActive = state;
    }
    const saveSettings = async () => {
        await Preferences.set({
            key: 'settings',
            value: JSON.stringify(settings.value)
        }).catch(err => {
            console.error("No Guardado:", err)
        });
    };

    const applyTheme = (theme: string) => {
        if (theme === 'system') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        if (settings.value.theme != theme) {
            settings.value.theme = theme;
        }
    };

    const loadSettings = async () => {
        const {value} = await Preferences.get({key: 'settings'});
        if (value) {
            settings.value = JSON.parse(value);
            applyTheme(settings.value.theme);
        }
    };

    return {
        settings,
        themes,
        saveSettings,
        applyTheme,
        loadSettings,
        setHapticsState
    };
});