<template>
  <div class="quick-settings">
    <div class="row">
      <span class="label">{{ t('settings.tts_rate') }}</span>
      <div :aria-label="t('settings.tts_rate')" class="chips" role="radiogroup">
        <button v-for="rate in RATE_STEPS" :key="rate"
                :aria-checked="isCurrentRate(rate)"
                :class="{ selected: isCurrentRate(rate) }"
                class="chip"
                role="radio"
                @click="setRate(rate)">
          {{ rate }}×
        </button>
      </div>
    </div>

    <div class="row">
      <span class="label">
        {{ t('settings.tts_pitch') }}
        <span class="value">{{ settingsStore.settings.ttsPitch.toFixed(1) }}</span>
      </span>
      <!-- Saved on release only: every change restarts the sentence being read -->
      <ion-range
          :aria-label="t('settings.tts_pitch')"
          :max="2"
          :min="0.5"
          :step="0.1"
          :value="settingsStore.settings.ttsPitch"
          @ionChange="setPitch($event.detail.value as number)"
      />
    </div>

    <div class="row">
      <span class="label">{{ t('settings.tts_voice') }}</span>
      <ion-select
          :aria-label="t('settings.tts_voice')"
          :cancel-text="t('cancel')"
          :value="settingsStore.settings.ttsVoice"
          interface="action-sheet"
          @ionChange="setVoice($event.detail.value)"
      >
        <ion-select-option value="">{{ t('settings.tts_voice_default') }}</ion-select-option>
        <ion-select-option v-for="voice in voiceOptions" :key="voice.value" :value="voice.value">
          {{ voice.label }}
        </ion-select-option>
      </ion-select>
      <span class="hint">{{ t('tts.voice_hint') }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {IonRange, IonSelect, IonSelectOption} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import HapticsService from '@/modules/app/services/HapticsService.ts';
import {useTtsVoices} from '@/modules/app/composables/useTtsVoices.ts';
import {RATE_STEPS} from '@/modules/app/services/TextToSpeechService.ts';

const {t} = useI18n();
const settingsStore = useSettingsStore();
const {voiceOptions} = useTtsVoices();

const isCurrentRate = (rate: number) => Math.abs(settingsStore.settings.ttsRate - rate) < 0.01;

const save = () => {
  settingsStore.saveSettings();
  HapticsService.light();
};

const setRate = (rate: number) => {
  if (isCurrentRate(rate)) return;
  settingsStore.settings.ttsRate = rate;
  save();
};

const setPitch = (pitch: number) => {
  settingsStore.settings.ttsPitch = pitch;
  save();
};

const setVoice = (voice: string) => {
  settingsStore.settings.ttsVoice = voice;
  save();
};
</script>

<style scoped>
.quick-settings {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.6rem 0;
  color: var(--ion-text-color, #000);
}

.row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
}

.label {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.6;
}

.hint {
  font-size: 0.75rem;
  line-height: 1.35;
  opacity: 0.55;
}

.value {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0;
}

.chips {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.chip {
  flex: 1;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 15px;
  background: transparent;
  color: inherit;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
}

.chip:focus {
  outline: none;
}

.chip:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 1px;
}

.chip:active {
  transform: scale(0.94);
}

.chip.selected {
  background: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast, #fff);
  font-weight: 600;
}

ion-range {
  --knob-size: 20px;
  --bar-height: 3px;
  --height: 30px;
  padding: 0;
  margin: -2px 0 -4px;
}

ion-select {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  min-height: 24px;
  font-size: 0.9rem;
}

@media (prefers-reduced-motion: reduce) {
  .chip {
    transition: none;
  }
}
</style>
