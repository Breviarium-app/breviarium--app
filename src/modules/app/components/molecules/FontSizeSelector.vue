<template>
  <div class="setting-block">
    <span class="setting-label">{{ t('settings.font_size') }}</span>
    <p :style="previewStyle" class="preview-text">{{ t('settings.sample_text') }}</p>
    <ion-range
        v-model="settingsStore.settings.fontSize"
        :aria-label="t('settings.font_size')"
        :max="30"
        :min="12"
        :step="1"
        @ionChange="handleFontSizeChange"
    >
      <span slot="start" aria-hidden="true" class="size-small">A</span>
      <span slot="end" aria-hidden="true" class="size-large">A</span>
    </ion-range>
  </div>
</template>

<script lang="ts" setup>
import {IonRange} from '@ionic/vue';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import HapticsService from "@/modules/app/services/HapticsService.ts";
import {useI18n} from 'vue-i18n'
import {computed} from 'vue';

const {t} = useI18n()
const settingsStore = useSettingsStore();

// Same scale PrayerPage applies, so the preview matches the prayer text
const previewStyle = computed(() => ({
  fontSize: `${settingsStore.settings.fontSize * 1.2}px`,
  lineHeight: `${settingsStore.settings.fontSize * 1.7}px`
}));

const handleFontSizeChange = () => {
  settingsStore.saveSettings();
  HapticsService.light();
};
</script>

<style scoped>
.setting-block {
  padding: 0.8rem 1rem 0.25rem;
}

.preview-text {
  margin: 0.75rem 0 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: var(--ion-background-color);
  text-align: center;
}

.size-small {
  font-size: 0.85rem;
}

.size-large {
  font-size: 1.4rem;
}
</style>
