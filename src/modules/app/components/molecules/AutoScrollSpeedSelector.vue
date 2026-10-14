<template>
  <div>
    <SettingToggle
        v-model="settingsStore.settings.showAutoScroll"
        :hint="t('settings.hints.show_auto_scroll')"
        :label="t('settings.show_auto_scroll')"
        @update:modelValue="saveWithFeedback"
    />
    <div v-if="settingsStore.settings.showAutoScroll" class="speed-block">
      <span class="setting-label">{{ t('settings.auto_scroll_speed') }}</span>
      <ion-range
          v-model="settingsStore.settings.autoScrollSpeed"
          :aria-label="t('settings.auto_scroll_speed')"
          :max="20"
          :min="1"
          :step="1"
          @ionChange="saveWithFeedback"
      >
        <ion-icon slot="start" :icon="playOutline" aria-hidden="true"></ion-icon>
        <ion-icon slot="end" :icon="playForwardOutline" aria-hidden="true"></ion-icon>
      </ion-range>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {IonIcon, IonRange} from '@ionic/vue';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import HapticsService from "@/modules/app/services/HapticsService.ts";
import {useI18n} from 'vue-i18n';
import {playForwardOutline, playOutline} from 'ionicons/icons';
import SettingToggle from "@/modules/app/components/molecules/settings/SettingToggle.vue";

const {t} = useI18n()
const settingsStore = useSettingsStore();

const saveWithFeedback = () => {
  settingsStore.saveSettings();
  HapticsService.light();
};
</script>

<style scoped>
.speed-block {
  padding: 0.8rem 1rem 0.25rem;
  border-top: 0.5px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
}

.speed-block ion-icon {
  font-size: 1.1rem;
  opacity: 0.7;
}
</style>
