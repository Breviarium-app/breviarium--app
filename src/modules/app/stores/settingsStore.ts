// stores/settings.ts
import {defineStore} from 'pinia';
import {ref} from 'vue';
import {Preferences} from '@capacitor/preferences';
import {Capacitor, SystemBars, SystemBarsStyle} from '@capacitor/core';
import {KeepAwakeService} from "@/modules/app/services/keepAwakeService.ts";

// Themes with a dark background need light system bar icons, the rest need dark icons
const DARK_BACKGROUND_THEMES = ['dark', 'moon'];

const applySystemBarsStyle = (resolvedTheme: string) => {
    if (!Capacitor.isNativePlatform()) return;
    const style = DARK_BACKGROUND_THEMES.includes(resolvedTheme) ? SystemBarsStyle.Dark : SystemBarsStyle.Light;
    SystemBars.setStyle({style}).catch((error) => console.error('Error setting system bars style:', error));
};

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
        showTextToSpeech: true,
        ttsRate: 1,
        ttsPitch: 1,
        // voiceURI of the chosen voice, empty for the device default
        ttsVoice: '',
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

    // The web Wake Lock API rejects with NotAllowedError while the page isn't visible (e.g. the app
    // was loaded in a background tab), so the request waits for the page to be shown instead.
    let wakeLockRetryPending = false;

    const requestWakeLockWhenVisible = () => {
        if (wakeLockRetryPending) return;
        wakeLockRetryPending = true;
        document.addEventListener('visibilitychange', function retry() {
            if (document.visibilityState !== 'visible') return;
            document.removeEventListener('visibilitychange', retry);
            wakeLockRetryPending = false;
            // The setting may have been turned off meanwhile
            if (settings.value.keepAwake) applyKeepAwake(true);
        });
    };

    const applyKeepAwake = async (keepAwake: boolean) => {
        try {
            if (!await KeepAwakeService.isSupported()) return;
            if (!keepAwake) {
                await KeepAwakeService.allowSleep();
                return;
            }
            if (!Capacitor.isNativePlatform() && document.visibilityState !== 'visible') {
                requestWakeLockWhenVisible();
                return;
            }
            await KeepAwakeService.keepAwake();
        } catch (error) {
            // Expected when the page gets hidden right as the lock is requested: try again once visible
            if (keepAwake && error instanceof DOMException && error.name === 'NotAllowedError') {
                requestWakeLockWhenVisible();
                return;
            }
            console.error('Error applying keep-awake setting:', error);
        }
    };

    const applyTheme = (theme: string) => {
        let resolvedTheme = theme;
        if (theme === 'system') {
            document.documentElement.removeAttribute('data-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            resolvedTheme = prefersDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', resolvedTheme);
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        applySystemBarsStyle(resolvedTheme);
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
                await applyKeepAwake(settings.value.keepAwake ?? false);
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
        applyKeepAwake,
        loadSettings,
        setHapticsState
    };
});