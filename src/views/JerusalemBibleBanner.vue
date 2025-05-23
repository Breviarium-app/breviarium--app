<template>
  <ion-item class="prayer-item" @click="router.push('/bible')">
    <ion-icon slot="start" :icon="bookOutline" style="color: var(--gold-color);"></ion-icon>
    <ion-label>
      <h2>{{ t('bibleOfJerusalem') }}</h2>
      <p>{{ t('bibleSubtitle') }}</p>
    </ion-label>
  </ion-item>
</template>
<script lang="ts" setup>

import router from "@/router";
import {IonIcon, IonItem, IonLabel} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import {bookOutline} from "ionicons/icons";

const {t} = useI18n()
</script>
<style scoped>

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>