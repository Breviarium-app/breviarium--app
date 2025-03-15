<template>
  <ion-grid class="selector-theme">
    <ion-row class="selector-columns">
      <!--      <ion-col>-->
      <!--        <ion-icon :icon="phonePortrait"></ion-icon>-->
      <!--        <ion-label>{{ $t('system') }}</ion-label>-->
      <!--      </ion-col>-->
      <ion-col :class="theme == 'system' ? 'active-theme' : ''" @click="apply('system')">
        <ion-icon :icon="phonePortrait"></ion-icon>
        <ion-label>{{ $t('system') }}</ion-label>
      </ion-col>
      <ion-col :class="theme == 'light' ? 'active-theme' : ''" @click="apply('light')">
        <ion-icon :icon="sunny"></ion-icon>
        <ion-label>{{ $t('light') }}</ion-label>
      </ion-col>
      <ion-col :class="theme == 'paper' ? 'active-theme' : ''" @click="apply('paper')">
        <ion-icon :icon="document"></ion-icon>
        <ion-label>{{ $t('paper') }}</ion-label>
      </ion-col>
      <ion-col :class="theme == 'moon' ? 'active-theme' : ''" @click="apply('moon')">
        <ion-icon :icon="moon"></ion-icon>
        <ion-label>{{ $t('moon') }}</ion-label>
      </ion-col>
      <ion-col :class="theme == 'dark' ? 'active-theme' : ''" @click="apply('dark')">
        <ion-icon :icon="contrast"></ion-icon>
        <ion-label>{{ $t('dark') }}</ion-label>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
<script lang="ts" setup>
import {IonCol, IonGrid, IonIcon, IonLabel, IonRow} from '@ionic/vue';
import {contrast, document, moon, phonePortrait, sunny} from 'ionicons/icons'
import {useSettingsStore} from "@/stores/settingsStore.ts";
import {ref} from "vue";
import HapticsService from "@/services/HapticsService.ts";

const {applyTheme, settings} = useSettingsStore();
const theme = ref(settings.theme);

const apply = (x: string) => {
  theme.value = x;
  applyTheme(x);
  HapticsService.light();
}
</script>
<style scoped>

ion-grid {
  --ion-grid-padding: 0px;
}

.selector-columns ion-col {
  background-color: var(--border-color-light);
  border-radius: 11px;
  padding: 10px 0 9px 0;
  text-align: center;
  cursor: pointer;
}

.active-theme {
  background-color: var(--background-accent) !important;
}

.selector-columns ion-icon {
  font-size: 1.8em;
}

.selector-columns {
  gap: 1.5vw;
}
</style>