<template>
  <ion-segment v-model="settingsStore.settings.latinPrayers" @ionChange="settingsStore.saveSettings()">
    <ion-segment-button value="es">
      <ion-label>Español</ion-label>
    </ion-segment-button>
    <ion-segment-button value="la">
      <ion-label>Latín</ion-label>
    </ion-segment-button>
  </ion-segment>
</template>
<script lang="ts" setup>
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";

// Shared by every prayer with a Latin version; the choice is the "prefer Latin prayers" setting
const settingsStore = useSettingsStore();
</script>
