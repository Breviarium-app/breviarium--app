<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>Libro: {{ $route.params.id }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Libro: {{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <router-link v-for="item in chapters"
                     :to="`/bible/${$route.params.id}/${item['chapter']}`"
                     class="chapter-box">
          {{ item["chapter"] }}
        </router-link>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {bibleStore} from "@/modules/app/stores/bibleStore.ts";
import {useRoute} from "vue-router";
import router from "@/modules/app/router";

const store = bibleStore();
let chapters: any = undefined
try {
  chapters = store.getChapters(useRoute().params.id);
} catch (e) {
  alert(e)
  router.push('/home')
}


</script>

<style scoped>
#container {
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: var(--ion-color-dark);
  margin: 0;
}

#container a {
  text-decoration: none;
  color: var(--ion-text-color);
}

.chapter-box {
  margin: 7px;
  font-size: 1.5em;
  background-color: var(--background-color-card);
  width: 57px;
  height: 57px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  box-shadow: 1px 1px 2px var(--background-card-shadow);
}
</style>
