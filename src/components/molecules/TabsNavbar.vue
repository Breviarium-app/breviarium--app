<template>
  <ion-app>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <TabsComponent/>
    </ion-tabs>
  </ion-app>
</template>
<script lang="ts" setup>
import {IonApp, IonRouterOutlet, IonTabs} from '@ionic/vue';
import TabsComponent from "@/components/molecules/TabsComponent.vue";
</script>
<style>

</style>
