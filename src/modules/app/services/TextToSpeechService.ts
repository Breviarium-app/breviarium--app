import {Capacitor} from '@capacitor/core';
import {type SpeechSynthesisVoice, TextToSpeech} from '@capacitor-community/text-to-speech';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';

// The liturgical texts are in Spanish whatever the app language is
export const TTS_LANG = 'es-ES';

let voicesCache: SpeechSynthesisVoice[] = [];

export class TextToSpeechService {
    // Native apps use the device engine; on web it depends on the browser's speechSynthesis
    static isSupported(): boolean {
        return Capacitor.isNativePlatform() || (typeof window !== 'undefined' && 'speechSynthesis' in window);
    }

    /**
     * Every voice of the device, in the order the plugin expects: `speak` takes an index into this list.
     */
    static async getVoices(): Promise<SpeechSynthesisVoice[]> {
        if (voicesCache.length) return voicesCache;
        try {
            const {voices} = await TextToSpeech.getSupportedVoices();
            voicesCache = voices;
        } catch (error) {
            console.error('Error loading TTS voices:', error);
        }
        return voicesCache;
    }

    // Browsers load voices asynchronously, so the first list may come back empty
    static clearVoicesCache() {
        voicesCache = [];
    }

    static async getSpanishVoices(): Promise<SpeechSynthesisVoice[]> {
        const voices = await TextToSpeechService.getVoices();
        return voices.filter((voice) => voice.lang?.toLowerCase().startsWith('es'));
    }

    /**
     * Speaks the text with the voice, rate and pitch from settings.
     * Resolves when the utterance ends or is stopped.
     */
    static async speak(text: string): Promise<void> {
        const {ttsRate, ttsPitch, ttsVoice} = useSettingsStore().settings;
        const voices = ttsVoice ? await TextToSpeechService.getVoices() : [];
        const voiceIndex = voices.findIndex((voice) => voice.voiceURI === ttsVoice);

        await TextToSpeech.speak({
            text,
            lang: voiceIndex >= 0 ? voices[voiceIndex].lang : TTS_LANG,
            rate: ttsRate,
            pitch: ttsPitch,
            voice: voiceIndex >= 0 ? voiceIndex : undefined,
            // iOS: keep speaking with the silent switch on
            category: 'playback',
        });
    }

    static async stop(): Promise<void> {
        try {
            await TextToSpeech.stop();
        } catch (error) {
            console.error('Error stopping TTS:', error);
        }
    }

    // Android only: opens the system screen to install voice data
    static async openInstall(): Promise<void> {
        try {
            await TextToSpeech.openInstall();
        } catch (error) {
            console.error('Error opening TTS install:', error);
        }
    }
}
