<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {useSanctusStore} from "@/stores/sanctus/sanctus.ts";
import {MONTH_SPANISH} from "@/constants";
import {ref} from "vue";

const {selectedSaint, saintsOfDay} = useSanctusStore();
let todaySaint = ref<any | undefined>(selectedSaint);
</script>
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>Santo del día</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>{{ todaySaint?.name }}</h2>
      <p>
        <span v-if="todaySaint?.day">🗓️ Festividad: {{ todaySaint?.day }} de {{
            MONTH_SPANISH[todaySaint?.month - 1]
          }}</span>
        <span v-if="todaySaint?.birth"><br/>👶 Nacimiento: {{ todaySaint?.birth }}</span>
        <span v-if="todaySaint?.dead"><br/>🪦 Muerte: {{ todaySaint?.dead }}</span>
        <span v-if="todaySaint?.meaning"><br/>🔠 Significado: {{ todaySaint?.meaning }}</span>
        <span v-if="todaySaint?.description"><br/>📜 {{ todaySaint?.description }}</span>
      </p>

      <ul v-if="saintsOfDay.length > 1">
        <li v-for="(saint, index) in saintsOfDay.slice(1)" :key="index">{{saint.name}}</li>
      </ul>
    </ion-content>
  </ion-page>
</template>
<style scoped>
p {
  text-align: left;
}

h2 {
  color: var(--ion-color-primary);
}
</style>