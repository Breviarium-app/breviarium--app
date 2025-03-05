<template>
  <ion-tab-bar slot="bottom">
    <ion-tab-button href="/" tab="home">
      <ion-icon :icon="bonfireOutline"/>
      <ion-label>Home</ion-label>
    </ion-tab-button>
    <ion-tab-button href="/bible" tab="bible">
      <ion-icon :icon="bookOutline"/>
      <ion-label>Bible</ion-label>
    </ion-tab-button>
    <ion-tab-button href="/settings" tab="settings">
      <ion-icon :icon="settingsOutline"/>
      <ion-label>Settings</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</template>
<script lang="ts" setup>
import {IonIcon, IonLabel, IonTabBar, IonTabButton} from '@ionic/vue';
import {bonfireOutline, bookOutline, settingsOutline} from 'ionicons/icons';
</script>
<style>

</style>
