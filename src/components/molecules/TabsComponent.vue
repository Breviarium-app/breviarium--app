<template>
  <ion-tab-bar slot="bottom">
    <ion-tab-button href="/home" tab="home">
      <ion-icon :icon="bonfireOutline"/>
      <ion-label>{{ $t('home') }}</ion-label>
    </ion-tab-button>
    <ion-tab-button href="/prayer-intentions" tab="prayer-intentions">
      <ion-icon :icon="listOutline"/>
      <ion-label>{{ $t('prayer_intentions') }}</ion-label>
    </ion-tab-button>
    <ion-tab-button href="/settings" tab="settings">
      <ion-icon :icon="settingsOutline"/>
      <ion-label>{{ $t('settings.title') }}</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</template>
<script lang="ts" setup>
import {IonIcon, IonLabel, IonTabBar, IonTabButton} from '@ionic/vue';
import {bonfireOutline, listOutline, settingsOutline} from 'ionicons/icons';
</script>
<style>

</style>
