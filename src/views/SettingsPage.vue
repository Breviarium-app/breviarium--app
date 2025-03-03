<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/vue';
import { useSettingsStore } from '@/stores/settingsStore.ts'; // Adjust path as needed

const settingsStore = useSettingsStore();

watch(() => settingsStore.settings.theme, (newTheme) => {
  settingsStore.applyTheme(newTheme);
  settingsStore.saveSettings();
});

</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>Theme</ion-label>
          <ion-select v-model="settingsStore.settings.theme" interface="action-sheet">
            <ion-select-option v-for="theme in settingsStore.themes" :key="theme.value" :value="theme.value">
              {{ theme.label }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label>Laudes + Officium</ion-label>
          <ion-toggle v-model="settingsStore.settings.laudesOfficium" @ionChange="settingsStore.saveSettings"></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>Laudes + Evangelium</ion-label>
          <ion-toggle v-model="settingsStore.settings.laudesEvangelium" @ionChange="settingsStore.saveSettings"></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>Vesperae + Officium</ion-label>
          <ion-toggle v-model="settingsStore.settings.vesperaeOfficium" @ionChange="settingsStore.saveSettings"></ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style scoped>
:deep(.ion-page) {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>