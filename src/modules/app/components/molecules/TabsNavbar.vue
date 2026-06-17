<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
    </ion-tabs>
    <TabsComponent/>
  </ion-page>
</template>
<script lang="ts" setup>
import {IonPage, IonRouterOutlet, IonTabs} from '@ionic/vue';
import TabsComponent from "@/modules/app/components/molecules/TabsComponent.vue";
</script>
<style>
ion-tabs .tabs-inner ion-router-outlet .ion-page ion-content::part(scroll) {
  padding-bottom: 0px;
}
</style>
