<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {useRoute} from 'vue-router';

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
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title || getPrayerTitle(prayerType as string) }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <slot></slot>
    </ion-content>
  </ion-page>
</template>