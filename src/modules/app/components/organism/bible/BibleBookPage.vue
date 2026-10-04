<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/bible" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ book?.name ?? t('bible_name') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ book?.name ?? t('bible_name') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="book" class="book-page">
        <p class="book-summary">
          {{ book.testament === 'new' ? t('bible.new_testament') : t('bible.old_testament') }}
          · {{ t('bible.chapters_count', {n: book.chapters}, book.chapters) }}
          · {{ t('bible.verses_count', {n: book.verses}, book.verses) }}
        </p>

        <h2 class="section-title">{{ t('bible.chapters') }}</h2>
        <nav :aria-label="t('bible.chapters')">
          <ol class="chapter-grid">
            <li v-for="chapter in book.chapters" :key="chapter">
              <router-link
                  :aria-current="isLastRead(chapter) ? 'location' : undefined"
                  :aria-label="`${t('bible.chapter')} ${chapter}`"
                  :class="{'is-last-read': isLastRead(chapter)}"
                  :to="`/bible/${book.name}/${chapter}`"
                  class="chapter-link"
              >
                {{ chapter }}
              </router-link>
            </li>
          </ol>
        </nav>
      </div>

      <div v-else class="not-found" role="status">
        <p>{{ t('bible.not_found') }}</p>
        <ion-button fill="outline" router-link="/bible">{{ t('bible.back_to_bible') }}</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {bibleStore} from '@/modules/app/stores/bibleStore.ts';

const {t} = useI18n();
const store = bibleStore();
const route = useRoute();

const book = computed(() => store.getBookMeta(String(route.params.id ?? '')));

const isLastRead = (chapter: number) =>
    store.lastRead?.book === book.value?.name && store.lastRead?.chapter === chapter;
</script>

<style scoped>
.book-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem 8rem;
}

.book-summary {
  margin: 0.25rem 0 1.5rem;
  opacity: 0.75;
}

.section-title {
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ion-color-primary);
}

.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(3.25rem, 1fr));
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chapter-link {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 12px;
  background: var(--background-color-card);
  color: var(--ion-text-color);
  font-size: 1.1rem;
  font-weight: 500;
}

.chapter-link:active {
  transform: scale(0.96);
}

.chapter-link.is-last-read {
  box-shadow: inset 0 0 0 2px var(--ion-color-primary);
  font-weight: 700;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 4rem 1.5rem;
  text-align: center;
}
</style>
