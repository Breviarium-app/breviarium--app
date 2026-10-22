<template>
  <div>
    <SettingToggle
        v-model="settingsStore.settings.showTextToSpeech"
        :hint="isSupported ? t('settings.hints.show_text_to_speech') : t('settings.hints.tts_unsupported')"
        :label="t('settings.show_text_to_speech')"
        :disabled="!isSupported"
        @update:modelValue="saveWithFeedback"
    />
    <template v-if="isSupported && settingsStore.settings.showTextToSpeech">
      <div class="tts-block">
        <ion-select
            v-model="settingsStore.settings.ttsVoice"
            :cancel-text="t('cancel')"
            :label="t('settings.tts_voice')"
            interface="action-sheet"
            @ionChange="saveWithFeedback"
        >
          <ion-select-option value="">{{ t('settings.tts_voice_default') }}</ion-select-option>
          <ion-select-option v-for="voice in voiceOptions" :key="voice.value" :value="voice.value">
            {{ voice.label }}
          </ion-select-option>
        </ion-select>
        <span class="setting-hint">{{ t('settings.hints.tts_voice') }}</span>
      </div>
      <div class="tts-block">
        <span class="setting-label">{{ t('settings.tts_rate') }} · {{ settingsStore.settings.ttsRate.toFixed(1) }}×</span>
        <ion-range
            v-model="settingsStore.settings.ttsRate"
            :aria-label="t('settings.tts_rate')"
            :max="2"
            :min="0.5"
            :step="0.1"
            @ionChange="saveWithFeedback"
        >
          <ion-icon slot="start" :icon="playOutline" aria-hidden="true"></ion-icon>
          <ion-icon slot="end" :icon="playForwardOutline" aria-hidden="true"></ion-icon>
        </ion-range>
      </div>
      <div class="tts-block">
        <span class="setting-label">{{ t('settings.tts_pitch') }} · {{ settingsStore.settings.ttsPitch.toFixed(1) }}</span>
        <ion-range
            v-model="settingsStore.settings.ttsPitch"
            :aria-label="t('settings.tts_pitch')"
            :max="2"
            :min="0.5"
            :step="0.1"
            @ionChange="saveWithFeedback"
        >
          <ion-icon slot="start" :icon="chevronDownOutline" aria-hidden="true"></ion-icon>
          <ion-icon slot="end" :icon="chevronUpOutline" aria-hidden="true"></ion-icon>
        </ion-range>
      </div>
      <div class="tts-block tts-actions">
        <ion-button fill="outline" shape="round" size="small" @click="testVoice">
          <ion-icon slot="start" :icon="volumeHighOutline" aria-hidden="true"></ion-icon>
          {{ t('settings.tts_test') }}
        </ion-button>
        <ion-button v-if="isAndroid" fill="clear" shape="round" size="small" @click="TextToSpeechService.openInstall()">
          <ion-icon slot="start" :icon="downloadOutline" aria-hidden="true"></ion-icon>
          {{ t('settings.tts_install') }}
        </ion-button>
      </div>
      <span v-if="isAndroid" class="setting-hint install-hint">{{ t('settings.hints.tts_install') }}</span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {IonButton, IonIcon, IonRange, IonSelect, IonSelectOption} from '@ionic/vue';
import {chevronDownOutline, chevronUpOutline, downloadOutline, playForwardOutline, playOutline, volumeHighOutline} from 'ionicons/icons';
import {Capacitor} from '@capacitor/core';
import {useI18n} from 'vue-i18n';
import type {SpeechSynthesisVoice} from '@capacitor-community/text-to-speech';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import HapticsService from '@/modules/app/services/HapticsService.ts';
import {TextToSpeechService} from '@/modules/app/services/TextToSpeechService.ts';
import SettingToggle from '@/modules/app/components/molecules/settings/SettingToggle.vue';

const {t} = useI18n();
const settingsStore = useSettingsStore();
const isSupported = TextToSpeechService.isSupported();
const isAndroid = Capacitor.getPlatform() === 'android';
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

const saveWithFeedback = () => {
  settingsStore.saveSettings();
  HapticsService.light();
};

const testVoice = async () => {
  HapticsService.light();
  try {
    // The sample is spoken in Spanish like the prayers, whatever the app language
    await TextToSpeechService.speak(t('settings.sample_text', {}, {locale: 'es'}));
  } catch (error) {
    console.error('Error testing TTS voice:', error);
  }
};

onMounted(() => {
  if (!isSupported) return;
  loadVoices();
  if (listensVoicesChanged) window.speechSynthesis.addEventListener('voiceschanged', reloadVoices);
});

onUnmounted(() => {
  if (isSupported) TextToSpeechService.stop();
  if (listensVoicesChanged) window.speechSynthesis.removeEventListener('voiceschanged', reloadVoices);
});
</script>

<style scoped>
.tts-block {
  display: flex;
  flex-direction: column;
  padding: 0.8rem 1rem 0.25rem;
  border-top: 0.5px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
}

.tts-block ion-select {
  --padding-start: 0;
  min-height: 0;
}

.tts-block ion-icon {
  font-size: 1.1rem;
  opacity: 0.7;
}

.tts-actions {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-bottom: 0.8rem;
}

.tts-actions ion-icon {
  opacity: 1;
}

.setting-hint {
  font-size: 0.8rem;
  line-height: 1.4;
  opacity: 0.6;
}

.install-hint {
  display: block;
  padding: 0 1rem 0.8rem;
}
</style>
