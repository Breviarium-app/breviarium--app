<script lang="ts" setup>
import {computed, ref} from 'vue';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {bookmarkOutline, chevronForward} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {type BibleBookMeta, bibleStore} from '@/modules/app/stores/bibleStore.ts';

const {t} = useI18n();
const store = bibleStore();

const searchQuery = ref('');
const testament = ref<'old' | 'new'>('old');

const isSearching = computed(() => searchQuery.value.trim().length > 0);
const results = computed(() => store.searchBooks(searchQuery.value));

const sections = computed<{ key: 'old' | 'new'; title: string; books: BibleBookMeta[] }[]>(() => {
  const all = [
    {key: 'old' as const, title: t('bible.old_testament'), books: results.value.filter((b) => b.testament === 'old')},
    {key: 'new' as const, title: t('bible.new_testament'), books: results.value.filter((b) => b.testament === 'new')},
  ];
  return isSearching.value ? all.filter((section) => section.books.length > 0) : all.filter((section) => section.key === testament.value);
});

const lastRead = computed(() => {
  const position = store.lastRead;
  if (!position || !store.getBookMeta(position.book)) return null;
  return position;
});
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ t('bibleOfJerusalem') }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
            v-model="searchQuery"
            :animated="true"
            :cancel-button-text="t('cancel')"
            :debounce="150"
            :placeholder="t('bible.search_books')"
            show-cancel-button="focus"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="bible-index">
        <router-link
            v-if="lastRead && !isSearching"
            :to="`/bible/${lastRead.book}/${lastRead.chapter}`"
            class="continue-card"
        >
          <ion-icon :icon="bookmarkOutline" aria-hidden="true" class="continue-icon"></ion-icon>
          <span class="continue-text">
            <span class="continue-label">{{ t('bible.continue_reading') }}</span>
            <span class="continue-position">{{ lastRead.book }} {{ lastRead.chapter }}</span>
          </span>
          <ion-icon :icon="chevronForward" aria-hidden="true"></ion-icon>
        </router-link>

        <ion-segment
            v-if="!isSearching"
            v-model="testament"
            class="testament-segment"
        >
          <ion-segment-button value="old">
            <ion-label>{{ t('bible.old_testament') }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="new">
            <ion-label>{{ t('bible.new_testament') }}</ion-label>
          </ion-segment-button>
        </ion-segment>

        <p v-if="isSearching && sections.length === 0" class="empty-state" role="status">
          {{ t('bible.no_results', {query: searchQuery.trim()}) }}
        </p>

        <ion-list v-for="section in sections" :key="section.key" class="book-list" lines="full">
          <ion-item-divider v-if="isSearching" sticky>
            <ion-label>{{ section.title }}</ion-label>
          </ion-item-divider>
          <ion-item
              v-for="book in section.books"
              :key="book.name"
              :router-link="`/bible/${book.name}`"
              :detail="true"
          >
            <span slot="start" aria-hidden="true" class="book-abbreviation">{{ book.abbreviation }}</span>
            <ion-label>
              <h2 class="book-name">{{ book.name }}</h2>
              <p>{{ t('bible.chapters_count', {n: book.chapters}, book.chapters) }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.bible-index {
  max-width: 720px;
  margin: 0 auto;
  padding: 0.75rem 0 8rem;
}

.continue-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin: 0.25rem 1rem 1rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: var(--background-color-card);
  color: var(--ion-text-color);
  font-weight: 400;
}

.continue-card:active {
  transform: scale(0.99);
}

.continue-icon {
  font-size: 1.4rem;
  color: var(--ion-color-primary);
}

.continue-text {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.continue-label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
}

.continue-position {
  font-size: 1.15rem;
}

.testament-segment {
  width: auto;
  margin: 0 1rem 0.5rem;
}

.book-list {
  background: transparent;
}

ion-item-divider {
  --background: var(--ion-background-color);
  --color: var(--ion-color-primary);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.book-abbreviation {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  height: 2.75rem;
  padding: 0 0.4rem;
  border-radius: 10px;
  background: var(--background-color-card);
  color: var(--ion-color-primary);
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.book-name {
  font-size: 1.05rem;
}

.empty-state {
  margin: 3rem 1.5rem;
  text-align: center;
  opacity: 0.75;
}
</style>
