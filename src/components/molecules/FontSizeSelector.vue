<template>
  <ion-item lines="none">
    <div class="preview-container">
      <ion-label>{{ t('settings.font_size') }}</ion-label>
      <div :style="previewStyle" class="preview-text">
        {{ t('settings.sample_text') }}
      </div>
    </div>
  </ion-item>
  <ion-item>
    <div class="font-size-control">
      <ion-range
          v-model="settingsStore.settings.fontSize"
          :max="30  "
          :min="12"
          :onIonChange="handleFontSizeChange"
          :step="1"
      >
        <div slot="start">A</div>
        <div slot="end" style="font-size: 1.5em">A</div>
      </ion-range>
    </div>
  </ion-item>
</template>

<script lang="ts" setup>
import {IonItem, IonLabel, IonRange} from '@ionic/vue';
import {useSettingsStore} from '@/stores/settingsStore';
import HapticsService from "@/services/HapticsService";
import {useI18n} from 'vue-i18n'
import {computed} from 'vue';

const {t} = useI18n()
const settingsStore = useSettingsStore();

const previewStyle = computed(() => ({
  fontSize: `${settingsStore.settings.fontSize}px`
}));

const handleFontSizeChange = (event: CustomEvent) => {
  const newSize = event.detail.value;
  settingsStore.settings.fontSize = newSize;
  document.documentElement.style.fontSize = `${newSize}px`;
  console.log(`Font size changed to ${newSize}px`);
  settingsStore.saveSettings();
  HapticsService.light();
};
</script>

<style scoped>
.font-size-control {
  width: 100%;
}

.preview-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-text {
  text-align: center;
  width: 100%;
  padding: 0 0 0.7rem 0;
}
</style>