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

      <ion-fab slot="fixed" vertical="bottom" horizontal="start">
        <ion-fab-button v-if="hasPrev" @click="navigateToChapter(currentChapterNumber - 1)">
          <ion-icon :icon="chevronBack"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button v-if="hasNext" @click="navigateToChapter(currentChapterNumber + 1)">
          <ion-icon :icon="chevronForward"></ion-icon>
        </ion-fab-button>
      </ion-fab>
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
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { chevronBack, chevronForward } from 'ionicons/icons';
import { computed } from 'vue';
import {bibleStore} from "@/modules/app/stores/bibleStore.ts";

const store = bibleStore();
const route = useRoute();
const router = useRouter();

const currentBookName = computed(() => {
  const paramId = route.params.id;
  return Array.isArray(paramId) ? paramId[0] : paramId;
});

const currentChapterNumber = computed(() => {
  const paramChapter = route.params.chapter;
  const num = Array.isArray(paramChapter) ? paramChapter[0] : paramChapter;
  return parseInt(num || '1');
});

const totalChapters = computed(() => {
  try {
    // decodeURI might be needed depending on how the ID is passed.
    // The template uses decodeURI($route.params?.id?.toString())
    // Let's match that behavior.
    const id = decodeURI(currentBookName.value || '');
    const chapters = store.getChapters(id);
    return chapters ? chapters.length : 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
});

const hasPrev = computed(() => currentChapterNumber.value > 1);
const hasNext = computed(() => currentChapterNumber.value < totalChapters.value);

const navigateToChapter = (chapterDef: number) => {
  router.push(`/bible/${route.params.id}/${chapterDef}`);
};


</script>

<style scoped>
#container {
  text-align: left;
  padding: 1em 1.5em 5em 1.5em;
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
