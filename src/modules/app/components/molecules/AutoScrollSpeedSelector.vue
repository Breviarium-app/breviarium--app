<template>
  <ion-item>
    <ion-toggle
        v-model="settingsStore.settings.showAutoScroll"
        @ionChange="handleToggleChange"
    >
      {{ t('settings.show_auto_scroll') }}
    </ion-toggle>
  </ion-item>
  <template v-if="settingsStore.settings.showAutoScroll">
    <ion-item lines="none">
      <div class="speed-container">
        <ion-label>{{ t('settings.auto_scroll_speed') }}</ion-label>
      </div>
    </ion-item>
    <ion-item>
      <div class="speed-control">
        <ion-range
            v-model="settingsStore.settings.autoScrollSpeed"
            :max="20"
            :min="1"
            :onIonChange="handleSpeedChange"
            :step="1"
            color="primary"
        >
          <ion-icon slot="start" :icon="playCircleOutline" size="medium"></ion-icon>
          <ion-icon slot="end" :icon="playForwardCircleOutline" size="medium"></ion-icon>
        </ion-range>
      </div>
    </ion-item>
  </template>
</template>

<script lang="ts" setup>
import {IonIcon, IonItem, IonLabel, IonRange, IonToggle} from '@ionic/vue';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import HapticsService from "@/modules/app/services/HapticsService.ts";
import {useI18n} from 'vue-i18n';
import {playCircleOutline, playForwardCircleOutline} from 'ionicons/icons';

const {t} = useI18n()
const settingsStore = useSettingsStore();

const saveWithFeedback = () => {
  settingsStore.saveSettings();
  HapticsService.light();
};

const handleToggleChange = () => saveWithFeedback();

const handleSpeedChange = (event: CustomEvent) => {
  settingsStore.settings.autoScrollSpeed = event.detail.value;
  saveWithFeedback();
};
</script>

<style scoped>
.speed-control {
  width: 100%;
}

.speed-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-text {
  text-align: center;
  width: 100%;
  padding: 0 0 0.5rem 0;
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>