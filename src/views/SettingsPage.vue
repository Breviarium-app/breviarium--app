<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
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
import {Preferences} from '@capacitor/preferences';

const settings = ref({
  laudesOfficio: false,
  laudesEvangelio: false,
  vesperaeOfficio: false,
  theme: 'system'
});

const themes = [
  {value: 'system', label: 'System'},
  {value: 'light', label: 'Light'},
  {value: 'paper', label: 'Paper'},
  {value: 'dark', label: 'Dark'}
];

const saveSettings = async () => {
  await Preferences.set({
    key: 'settings',
    value: JSON.stringify(settings.value)
  });
};

const applyTheme = (theme: string) => {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
};

watch(() => settings.value.theme, (newTheme) => {
  applyTheme(newTheme);
  saveSettings();
});

onMounted(async () => {
  const {value} = await Preferences.get({key: 'settings'});
  if (value) {
    settings.value = JSON.parse(value);
    applyTheme(settings.value.theme);
  }
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
          <ion-select v-model="settings.theme" interface="action-sheet">
            <ion-select-option v-for="theme in themes" :key="theme.value" :value="theme.value">
              {{ theme.label }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label>Laudes + Officium</ion-label>
          <ion-toggle v-model="settings.laudesOfficio" @ionChange="saveSettings"></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>Laudes + Evangelium</ion-label>
          <ion-toggle v-model="settings.laudesEvangelio" @ionChange="saveSettings"></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>Vesperae + Officium</ion-label>
          <ion-toggle v-model="settings.vesperaeOfficio" @ionChange="saveSettings"></ion-toggle>
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