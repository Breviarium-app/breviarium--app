<template>
  <ion-item class="prayer-item" @click="router.push('/popular-prayers')">
    <ion-label>
      <h2>Oraciones populares</h2>
      <p>Ángelus, rosario y más</p>
    </ion-label>
  </ion-item>
</template>
<script lang="ts" setup>
import router from "@/modules/app/router";
import {IonItem, IonLabel} from "@ionic/vue";
</script>
<style scoped>
</style>