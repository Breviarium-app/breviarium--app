<script lang="ts" setup>
import {computed, onUnmounted, ref, watch} from 'vue';
import {IonFab, IonFabButton, IonIcon, toastController} from '@ionic/vue';
import {pauseOutline, volumeHighOutline} from 'ionicons/icons';
import {Capacitor} from '@capacitor/core';
import {useI18n} from 'vue-i18n';
import {useRoute} from 'vue-router';
import {useSettingsStore} from '@/modules/app/stores/settingsStore';
import {useTabbarVisibility} from '@/modules/app/composables/useTabbarVisibility';
import {TextToSpeechService} from '@/modules/app/services/TextToSpeechService.ts';
import {collectSpeechChunks, type SpeechChunk} from '@/modules/app/constants/speechText.ts';
import HapticsService from '@/modules/app/services/HapticsService.ts';

const props = defineProps<{
  // Element whose text is read
  target: HTMLElement | null;
}>();

const {t} = useI18n();
const route = useRoute();
const settingsStore = useSettingsStore();
const tabbarVisible = useTabbarVisibility();
const isNative = Capacitor.isNativePlatform();
const isSupported = TextToSpeechService.isSupported();

const READING_CLASS = 'tts-reading';
// Space the floating buttons and tabbar take at the bottom of the screen
const BOTTOM_OBSTRUCTION = 140;

const state = ref<'idle' | 'playing' | 'paused'>('idle');
let chunks: SpeechChunk[] = [];
let index = 0;
// Bumped on every pause/stop so a pending utterance that resolves late doesn't advance the reading
let session = 0;
let highlighted: HTMLElement | null = null;

const icon = computed(() => state.value === 'playing' ? pauseOutline : volumeHighOutline);
const label = computed(() => t(`tts.${state.value === 'playing' ? 'pause' : state.value === 'paused' ? 'resume' : 'start'}`));

const visibleTop = (): number => {
  const header = props.target?.closest('ion-page')?.querySelector('ion-header');
  return header?.getBoundingClientRect().bottom ?? 0;
};

const isOnScreen = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return rect.bottom > visibleTop() && rect.top < window.innerHeight - BOTTOM_OBSTRUCTION;
};

// Reading starts where the user is, not at the top of the page
const firstChunkOnScreen = (): number => {
  const top = visibleTop();
  const found = chunks.findIndex((chunk) => chunk.element.getBoundingClientRect().bottom > top);
  return found >= 0 ? found : 0;
};

const highlight = (element: HTMLElement | null) => {
  if (highlighted === element) return;
  highlighted?.classList.remove(READING_CLASS);
  highlighted = element;
  if (!element) return;
  element.classList.add(READING_CLASS);
  if (!isOnScreen(element)) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({block: 'center', behavior: reduceMotion ? 'auto' : 'smooth'});
  }
};

const read = async (current: number) => {
  while (current === session && index < chunks.length) {
    const chunk = chunks[index];
    highlight(chunk.element);
    try {
      await TextToSpeechService.speak(chunk.text);
    } catch (error) {
      if (current !== session) return;
      console.error('Error reading text aloud:', error);
      stop();
      const toast = await toastController.create({message: t('tts.error'), duration: 2500, position: 'top'});
      await toast.present();
      return;
    }
    if (current !== session) return;
    index++;
  }
  if (current === session) stop();
};

const play = () => {
  if (!props.target) return;
  const pausedChunk = chunks[index];
  // Rebuild every time: the text may have changed while paused (another hymn, Latin, etc.)
  chunks = collectSpeechChunks(props.target);
  if (!chunks.length) return;

  // Resume on the paused piece if it's still on screen, otherwise from what the user scrolled to
  const resumeAt = pausedChunk && pausedChunk.element.isConnected && isOnScreen(pausedChunk.element)
      ? chunks.findIndex((chunk) => chunk.element === pausedChunk.element && chunk.text === pausedChunk.text)
      : -1;
  index = resumeAt >= 0 ? resumeAt : firstChunkOnScreen();

  state.value = 'playing';
  read(++session);
};

const pause = () => {
  session++;
  state.value = 'paused';
  TextToSpeechService.stop();
};

const stop = () => {
  const wasActive = state.value !== 'idle';
  session++;
  state.value = 'idle';
  chunks = [];
  index = 0;
  highlight(null);
  if (wasActive) TextToSpeechService.stop();
};

const toggle = () => {
  HapticsService.light();
  if (state.value === 'playing') {
    pause();
  } else {
    play();
  }
};

// Ionic keeps the page mounted when navigating forward, so stop on any route change
watch(() => route.fullPath, stop);
watch(() => settingsStore.settings.showTextToSpeech, (show) => !show && stop());
onUnmounted(stop);
</script>

<template>
  <ion-fab
      v-if="isSupported && settingsStore.settings.showTextToSpeech"
      :class="{
        'beside-auto-scroll': settingsStore.settings.showAutoScroll,
        'tabbar-hidden': !tabbarVisible,
        'tabbar-gone': !tabbarVisible && isNative
      }"
      horizontal="end"
      slot="fixed"
      vertical="bottom"
  >
    <ion-fab-button
        :aria-label="label"
        :class="{ paused: state === 'paused' }"
        class="custom-fab-button"
        size="small"
        @click="toggle"
    >
      <ion-icon :icon="icon" aria-hidden="true"/>
    </ion-fab-button>
  </ion-fab>
</template>

<style scoped>
/* Same placement as AutoScrollButton; when that one is shown this sits to its left
   (its 40px button + 12px gap). */
ion-fab {
  --tabbar-top: calc(var(--ion-safe-area-bottom, 0px) + 69px);
  --fab-margin: 16px;
  margin: var(--fab-margin);
  bottom: var(--tabbar-top) !important;
  transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

ion-fab.beside-auto-scroll {
  margin-right: calc(var(--fab-margin) + 52px);
}

ion-fab.tabbar-hidden {
  --tabbar-top: calc(var(--ion-safe-area-bottom, 0px) + 19px);
}

ion-fab.tabbar-gone {
  --tabbar-top: var(--ion-safe-area-bottom, 0px);
}

@media (prefers-reduced-motion: reduce) {
  ion-fab {
    transition: none;
  }
}

.custom-fab-button {
  --box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  --background: var(--ion-color-primary);
  --background-hover: white;
  --background-focused: white;
  --background-activated: white;
  --color: white;
  --color-hover: #ff4444;
  --color-focused: #ff4444;
  --color-activated: #ff4444;
}

.custom-fab-button::part(native) {
  transition: background-color 0.15s ease, color 0.15s ease;
}

/* Paused: inverted colors so it reads as "tap to continue" */
.custom-fab-button.paused {
  --background: white;
  --color: var(--ion-color-primary);
}

.custom-fab-button:hover::part(native) {
  background-color: white !important;
}

.custom-fab-button:hover ion-icon {
  color: #ff4444 !important;
}

@media (min-width: 768px) {
  ion-fab {
    --fab-margin: 24px;
  }
}
</style>

<style>
/* Paragraph being read aloud; global because the text lives in the page's slot */
.tts-reading {
  border-radius: 6px;
  background: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.06);
  background: color-mix(in srgb, var(--ion-color-primary) 12%, transparent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ion-color-primary) 12%, transparent);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
</style>
