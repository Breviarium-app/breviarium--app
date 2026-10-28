<script lang="ts" setup>
import {computed, onUnmounted, ref, watch} from 'vue';
import {IonFab, IonFabButton, IonIcon, IonPopover, toastController} from '@ionic/vue';
import {closeOutline, headsetOutline, pause, play as playIcon, playSkipBack, playSkipForward, settingsOutline} from 'ionicons/icons';
import {Capacitor} from '@capacitor/core';
import {useI18n} from 'vue-i18n';
import {useRoute} from 'vue-router';
import {useSettingsStore} from '@/modules/app/stores/settingsStore';
import {useTabbarVisibility} from '@/modules/app/composables/useTabbarVisibility';
import {RATE_STEPS, TextToSpeechService} from '@/modules/app/services/TextToSpeechService.ts';
import {useTextToSpeechActive} from '@/modules/app/composables/useTextToSpeechActive.ts';
import TextToSpeechQuickSettings from '@/modules/app/components/molecules/TextToSpeechQuickSettings.vue';
import {cleanForSpeech, collectSpeechChunks, type SpeechChunk} from '@/modules/app/constants/speechText.ts';
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
// Highlights exactly the text being read where the CSS Custom Highlight API exists,
// otherwise the whole paragraph
const supportsHighlights = typeof CSS !== 'undefined' && 'highlights' in CSS;
// Space the player and tabbar take at the bottom of the screen
const BOTTOM_OBSTRUCTION = 150;

const state = ref<'idle' | 'playing' | 'paused'>('idle');
const chunks = ref<SpeechChunk[]>([]);
const index = ref(0);
const section = ref('');
// Bumped on every pause/stop/jump so a pending utterance that resolves late doesn't advance the reading
let session = 0;
let highlighted: SpeechChunk | null = null;

const isActive = computed(() => state.value !== 'idle');
const textToSpeechActive = useTextToSpeechActive();
const isShown = computed(() => isSupported && settingsStore.settings.showTextToSpeech);

const settingsOpen = ref(false);
const settingsEvent = ref<Event | undefined>();
const progress = computed(() => chunks.value.length ? (index.value + 1) / chunks.value.length : 0);
const rateLabel = computed(() => `${Number(settingsStore.settings.ttsRate.toFixed(1))}×`);

const ionContent = () => props.target?.closest('ion-content') as HTMLIonContentElement | null;
// <ion-page> renders as a div with the "ion-page" class
const ionPage = () => props.target?.closest('.ion-page');

const visibleTop = (): number => {
  const header = ionPage()?.querySelector('ion-header');
  return header?.getBoundingClientRect().bottom ?? 0;
};

// Keeps the paragraph being read in the upper part of the screen
const follow = (chunk: SpeechChunk) => {
  const rect = supportsHighlights ? chunk.range.getBoundingClientRect() : chunk.element.getBoundingClientRect();
  const top = visibleTop();
  const bottom = window.innerHeight - BOTTOM_OBSTRUCTION;
  if (rect.top >= top && rect.bottom <= bottom) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  ionContent()?.scrollByPoint(0, rect.top - top - (bottom - top) / 4, reduceMotion ? 0 : 400);
};

// Name of the part of the prayer being read: the last heading before the paragraph
const sectionOf = (element: HTMLElement): string => {
  const headings = Array.from(props.target?.querySelectorAll('h1, h2, h3, h4') ?? []);
  const heading = headings.filter((h) => h === element || h.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING).pop();
  const pageTitle = ionPage()?.querySelector('ion-title')?.textContent ?? '';
  return cleanForSpeech(heading?.textContent ?? pageTitle);
};

const highlight = (chunk: SpeechChunk | null) => {
  if (highlighted === chunk) return;
  if (supportsHighlights) CSS.highlights.delete(READING_CLASS);
  highlighted?.element.classList.remove(READING_CLASS);
  highlighted = chunk;
  if (!chunk) return;
  if (supportsHighlights) CSS.highlights.set(READING_CLASS, new Highlight(chunk.range));
  else chunk.element.classList.add(READING_CLASS);
  section.value = sectionOf(chunk.element);
  follow(chunk);
};

const read = async (current: number) => {
  while (current === session && index.value < chunks.value.length) {
    const chunk = chunks.value[index.value];
    highlight(chunk);
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
    index.value++;
  }
  if (current === session) stop();
};

const speakFromCurrent = () => {
  state.value = 'playing';
  read(++session);
};

// The whole page is read, from the top
const start = () => {
  if (!props.target) return;
  chunks.value = collectSpeechChunks(props.target);
  if (!chunks.value.length) return;
  index.value = 0;
  speakFromCurrent();
};

const resume = () => {
  if (!props.target) return;
  const pausedChunk = chunks.value[index.value];
  // Rebuild: the text may have changed while paused (another hymn, Latin, etc.)
  const rebuilt = collectSpeechChunks(props.target);
  if (!rebuilt.length) return stop();
  const same = rebuilt.findIndex((chunk) => chunk.element === pausedChunk?.element && chunk.text === pausedChunk?.text);
  const sameBlock = rebuilt.findIndex((chunk) => chunk.element === pausedChunk?.element);
  chunks.value = rebuilt;
  index.value = same >= 0 ? same : sameBlock >= 0 ? sameBlock : Math.min(index.value, rebuilt.length - 1);
  speakFromCurrent();
};

const pauseReading = () => {
  session++;
  state.value = 'paused';
  TextToSpeechService.stop();
};

const stop = () => {
  const wasActive = isActive.value;
  session++;
  state.value = 'idle';
  chunks.value = [];
  index.value = 0;
  highlight(null);
  if (wasActive) TextToSpeechService.stop();
};

const togglePlay = () => {
  HapticsService.light();
  if (state.value === 'playing') pauseReading();
  else if (state.value === 'paused') resume();
  else start();
};

const skip = (direction: -1 | 1) => {
  HapticsService.light();
  const target = index.value + direction;
  if (target < 0 || target >= chunks.value.length) return;
  index.value = target;
  highlight(chunks.value[target]);
  // Speaking again flushes the current utterance
  if (state.value === 'playing') speakFromCurrent();
};

const cycleRate = () => {
  HapticsService.light();
  const rate = settingsStore.settings.ttsRate;
  settingsStore.settings.ttsRate = RATE_STEPS.find((step) => step > rate + 0.01) ?? RATE_STEPS[0];
  settingsStore.saveSettings();
};

const openSettings = (event: Event) => {
  HapticsService.light();
  settingsEvent.value = event;
  settingsOpen.value = true;
};

// Restart the current piece so a new speed, pitch or voice is heard straight away
watch(
    () => [settingsStore.settings.ttsRate, settingsStore.settings.ttsPitch, settingsStore.settings.ttsVoice],
    () => state.value === 'playing' && speakFromCurrent(),
);

watch(isActive, (active) => {
  textToSpeechActive.value = active;
  if (!active) settingsOpen.value = false;
});

// Ionic keeps the page mounted when navigating forward, so stop on any route change
watch(() => route.fullPath, stop);
watch(() => settingsStore.settings.showTextToSpeech, (show) => !show && stop());
// PrayerPage starts the reading from its header when the floating button is hidden
defineExpose({isShown, isActive, start: togglePlay});

onUnmounted(() => {
  stop();
  textToSpeechActive.value = false;
});
</script>

<template>
  <ion-fab
      v-if="isShown"
      :class="{
        // While reading, the settings button takes the auto-scroll button's place
        'beside-auto-scroll': isActive || settingsStore.settings.showAutoScroll,
        'tabbar-hidden': !tabbarVisible,
        'tabbar-gone': !tabbarVisible && isNative
      }"
      horizontal="end"
      slot="fixed"
      vertical="bottom"
  >
    <Transition mode="out-in" name="tts-morph">
      <ion-fab-button
          v-if="!isActive && settingsStore.settings.ttsFloatingButton"
          :aria-label="t('tts.start')"
          class="custom-fab-button"
          size="small"
          @click="togglePlay"
      >
        <ion-icon :icon="headsetOutline" aria-hidden="true"/>
      </ion-fab-button>

      <div v-else-if="isActive" :aria-label="t('tts.player')" class="player" role="group">
        <button :aria-label="t('tts.previous')" class="player-button" @click="skip(-1)">
          <ion-icon :icon="playSkipBack" aria-hidden="true"/>
        </button>
        <button :aria-label="t(state === 'playing' ? 'tts.pause' : 'tts.resume')" class="player-button main"
                @click="togglePlay">
          <ion-icon :class="{ 'play-icon': state !== 'playing' }" :icon="state === 'playing' ? pause : playIcon"
                    aria-hidden="true"/>
        </button>
        <button :aria-label="t('tts.next')" class="player-button" @click="skip(1)">
          <ion-icon :icon="playSkipForward" aria-hidden="true"/>
        </button>
        <span :class="{ paused: state === 'paused' }" class="player-section">{{ section }}</span>
        <button :aria-label="t('tts.speed')" class="player-button rate" @click="cycleRate">{{ rateLabel }}</button>
        <button :aria-label="t('tts.stop')" class="player-button" @click="stop">
          <ion-icon :icon="closeOutline" aria-hidden="true"/>
        </button>
        <span :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" class="player-progress"></span>
      </div>
    </Transition>
  </ion-fab>

  <Transition name="tts-settings">
    <ion-fab
        v-if="isShown && isActive"
        :class="{ 'tabbar-hidden': !tabbarVisible, 'tabbar-gone': !tabbarVisible && isNative }"
        class="settings-fab"
        horizontal="end"
        slot="fixed"
        vertical="bottom"
    >
      <ion-fab-button :aria-label="t('tts.settings')" class="custom-fab-button" size="small" @click="openSettings">
        <ion-icon :icon="settingsOutline" aria-hidden="true"/>
      </ion-fab-button>
    </ion-fab>
  </Transition>

  <ion-popover
      :arrow="false"
      :event="settingsEvent"
      :is-open="settingsOpen"
      alignment="end"
      class="tts-settings-popover"
      side="top"
      @didDismiss="settingsOpen = false"
  >
    <TextToSpeechQuickSettings/>
  </ion-popover>
</template>

<style scoped>
/* Same placement as AutoScrollButton; when that one is shown this sits to its left
   (its 40px button + 12px gap). */
ion-fab {
  --tabbar-top: calc(var(--ion-safe-area-bottom, 0px) + 69px);
  --fab-margin: 16px;
  --beside: 0px;
  margin: var(--fab-margin);
  margin-right: calc(var(--fab-margin) + var(--beside));
  bottom: var(--tabbar-top) !important;
  transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-right 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

ion-fab.beside-auto-scroll {
  --beside: 52px;
}

/* The settings button sits exactly where the auto-scroll button was */
ion-fab.settings-fab {
  --beside: 0px;
}

ion-fab.tabbar-hidden {
  --tabbar-top: calc(var(--ion-safe-area-bottom, 0px) + 19px);
}

ion-fab.tabbar-gone {
  --tabbar-top: var(--ion-safe-area-bottom, 0px);
}

.custom-fab-button {
  --box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  --background: var(--ion-color-primary);
  --background-hover: var(--background-color-card);
  --background-focused: var(--ion-color-primary);
  --background-activated: var(--background-color-card);
  --color: var(--ion-color-primary-contrast, #fff);
  --color-hover: var(--ion-color-primary);
  --color-focused: var(--ion-color-primary-contrast, #fff);
  --color-activated: var(--ion-color-primary);
}

.custom-fab-button::part(native) {
  transition: background-color 0.15s ease, color 0.15s ease;
}

.custom-fab-button:hover::part(native) {
  background-color: var(--background-color-card) !important;
}

.custom-fab-button:hover ion-icon {
  color: var(--ion-color-primary) !important;
}

/* Player: grows to the left from where the button was, vertically centred with the
   autoscroll button (small fab buttons are 40px with an 8px margin). */
.player {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  box-sizing: border-box;
  width: min(360px, calc(100vw - 10px - 2 * var(--fab-margin) - var(--beside) - 16px - var(--ion-safe-area-left, 0px) - var(--ion-safe-area-right, 0px)));
  height: 44px;
  margin: 6px 8px;
  padding: 0 4px;
  overflow: hidden;
  border-radius: 22px;
  background: var(--background-color-card, var(--ion-background-color, #fff));
  /* The light theme doesn't set --ion-text-color, so fall back like Ionic does */
  color: var(--ion-text-color, #000);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transform-origin: right center;
}

.player-button {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  /* The global button style adds a border that turns blue on hover */
  border: none;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 1.1rem;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.15s ease, transform 0.1s ease;
}

.player-button:active {
  transform: scale(0.92);
  background: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.08);
}

.player-button.main {
  background: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast, #fff);
}

.player-button.rate {
  width: auto;
  min-width: 36px;
  padding: 0 6px;
  border-radius: 18px;
  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.play-icon {
  transform: translateX(1px);
}

.player-section {
  flex: 1;
  min-width: 0;
  padding: 0 4px;
  overflow: hidden;
  font-size: 0.8rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.75;
  transition: opacity 0.2s ease;
}

.player-section.paused {
  opacity: 0.45;
}

.player-progress {
  position: absolute;
  right: 16px;
  bottom: 0;
  left: 16px;
  height: 2px;
  border-radius: 1px;
  background: var(--ion-color-primary);
  transform-origin: left center;
  transition: transform 0.3s ease;
}

/* Settings button: spins in as the auto-scroll button shrinks away */
.tts-settings-enter-active {
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1), bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tts-settings-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease, bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tts-settings-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-90deg);
}

.tts-settings-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

/* Minimal card above the settings button, in the theme's colours */
ion-popover.tts-settings-popover {
  --width: 272px;
  --background: var(--background-color-card, var(--ion-background-color, #fff));
  --box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  --offset-y: -8px;
}

ion-popover.tts-settings-popover::part(content) {
  border: none;
  border-radius: 18px;
  /* Rises slightly as it fades in; restarts on every open because the popover is display:none while closed */
  animation: tts-settings-in 0.24s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: bottom right;
}

@keyframes tts-settings-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
}

.tts-morph-enter-active,
.tts-morph-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.tts-morph-enter-from,
.tts-morph-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

@media (prefers-reduced-motion: reduce) {
  ion-fab,
  .player-progress,
  .tts-morph-enter-active,
  .tts-morph-leave-active,
  .tts-settings-enter-active,
  .tts-settings-leave-active {
    transition: none;
  }

  ion-popover.tts-settings-popover::part(content) {
    animation: none;
  }
}

@media (min-width: 768px) {
  ion-fab {
    --fab-margin: 24px;
  }
}
</style>

<style>
/* Text being read aloud; global because the text lives in the page's slot */
::highlight(tts-reading) {
  background-color: color-mix(in srgb, var(--ion-color-primary) 22%, transparent);
}

/* Fallback without the CSS Custom Highlight API: the whole paragraph */
.tts-reading {
  border-radius: 6px;
  background: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.06);
  background: color-mix(in srgb, var(--ion-color-primary) 12%, transparent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ion-color-primary) 12%, transparent);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
</style>
