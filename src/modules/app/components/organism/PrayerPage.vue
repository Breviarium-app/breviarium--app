<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {useRoute} from 'vue-router';
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {computed} from "vue";
import LiturgyInformation from "@/modules/app/components/molecules/home-banners/LiturgyInformation.vue";
import AutoScrollButton from "@/modules/app/components/atoms/AutoScrollButton.vue";

const route = useRoute();
const prayerType = route.params.type;

defineProps({
  title: {
    required: false,
  },
  displayLiturgicalInfo: {
    required: false,
    default: false,
    type: Boolean,
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
          <div v-if="displayLiturgicalInfo" class="center">
            <LiturgyInformation/>
          </div>
          <slot></slot>
        </div>
      </div>
      <AutoScrollButton />
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
  -webkit-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  user-select: auto !important;
}

:deep(.prayer-wrapper p) {
  margin: 0 0 0.7rem 0;
}
</style>