<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import PrayerAlertsSettings from '@/modules/app/components/molecules/PrayerAlertsSettings.vue';

const {t} = useI18n();
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :text="t('settings.title')" default-href="/settings"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ t('alerts.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="settings">
        <p class="intro">{{ t('alerts.intro') }}</p>
        <div class="settings-group">
          <PrayerAlertsSettings/>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.settings {
  max-width: 560px;
  margin: 0 auto;
  /* Bottom padding keeps the last row clear of the floating tab bar */
  padding: 1rem 1rem 96px;
}

.intro {
  margin: 0 0.25rem 1rem;
  font-size: 0.85rem;
  line-height: 1.45;
  opacity: 0.7;
}

.settings-group {
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-color-card);
}

.settings-group > * + * {
  border-top: 0.5px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
}
</style>
