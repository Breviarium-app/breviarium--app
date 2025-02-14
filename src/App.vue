<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue';
import { homeOutline, settingsOutline, bookOutline } from 'ionicons/icons';
</script>

<template>
  <ion-app>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="bible" href="/bible">
          <ion-icon :icon="bookOutline" />
          <ion-label>Bible</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="settings" href="/settings">
          <ion-icon :icon="settingsOutline" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-app>
</template>

<style>
:root {
  --ion-color-primary: #3880ff;
  --ion-color-secondary: #3dc2ff;
  --ion-color-tertiary: #5260ff;
  --ion-color-success: #2dd36f;
  --ion-color-warning: #ffc409;
  --ion-color-danger: #eb445a;
  --ion-color-medium: #92949c;
  --ion-color-light: #f4f5f8;
}

/* Paper theme */
[data-theme="paper"] {
  --ion-background-color: #f5e6d3;
  --ion-background-color-rgb: 245,230,211;
  --ion-text-color: #2c1810;
  --ion-text-color-rgb: 44,24,16;
  --ion-border-color: #d4b594;
}

[data-theme="dark"] {
  --ion-background-color: #121212;
  --ion-background-color-rgb: 18,18,18;
  --ion-text-color: #ffffff;
  --ion-text-color-rgb: 255,255,255;
}
</style>