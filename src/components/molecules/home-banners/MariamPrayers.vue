<template>
  <ion-item class="prayer-item" @click="router.push('/')">
    <ion-label>
      <h2>Oraciones</h2>
      <p>Ángelus y Rosario</p>
    </ion-label>
  </ion-item>
</template>
<script lang="ts" setup>
import router from "@/router";
import {IonItem, IonLabel} from "@ionic/vue";
</script>
<style scoped>
</style>