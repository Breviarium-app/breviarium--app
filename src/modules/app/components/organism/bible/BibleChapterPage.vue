<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>Libro: {{ $route.params.id }} | Capítulo {{ $route.params.chapter }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Libro: {{ $route.params.id }}</ion-title>
          <ion-item>Capítulo {{ $route.params.chapter }}</ion-item>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <!--        <router-link class="chapter-box" v-for="item in store.getChapters($route.params.id)"-->
        <!--                     :to="`/bible/${$route.params.id}/${item['chapter']}`">-->
        <!--          {{ item["chapter"] }}-->
        <!--        </router-link>-->
        <ion-list>
          <p v-for="(item, x) in store.getVersiculums({name: decodeURI($route.params?.id?.toString()), number: $route.params?.chapter?.toString()})['verses']">
            <small class="versiculum-number">{{ x }}</small> {{ item }}
          </p>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {bibleStore} from "@/modules/app/stores/bibleStore.ts";

const store = bibleStore();


</script>

<style scoped>
#container {
  text-align: left;
  padding: 1em 1.5em;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

p {
  font-size: 16px;
  line-height: 22px;
  color: var(--ion-text-color);
  margin: 0 0 5px 0;
}

.versiculum-number {
  color: var(--ion-color-primary)
}

#container a {
  text-decoration: none;
}

</style>
