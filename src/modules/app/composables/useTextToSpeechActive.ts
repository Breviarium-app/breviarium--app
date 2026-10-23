import {ref} from 'vue';

// Shared so the auto-scroll button can step aside (the reader follows the text itself)
// and leave its place to the reading settings button
const textToSpeechActive = ref(false);

export function useTextToSpeechActive() {
    return textToSpeechActive;
}
