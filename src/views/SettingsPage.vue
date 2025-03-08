<script lang="ts" setup>
import {watch} from 'vue';
import {IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToggle, IonToolbar} from '@ionic/vue';
import {useSettingsStore} from '@/stores/settingsStore.ts';
import LanguageSelector from "@/components/molecules/LanguageSelector.vue";
import SelectorTheme from "@/views/SelectorTheme.vue";
import VersionNumber from "@/components/molecules/VersionNumber.vue";

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
        <ion-title>{{ $t('settings.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item lines="none">
          <ion-label>{{ $t('settings.theme') }}</ion-label>
        </ion-item>
        <ion-item class="ion-text-center" lines="none">
          <SelectorTheme/>
        </ion-item>
        <ion-item>
          <LanguageSelector></LanguageSelector>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.laudesOfficium" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            {{ $t('settings.laudes_and_office') }}
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.laudesEvangelium" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            {{ $t('settings.laudes_and_evangelium') }}
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.vesperaeOfficium" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            {{ $t('settings.vesperae_and_office') }}
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.deceased" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            {{ $t('settings.office_deceased') }}
          </ion-toggle>
        </ion-item>
        <ion-item lines="none">
          <ion-label>
            <VersionNumber/>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>