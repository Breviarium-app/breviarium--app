<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <TabsComponent/>
    </ion-tabs>
  </ion-page>

</template>
<script lang="ts" setup>
import {IonPage, IonRouterOutlet, IonTabs} from '@ionic/vue';
import TabsComponent from "@/modules/app/components/molecules/TabsComponent.vue";
</script>
<style>

</style>
