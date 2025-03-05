<script lang="ts" setup>
import {watch} from 'vue';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/vue';
import {useSettingsStore} from '@/stores/settingsStore.ts';

const settingsStore = useSettingsStore();


watch(() => settingsStore.settings.theme, (newTheme) => {
  settingsStore.applyTheme(newTheme);
  settingsStore.saveSettings();
});
const handleToggleChange = () => {
  settingsStore.saveSettings();
};

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
          <ion-select v-model="settingsStore.settings.theme" interface="action-sheet" label="Theme">
            <ion-select-option v-for="theme in settingsStore.themes" :key="theme.value" :value="theme.value">
              {{ theme.label }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-toggle v-model="settingsStore.settings.laudesOfficium" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            Laudes + Officium
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.laudesEvangelium" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            Laudes + Evangelium
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.vesperaeOfficium" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            Vesperae + Officium
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.deceased" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            Mostrar oficio difuntos
          </ion-toggle>
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