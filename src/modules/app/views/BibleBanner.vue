<template>
  <ion-item :detail="true" class="prayer-item" @click="router.push('/bible')">
    <ion-icon slot="start" :icon="bookOutline"></ion-icon>
    <ion-label>
      <h2>{{ t('bible_name') }}</h2>
      <p>{{ t('bibleSubtitle') }}</p>
    </ion-label>
  </ion-item>
</template>
<script lang="ts" setup>

import router from "@/modules/app/router";
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