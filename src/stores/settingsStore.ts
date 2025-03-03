// stores/settings.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Preferences } from '@capacitor/preferences';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({
        laudesOfficium: false,
        laudesEvangelium: false,
        vesperaeOfficium: false,
        theme: 'system'
    });

    const themes = [
        { value: 'system', label: 'System' },
        { value: 'light', label: 'Light' },
        { value: 'paper', label: 'Paper' },
        { value: 'dark', label: 'Dark' }
    ];

    const saveSettings = async () => {
        await Preferences.set({
            key: 'settings',
            value: JSON.stringify(settings.value)
        });
    };

    const applyTheme = (theme: string) => {
        if (theme === 'system') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    };

    const loadSettings = async () => {
        const { value } = await Preferences.get({ key: 'settings' });
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
        loadSettings
    };
});