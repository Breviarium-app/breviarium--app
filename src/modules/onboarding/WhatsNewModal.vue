<template>
  <ion-modal :is-open="isOpen" class="whats-new" @didDismiss="markAsSeen">
    <div class="whats-new-content">
      <img alt="" class="logo" height="56" src="/breviarium-favicon-small.png" width="56"/>
      <h2 class="title">{{ t('whats_new.title') }}</h2>
      <p class="version">{{ t('whats_new.version', {version}) }}</p>

      <ul class="notes">
        <li v-for="note in notes" :key="note.text">
          <ion-icon :icon="note.icon" aria-hidden="true"/>
          <span>{{ note.text }}</span>
        </li>
      </ul>

      <button class="close-button btn" @click="isOpen = false">{{ t('whats_new.close') }}</button>
    </div>
  </ion-modal>
</template>

<script lang="ts" setup>
import {IonIcon, IonModal} from "@ionic/vue";
import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {version} from "../../../package.json";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {RELEASE_NOTES} from "@/modules/onboarding/releaseNotes.ts";
import HapticsService from "@/modules/app/services/HapticsService.ts";

const {t} = useI18n();
const settingsStore = useSettingsStore();

const notes = RELEASE_NOTES[version] ?? [];
const isOpen = ref(false);

// Decide once settings are loaded, since the last seen version is stored with them
watch(() => settingsStore.isLoaded, async (loaded) => {
  if (!loaded || settingsStore.settings.whatsNewSeenVersion === version) return;

  // New users never saw the previous version, so there is nothing "new" to announce
  if (settingsStore.isFirstLaunch || notes.length === 0) {
    settingsStore.settings.whatsNewSeenVersion = version;
    await settingsStore.saveSettings();
    return;
  }
  isOpen.value = true;
}, {immediate: true});

// Any dismissal counts: button, backdrop tap or swipe
const markAsSeen = async () => {
  isOpen.value = false;
  HapticsService.light();
  settingsStore.settings.whatsNewSeenVersion = version;
  await settingsStore.saveSettings();
};
</script>

<style scoped>
ion-modal {
  --height: auto;
  --max-height: 85vh;
  --width: 88%;
  --max-width: 380px;
  --border-radius: 24px;
  --background: var(--ion-background-color);
  margin: auto;
}

.whats-new-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.75rem 1.5rem 1.5rem;
  text-align: center;
}

.logo {
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
}

.title {
  margin: 0.9rem 0 0.15rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.version {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.6;
}

.notes {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-height: 45vh;
  margin: 1.5rem 0;
  padding: 1rem 1.1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 16px;
  list-style: none;
  text-align: left;
  background: var(--background-color-card);
}

.notes li {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  line-height: 1.35;
}

.notes ion-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
  color: var(--ion-color-primary);
}

.close-button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: 999px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 400;
  color: #fff;
  background: var(--ion-color-primary);
}
</style>
