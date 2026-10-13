<template>
  <ion-item :detail="true" class="prayer-item" @click="router.push('/popular-prayers')">
    <ion-icon slot="start" :icon="roseOutline"></ion-icon>
    <ion-label>
      <h2>Oraciones populares</h2>
      <p>Ángelus, rosario y más</p>
    </ion-label>
  </ion-item>
</template>
<script lang="ts" setup>
import router from "@/modules/app/router";
import {IonIcon, IonItem, IonLabel} from "@ionic/vue";
import {roseOutline} from "ionicons/icons";
</script>
<style scoped>
</style>