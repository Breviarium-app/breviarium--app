<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="`/bible/${bookName}`" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ verses ? `${bookName} ${chapterNumber}` : t('bible_name') }}</ion-title>
        <ion-buttons v-if="verses" slot="end">
          <ion-button
              :aria-label="t('bible.all_chapters')"
              :router-link="`/bible/${bookName}`"
              router-direction="back"
          >
            <ion-icon slot="icon-only" :icon="gridOutline" aria-hidden="true"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <article v-if="verses" :style="readingStyle" class="reader">
        <header class="reader-heading">
          <h1>
            <span class="reader-book">{{ bookName }}</span>
            <span class="reader-chapter">{{ chapterNumber }}</span>
          </h1>
          <p class="reader-meta">{{ t('bible.verses_count', {n: verses.length}, verses.length) }}</p>
        </header>

        <p class="reader-text">
          <span v-for="verse in verses" :id="`v${verse.number}`" :key="verse.number" class="verse">
            <sup class="verse-number">{{ verse.number }}</sup>{{ verse.text }}
          </span>
        </p>

        <nav :aria-label="t('bible.chapter_nav')" class="chapter-nav">
          <router-link
              v-if="previous"
              :to="`/bible/${previous.book}/${previous.chapter}`"
              class="chapter-nav-link is-previous"
              replace
          >
            <ion-icon :icon="chevronBack" aria-hidden="true"></ion-icon>
            <span>
              <span class="chapter-nav-label">{{ t('bible.previous') }}</span>
              <span class="chapter-nav-target">{{ previous.book }} {{ previous.chapter }}</span>
            </span>
          </router-link>
          <router-link
              v-if="next"
              :to="`/bible/${next.book}/${next.chapter}`"
              class="chapter-nav-link is-next"
              replace
          >
            <span>
              <span class="chapter-nav-label">{{ t('bible.next') }}</span>
              <span class="chapter-nav-target">{{ next.book }} {{ next.chapter }}</span>
            </span>
            <ion-icon :icon="chevronForward" aria-hidden="true"></ion-icon>
          </router-link>
        </nav>
      </article>

      <div v-else class="not-found" role="status">
        <p>{{ t('bible.not_found') }}</p>
        <ion-button fill="outline" router-link="/bible">{{ t('bible.back_to_bible') }}</ion-button>
      </div>

      <AutoScrollButton v-if="verses"/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter
} from '@ionic/vue';
import {chevronBack, chevronForward, gridOutline} from 'ionicons/icons';
import {useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {bibleStore} from '@/modules/app/stores/bibleStore.ts';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import AutoScrollButton from '@/modules/app/components/atoms/AutoScrollButton.vue';

const {t} = useI18n();
const store = bibleStore();
const settingsStore = useSettingsStore();
const route = useRoute();

// Ionic keeps each page instance for its own URL, so the params are read once.
const bookName = String(route.params.id ?? '');
const chapterNumber = Number(route.params.chapter);

const book = store.getBookMeta(bookName);
const isValidChapter = !!book && Number.isInteger(chapterNumber) && chapterNumber >= 1 && chapterNumber <= book.chapters;

const verses = isValidChapter
    ? Object.entries<string>(store.getVersiculums({name: bookName, number: chapterNumber}).verses ?? {})
        .map(([number, text]) => ({number: Number(number), text}))
        .sort((a, b) => a.number - b.number)
    : null;

const previous = isValidChapter ? store.getAdjacentChapter(bookName, chapterNumber, -1) : undefined;
const next = isValidChapter ? store.getAdjacentChapter(bookName, chapterNumber, 1) : undefined;

const readingStyle = computed(() => ({
  fontSize: `${settingsStore.settings.fontSize * 1.2}px`,
  lineHeight: 1.7,
}));

onIonViewDidEnter(() => {
  if (isValidChapter) store.setLastRead({book: bookName, chapter: chapterNumber});
});
</script>

<style scoped>
.reader {
  max-width: 680px;
  margin: 0 auto;
  padding: 1.5rem 1.4rem 11rem;
  user-select: text;
  -webkit-user-select: text;
}

.reader-heading {
  margin-bottom: 1.5rem;
  text-align: center;
}

.reader-heading h1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  margin: 0;
  font-weight: 400;
}

.reader-book {
  font-size: 0.75em;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ion-color-primary);
}

.reader-chapter {
  font-size: 2.6em;
  line-height: 1;
}

.reader-meta {
  margin: 0.5rem 0 0;
  font-size: 0.75em;
  opacity: 0.7;
}

.reader-text {
  margin: 0;
  text-align: start;
  color: var(--ion-text-color);
}

.verse {
  scroll-margin-top: 5rem;
}

.verse:target {
  background: var(--background-color-card);
  border-radius: 4px;
}

.verse-number {
  margin: 0 0.2em 0 0.35em;
  font-size: 0.65em;
  font-weight: 600;
  color: var(--ion-color-primary);
  user-select: none;
  -webkit-user-select: none;
}

.verse:first-child .verse-number {
  margin-left: 0;
}

.chapter-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 3rem;
  font-size: 1rem;
  line-height: 1.3;
}

.chapter-nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: var(--background-color-card);
  color: var(--ion-text-color);
  font-weight: 400;
}

.chapter-nav-link:active {
  transform: scale(0.98);
}

.chapter-nav-link.is-next {
  grid-column: 2;
  justify-content: flex-end;
  text-align: right;
}

.chapter-nav-link ion-icon {
  flex-shrink: 0;
  color: var(--ion-color-primary);
}

.chapter-nav-label {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.chapter-nav-target {
  display: block;
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
