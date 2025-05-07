<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {useRoute} from 'vue-router';
import {useSettingsStore} from "@/stores/settingsStore.ts";
import {computed} from "vue";

const route = useRoute();
const prayerType = route.params.type;

defineProps({
  title: {
    required: false,
  }
})

const getPrayerTitle = (type: string) => {
  const titles: { [key: string]: string } = {
    'evangelium-and-lectiones': 'Evangelio y lecturas',
    laudes: 'Laudes',
    vesperae: 'Vísperas',
    officium: 'Oficio',
    tertia: 'Tercia',
    sexta: 'Sexta',
    nona: 'Nona',
    completorium: 'Completas',
    lectiones: 'Lecturas'
  };
  return titles[type as string] || type;
};

const settingsStore = useSettingsStore();

const prayerWrapperStyle = computed(() => ({
  fontSize: `${settingsStore.settings.fontSize * 1.2}px`,
  lineHeight: `${settingsStore.settings.fontSize * 1.7}px`
}));

</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title || getPrayerTitle(prayerType as string) }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="prayer-page">
        <div :style="prayerWrapperStyle" class="prayer-wrapper">
          <slot></slot>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<style scoped>
.prayer-page {
  display: flex;
  justify-content: center;
}

.prayer-wrapper {
  display: block;
  max-width: min(800px, 100%);
  font-size: 1.2rem;
}

:deep(.prayer-wrapper p) {
  margin: 0 0 0.7rem 0;
}
</style>