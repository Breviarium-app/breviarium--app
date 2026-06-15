<template>
  <ion-tab-bar slot="bottom" class="liquid-glass-tabbar">
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
ion-tab-bar.liquid-glass-tabbar {
  --border: none;
  position: relative;
  margin: 0 auto 16px;
  width: calc(100% - 48px);
  max-width: 360px;
  border-radius: 28px;
  backdrop-filter: blur(40px) saturate(1.8);
  -webkit-backdrop-filter: blur(40px) saturate(1.8);
  box-shadow:
    0 2px 20px rgba(0, 0, 0, 0.08),
    0 0 0 0.5px rgba(255, 255, 255, 0.3) inset,
    0 1px 0 0.5px rgba(255, 255, 255, 0.2) inset;
  contain: layout style;
}

[data-theme="dark"] ion-tab-bar.liquid-glass-tabbar {
  box-shadow:
    0 2px 24px rgba(0, 0, 0, 0.3),
    0 0 0 0.5px rgba(255, 255, 255, 0.08) inset,
    0 1px 0 0.5px rgba(255, 255, 255, 0.06) inset;
}

[data-theme="moon"] ion-tab-bar.liquid-glass-tabbar {
  box-shadow:
    0 2px 24px rgba(0, 0, 0, 0.3),
    0 0 0 0.5px rgba(78, 130, 184, 0.15) inset,
    0 1px 0 0.5px rgba(78, 130, 184, 0.1) inset;
}

[data-theme="paper"] ion-tab-bar.liquid-glass-tabbar {
  box-shadow:
    0 2px 20px rgba(0, 0, 0, 0.06),
    0 0 0 0.5px rgba(177, 119, 60, 0.15) inset,
    0 1px 0 0.5px rgba(255, 255, 255, 0.3) inset;
}

ion-tab-bar.liquid-glass-tabbar ion-tab-button {
  background: transparent;
  --color: var(--ion-tab-bar-color);
  --color-selected: var(--ion-tab-bar-color-selected);
  --padding-top: 8px;
  --padding-bottom: 8px;
  border-radius: 28px;
  transition: background 0.2s ease;
}

ion-tab-bar.liquid-glass-tabbar ion-tab-button::part(native) {
  border-radius: 28px;
}

ion-tab-bar.liquid-glass-tabbar ion-tab-button.tab-selected {
  background: rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.15);
}
</style>
