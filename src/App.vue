<script lang="ts" setup>
import {IonApp, IonRouterOutlet, IonTabs} from '@ionic/vue';
import TabsNavbar from "@/components/molecules/TabsNavbar.vue";
</script>

<template>
  <ion-app>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <TabsNavbar/>
    </ion-tabs>
  </ion-app>
</template>
<style>
</style>