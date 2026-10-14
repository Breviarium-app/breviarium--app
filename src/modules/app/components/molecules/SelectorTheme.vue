<template>
  <div class="setting-block">
    <span id="theme-label" class="setting-label">{{ t('settings.theme') }}</span>
    <div aria-labelledby="theme-label" class="themes" role="radiogroup">
      <button v-for="option in options" :key="option.value" :aria-checked="theme === option.value"
              :class="{ active: theme === option.value }" class="theme-option btn" role="radio"
              @click="apply(option.value)">
        <span :style="{ background: option.background }" aria-hidden="true" class="swatch">
          <span :style="{ background: option.card }" class="swatch-card"/>
          <span :style="{ background: option.accent }" class="swatch-dot"/>
        </span>
        <span class="theme-name">{{ t(option.value) }}</span>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import HapticsService from "@/modules/app/services/HapticsService.ts";

const {t} = useI18n();
const {applyTheme, settings} = useSettingsStore();
const theme = ref(settings.theme);

// Miniature of each theme's background, card and accent colours (see style.css)
const options = [
  {value: 'system', background: 'linear-gradient(135deg, #f8f9fb 50%, #121212 50%)', card: 'rgba(128, 128, 128, 0.35)', accent: '#be4747'},
  {value: 'light', background: '#f8f9fb', card: '#e9ebed', accent: '#be4747'},
  {value: 'paper', background: '#f5e6d3', card: '#e1d0ba', accent: '#b1773c'},
  {value: 'moon', background: '#15202b', card: '#1b2e42', accent: '#4e82b8'},
  {value: 'dark', background: '#121212', card: '#222222', accent: '#be4747'},
];

const apply = (x: string) => {
  theme.value = x;
  applyTheme(x);
  HapticsService.light();
}
</script>
<style scoped>
.setting-block {
  padding: 0.8rem 1rem 1rem;
}

.themes {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-weight: 400;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}

.swatch {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.12);
  transition: box-shadow 0.15s ease;
}

.swatch-card {
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: 18%;
  height: 26%;
  border-radius: 5px;
}

.swatch-dot {
  position: absolute;
  top: 16%;
  left: 18%;
  width: 22%;
  aspect-ratio: 1;
  border-radius: 50%;
}

.active .swatch {
  box-shadow: 0 0 0 2px var(--ion-background-color), 0 0 0 4px var(--ion-color-primary);
}

.theme-name {
  font-size: 0.75rem;
  opacity: 0.7;
}

.active .theme-name {
  opacity: 1;
  color: var(--ion-color-primary);
}

@media (prefers-reduced-motion: reduce) {
  .swatch {
    transition: none;
  }
}
</style>
