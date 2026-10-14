// stores/settings.ts
import {defineStore} from 'pinia';
import {ref} from 'vue';
import {Preferences} from '@capacitor/preferences';
import {KeepAwakeService} from "@/modules/app/services/keepAwakeService.ts";

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({
        laudesOfficium: false,
        laudesEvangelium: false,
        vesperaeOfficium: false,
        theme: 'paper',
        deceased: false,
        hapticsActive: false,
        keepAwake: true,
        fontSize: 14,
        hideInvitatorium: false,
        showAutoScroll: true,
        autoScrollSpeed: 7,
        bienalOfficiumDefault: false,
        latinPrayers: 'es',
        // App version whose "what's new" popup the user already closed
        whatsNewSeenVersion: ''
    });

    const isLoaded = ref(false);
    // True when no settings were stored yet, i.e. a fresh install
    const isFirstLaunch = ref(false);

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
        if (!isLoaded.value) return;
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
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        if (settings.value.theme != theme) {
            settings.value.theme = theme;
        }
    };

    const loadSettings = async () => {
        try {
            const {value} = await Preferences.get({key: 'settings'});
            isFirstLaunch.value = !value;

            if (value) {
                const savedSettings = JSON.parse(value);
                settings.value = {
                    ...settings.value,
                    ...savedSettings,
                };
                applyTheme(settings.value.theme);

                const keepAwake = settings.value.keepAwake ?? false;
                const isSupported = await KeepAwakeService.isSupported();

                if (keepAwake && isSupported) {
                    await KeepAwakeService.keepAwake();
                } else if (!keepAwake) {
                    await KeepAwakeService.allowSleep();
                }

            }
            isLoaded.value = true;
        } catch (error) {
            console.error("error loading settings:", error);
        }

    };

    return {
        settings,
        isLoaded,
        isFirstLaunch,
        themes,
        saveSettings,
        applyTheme,
        loadSettings,
        setHapticsState
    };
});