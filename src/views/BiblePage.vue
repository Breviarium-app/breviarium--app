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
        <ion-title>{{ $t('bible') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-searchbar
          v-model="searchQuery"
          :debounce="300"
          placeholder="Search books..."
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
:deep(.ion-page) {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>