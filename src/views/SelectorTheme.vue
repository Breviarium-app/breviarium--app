<template>
  <ion-grid class="selector-theme">
    <ion-row class="selector-columns">
      <!--      <ion-col>-->
      <!--        <ion-icon :icon="phonePortrait"></ion-icon>-->
      <!--        <ion-label>{{ $t('system') }}</ion-label>-->
      <!--      </ion-col>-->
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
import {contrast, document, moon, sunny} from 'ionicons/icons'
import {useSettingsStore} from "@/stores/settingsStore.ts";
import {ref} from "vue";

const theme = ref('');

const apply = (x: string) => {
  const {applyTheme} = useSettingsStore();
  theme.value = x;
  applyTheme(x);
}
</script>
<style scoped>

.selector-columns ion-col {
  background-color: var(--border-color-light);
  border-radius: 11px;
  padding: 15px 0 9px 0;
  text-align: center;
  cursor: pointer;
}

.active-theme {
  background-color: var(--background-color-card);
}

.selector-columns ion-icon {
  font-size: 1.8em;
}

.selector-columns {
  gap: 1.5vw;
}
</style>