import {computed, onMounted, onUnmounted, ref} from 'vue';
import {Capacitor} from '@capacitor/core';
import type {SpeechSynthesisVoice} from '@capacitor-community/text-to-speech';
import {TextToSpeechService} from '@/modules/app/services/TextToSpeechService.ts';

/**
 * Spanish voices of the device as select options, kept up to date while the component is mounted.
 */
export function useTtsVoices() {
    const isSupported = TextToSpeechService.isSupported();
    // Browsers load voices asynchronously and announce it with "voiceschanged"
    const listensVoicesChanged = isSupported && !Capacitor.isNativePlatform();
    const voices = ref<SpeechSynthesisVoice[]>([]);

    // Android names voices after their locale only ("Spanish Spain"), so repeated names get their id
    const voiceOptions = computed(() => voices.value.map((voice) => {
        const repeated = voices.value.filter((other) => other.name === voice.name).length > 1;
        return {value: voice.voiceURI, label: repeated ? `${voice.name} (${voice.voiceURI})` : voice.name};
    }));

    const loadVoices = async () => {
        voices.value = await TextToSpeechService.getSpanishVoices();
    };

    const reloadVoices = () => {
        TextToSpeechService.clearVoicesCache();
        loadVoices();
    };

    onMounted(() => {
        if (!isSupported) return;
        loadVoices();
        if (listensVoicesChanged) window.speechSynthesis.addEventListener('voiceschanged', reloadVoices);
    });

    onUnmounted(() => {
        if (listensVoicesChanged) window.speechSynthesis.removeEventListener('voiceschanged', reloadVoices);
    });

    return {voiceOptions};
}
