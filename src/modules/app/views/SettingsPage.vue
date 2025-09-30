<script lang="ts" setup>
import {watch} from 'vue';
import {IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToggle, IonToolbar} from '@ionic/vue';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import VersionNumber from "@/modules/app/components/molecules/VersionNumber.vue";
import SelectorTheme from "@/modules/app/components/molecules/SelectorTheme.vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";
import FontSizeSelector from "@/modules/app/components/molecules/FontSizeSelector.vue";

const settingsStore = useSettingsStore();


watch(() => settingsStore.settings.theme, (newTheme) => {
  settingsStore.applyTheme(newTheme);
  settingsStore.saveSettings();
});
const handleToggleChange = () => {
  settingsStore.saveSettings();
  HapticsService.light();
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
        <!--        <ion-item>-->
        <!--          <LanguageSelector></LanguageSelector>-->
        <!--        </ion-item>-->
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.laudesEvangelium" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            {{ $t('settings.laudes_and_evangelium') }}
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.laudesOfficium" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            {{ $t('settings.laudes_and_office') }}
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
          <ion-toggle v-model="settingsStore.settings.hideInvitatorium" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            {{ $t('settings.hide_invitatorium') }}
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.deceased" :ionChange="handleToggleChange()"
                      disabled="true"
                      justify="space-between" label-placement="start">
            {{ $t('settings.office_deceased') }}
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.hapticsActive" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            {{ $t('settings.haptics_active') }}
          </ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="settingsStore.settings.keepAwake" :ionChange="handleToggleChange()"
                      justify="space-between"
                      label-placement="start">
            {{ $t('settings.keepAwake') }}
          </ion-toggle>
        </ion-item>
        <FontSizeSelector/>
        <ion-item lines="none">
          <ion-label>{{ $t('settings.theme') }}</ion-label>
        </ion-item>
        <ion-item class="ion-text-center" lines="none">
          <SelectorTheme/>
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