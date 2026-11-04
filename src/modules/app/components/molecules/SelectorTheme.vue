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

  <Transition name="variant-collapse">
    <div v-if="theme === 'system'" class="setting-block variant-collapse">
      <div class="variant-collapse-content">
        <span id="light-variant-label" class="setting-label">{{ t('settings.customize_light_theme') }}</span>
        <div aria-labelledby="light-variant-label" class="variant-list" role="radiogroup">
          <button v-for="option in lightVariants" :key="option.value" :aria-checked="lightVariant === option.value"
                  :class="{ active: lightVariant === option.value }" class="variant-option btn" role="radio"
                  @click="applyVariant('light', option.value)">
            <span :style="{ background: option.background }" aria-hidden="true" class="variant-swatch">
              <span :style="{ background: option.accent }" class="variant-swatch-dot"/>
            </span>
            <span class="variant-name">{{ t(option.value) }}</span>
            <ion-icon v-if="lightVariant === option.value" :icon="checkmark" aria-hidden="true" class="variant-check"/>
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="variant-collapse">
    <div v-if="theme === 'system'" class="setting-block variant-collapse">
      <div class="variant-collapse-content">
        <span id="dark-variant-label" class="setting-label">{{ t('settings.customize_dark_theme') }}</span>
        <div aria-labelledby="dark-variant-label" class="variant-list" role="radiogroup">
          <button v-for="option in darkVariants" :key="option.value" :aria-checked="darkVariant === option.value"
                  :class="{ active: darkVariant === option.value }" class="variant-option btn" role="radio"
                  @click="applyVariant('dark', option.value)">
            <span :style="{ background: option.background }" aria-hidden="true" class="variant-swatch">
              <span :style="{ background: option.accent }" class="variant-swatch-dot"/>
            </span>
            <span class="variant-name">{{ t(option.value) }}</span>
            <ion-icon v-if="darkVariant === option.value" :icon="checkmark" aria-hidden="true" class="variant-check"/>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
<script lang="ts" setup>
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {IonIcon} from "@ionic/vue";
import {checkmark} from "ionicons/icons";
import HapticsService from "@/modules/app/services/HapticsService.ts";

const {t} = useI18n();
const {applyTheme, setThemeVariant, settings} = useSettingsStore();
const theme = ref(settings.theme);
const lightVariant = ref(settings.lightVariant);
const darkVariant = ref(settings.darkVariant);

// Miniature of each theme's background, card and accent colours (see style.css)
const options = [
  {value: 'system', background: 'linear-gradient(135deg, #f8f9fb 50%, #121212 50%)', card: 'rgba(128, 128, 128, 0.35)', accent: '#be4747'},
  {value: 'light', background: '#f8f9fb', card: '#e9ebed', accent: '#be4747'},
  {value: 'paper', background: '#f5e6d3', card: '#e1d0ba', accent: '#b1773c'},
  {value: 'moon', background: '#15202b', card: '#1b2e42', accent: '#4e82b8'},
  {value: 'dark', background: '#121212', card: '#222222', accent: '#be4747'},
];

// Used when "system" resolves itself to the OS's light/dark appearance
const lightVariants = [
  {value: 'paper', background: '#f5e6d3', card: '#e1d0ba', accent: '#b1773c'},
  {value: 'light', background: '#f8f9fb', card: '#e9ebed', accent: '#be4747'},
];
const darkVariants = [
  {value: 'moon', background: '#15202b', card: '#1b2e42', accent: '#4e82b8'},
  {value: 'dark', background: '#121212', card: '#222222', accent: '#be4747'},
];

const apply = (x: string) => {
  theme.value = x;
  applyTheme(x);
  HapticsService.light();
}

const applyVariant = (mode: 'light' | 'dark', value: string) => {
  if (mode === 'light') lightVariant.value = value;
  else darkVariant.value = value;
  setThemeVariant(mode, value);
  HapticsService.light();
}
</script>
<style scoped>
.setting-block {
  padding: 0.8rem 1rem 1rem;
}

.variant-collapse {
  display: grid;
  grid-template-rows: 1fr;
  padding: 0;
}

.variant-collapse-content {
  min-height: 0;
  padding: 0.8rem 1rem 1rem;
  overflow: hidden;
}

.variant-collapse-enter-active,
.variant-collapse-leave-active {
  overflow: hidden;
  transition: grid-template-rows 0.3s ease;
}

.variant-collapse-enter-active .variant-collapse-content,
.variant-collapse-leave-active .variant-collapse-content {
  transition: opacity 0.2s ease;
}

.variant-collapse-enter-from,
.variant-collapse-leave-to {
  grid-template-rows: 0fr;
}

.variant-collapse-enter-from .variant-collapse-content,
.variant-collapse-leave-to .variant-collapse-content {
  opacity: 0;
}

.themes {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-top: 0.75rem;
}

/* One compact row per option, instead of the big vertical swatch cards above */
.variant-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.75rem;
}

.variant-option {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 0;
  border-radius: 12px;
  background: var(--background);
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 400;
  color: inherit;
  text-align: left;
  box-shadow: inset 0 0 0 1.5px transparent;
  transition: box-shadow 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.variant-option.active {
  box-shadow: inset 0 0 0 1.5px var(--ion-color-primary);
}

.variant-swatch {
  position: relative;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.12);
}

.variant-swatch-dot {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.variant-name {
  flex: 1;
  min-width: 0;
}

.variant-option.active .variant-name {
  color: var(--ion-color-primary);
  font-weight: 500;
}

.variant-check {
  flex-shrink: 0;
  font-size: 1.1rem;
  color: var(--ion-color-primary);
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

.theme-option:focus,
.theme-option:focus-visible {
  outline: none;
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

.theme-name {
  font-size: 0.75rem;
  opacity: 0.7;
}

.active .theme-name {
  opacity: 1;
  color: var(--ion-color-primary);
}

@media (prefers-reduced-motion: reduce) {
  .swatch,
  .variant-option,
  .variant-collapse-enter-active,
  .variant-collapse-leave-active,
  .variant-collapse-enter-active .variant-collapse-content,
  .variant-collapse-leave-active .variant-collapse-content {
    transition: none;
  }
}
</style>
