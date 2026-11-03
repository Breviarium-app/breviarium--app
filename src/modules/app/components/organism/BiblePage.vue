<script lang="ts" setup>
import {computed, ref} from 'vue';
import {IonButton, IonIcon, IonSearchbar} from '@ionic/vue';
import {bookmarkOutline, chevronForward, gitNetworkOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {bibleStore} from '@/modules/app/stores/bibleStore.ts';
import BasePage from '@/modules/escrute/components/BasePage.vue';

const {t} = useI18n();
const store = bibleStore();

const searchQuery = ref('');

const isSearching = computed(() => searchQuery.value.trim().length > 0);
const results = computed(() => store.searchBooks(searchQuery.value));

const sections = computed(() => [
  {key: 'old', title: t('bible.old_testament'), books: results.value.filter((b) => b.testament === 'old')},
  {key: 'new', title: t('bible.new_testament'), books: results.value.filter((b) => b.testament === 'new')},
].filter((section) => section.books.length > 0));

const lastRead = computed(() => {
  const position = store.lastRead;
  if (!position || !store.getBookMeta(position.book)) return null;
  return position;
});
</script>

<template>
  <BasePage :eyebrow="t('bible.eyebrow')" :title="t('bible_name')" back-href="/">
    <template #end>
      <ion-button :aria-label="t('escrute.title')" router-link="/diary?section=escrutes">
        <ion-icon slot="icon-only" :icon="gitNetworkOutline" aria-hidden="true"></ion-icon>
      </ion-button>
    </template>
    <template #subtitle>{{ t('bible.books_count', {n: store.books.length}, store.books.length) }}</template>

    <ion-searchbar
        v-model="searchQuery"
        :debounce="150"
        :placeholder="t('bible.search_books')"
        class="filter"
        show-clear-button="focus"
    ></ion-searchbar>

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

    <section v-for="section in sections" :key="section.key" class="testament">
      <h2 class="testament-title">{{ section.title }}</h2>
      <ul class="books">
        <li v-for="book in section.books" :key="book.name">
          <router-link :to="`/bible/${book.name}`" class="book">
            <span class="book-name">{{ book.name }}</span>
            <span class="book-meta">{{ book.abbreviation }} · {{ book.chapters }}</span>
          </router-link>
        </li>
      </ul>
    </section>

    <p v-if="!sections.length" class="empty" role="status">
      {{ t('bible.no_results', {query: searchQuery.trim()}) }}
    </p>
  </BasePage>
</template>

<style scoped>
.filter {
  --background: var(--paper-raised);
  --border-radius: var(--radius-md);
  --box-shadow: 0 0 0 1px var(--rule-strong);
  --color: var(--ink);
  --placeholder-color: var(--ink-faint);
  --placeholder-opacity: 1;
  --icon-color: var(--ink-faint);
  --clear-button-color: var(--ink-faint);
  max-width: 24rem;
  margin-bottom: var(--space-6);
  padding: 0 2px;
}

.continue-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: var(--space-6);
  padding: 0.9rem 1rem;
  border-radius: var(--radius-md);
  background: var(--paper-raised);
  color: var(--ink);
  font-weight: 400;
  text-decoration: none;
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

.testament + .testament {
  margin-top: var(--space-7);
}

.testament-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--rule-strong);
}

.books {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  column-gap: var(--space-6);
}

.book {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--rule);
  color: var(--ink);
  font-weight: 400;
  text-decoration: none;
}

.book:hover,
.book:active {
  color: var(--rubric);
}

.book-name {
  font-size: 1.08rem;
}

.book-meta {
  font-size: 0.75rem;
  color: var(--ink-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.empty {
  color: var(--ink-faint);
}
</style>
