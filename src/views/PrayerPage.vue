<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {useRoute} from 'vue-router';

const route = useRoute();
const prayerType = route.params.type;

const getPrayerTitle = (type: string) => {
  const titles: { [key: string]: string } = {
    evangelium: 'Evangelio',
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
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ getPrayerTitle(prayerType as string) }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Prayer content will be added here -->
      <p>Content for {{ getPrayerTitle(prayerType as string) }}</p>
    </ion-content>
  </ion-page>
</template>