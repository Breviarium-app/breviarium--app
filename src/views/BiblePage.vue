<script lang="ts" setup>
import {computed, ref} from 'vue';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {Bible} from "biblia-de-jerusalen";

const bible = new Bible();

const searchQuery = ref('');
const bibleBooks = bible.getAllBooks();
const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return bibleBooks.filter(book => book.toLowerCase().includes(query));
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('bible_name') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-searchbar
          v-model="searchQuery"
          :cancel-button-text="$t('cancel')"
          :debounce="200"
          :placeholder="$t('bible.search_books')"
          animated="true"
          show-cancel-button="focus"
      ></ion-searchbar>

      <ion-list>
        <ion-item v-for="book in filteredBooks" :key="book">
          <ion-label>{{ book }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

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