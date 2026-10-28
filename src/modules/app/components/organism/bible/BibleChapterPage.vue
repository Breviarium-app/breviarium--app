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
      <article v-if="verses" ref="reader" :style="readingStyle" class="reader">
        <header class="reader-heading">
          <h1>
            <span class="reader-book">{{ bookName }}</span>
            <span class="reader-chapter">{{ chapterNumber }}</span>
          </h1>
          <p class="reader-meta">{{ t('bible.verses_count', {n: verses.length}, verses.length) }}</p>
        </header>

        <div class="reader-text">
          <div v-for="(verse, index) in verses" :key="verse.number" class="verse-row">
            <aside
                v-if="verse.references.length"
                :aria-label="t('bible.cross_references')"
                class="verse-references"
            >
              <template v-for="reference in verse.references" :key="reference.label">
                <a
                    v-if="reference.target"
                    class="verse-reference"
                    href="#"
                    @click.prevent="openReference(verse, reference)"
                >{{ reference.label }}</a>
                <span v-else class="verse-reference">{{ reference.label }}</span>
              </template>
            </aside>
            <p
                :id="`v${verse.number}`"
                :class="{'is-highlighted': verse.number === highlightedVerse}"
                class="verse"
                @click="onVerseTap(verse)"
            >
              <sup class="verse-number">{{ verse.number }}</sup><template v-if="index === 0"><span class="verse-initial">{{ verse.text.charAt(0).toUpperCase() }}</span>{{ verse.text.slice(1) }}</template><template v-else>{{ verse.text }}</template>
            </p>
          </div>
        </div>

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

      <BibleCrossReferenceTrail v-if="verses" slot="fixed" @select="goToTrailStep"/>
      <AutoScrollButton v-if="verses"/>
    </ion-content>

    <DiaryEntryModal :is-open="noteReference !== null" :reference="noteReference" @close="noteReference = null"/>
  </ion-page>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref} from 'vue';
import {
  actionSheetController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  useIonRouter
} from '@ionic/vue';
import {chevronBack, chevronForward, gridOutline, journalOutline} from 'ionicons/icons';
import {useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {bibleStore, type BibleCrossReference} from '@/modules/app/stores/bibleStore.ts';
import {bibleTrailStore, type TrailEntry} from '@/modules/app/stores/bibleTrailStore.ts';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import BibleCrossReferenceTrail from '@/modules/app/components/molecules/BibleCrossReferenceTrail.vue';
import AutoScrollButton from '@/modules/app/components/atoms/AutoScrollButton.vue';
import DiaryEntryModal from '@/modules/app/components/molecules/DiaryEntryModal.vue';
import type {DiaryReference} from '@/modules/app/stores/diaryStore.ts';

const {t} = useI18n();
const store = bibleStore();
const trail = bibleTrailStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const ionRouter = useIonRouter();

// Ionic keeps each page instance for its own URL, so the params are read once.
const bookName = String(route.params.id ?? '');
const chapterNumber = Number(route.params.chapter);

const book = store.getBookMeta(bookName);
const isValidChapter = !!book && Number.isInteger(chapterNumber) && chapterNumber >= 1 && chapterNumber <= book.chapters;

const verses = isValidChapter
    ? Object.entries<string>(store.getVersiculums({name: bookName, number: chapterNumber}).verses ?? {})
        .map(([number, text]) => ({
          number: Number(number),
          text,
          references: store.getCrossReferences(bookName, chapterNumber, Number(number)),
        }))
        .sort((a, b) => a.number - b.number)
    : null;

const previous = isValidChapter ? store.getAdjacentChapter(bookName, chapterNumber, -1) : undefined;
const next = isValidChapter ? store.getAdjacentChapter(bookName, chapterNumber, 1) : undefined;

const readingStyle = computed(() => ({
  fontSize: `${settingsStore.settings.fontSize * 1.2}px`,
  lineHeight: 1.7,
}));

const reader = ref<HTMLElement>();
const highlightedVerse = ref<number | null>(null);
const noteReference = ref<DiaryReference | null>(null);

type Verse = { number: number; text: string };

const onVerseTap = async (verse: Verse) => {
  // A tap that ends a text selection should not open the menu.
  if (window.getSelection()?.toString()) return;
  highlightedVerse.value = verse.number;
  const sheet = await actionSheetController.create({
    header: `${bookName} ${chapterNumber}, ${verse.number}`,
    buttons: [
      {text: t('diary.write_note'), icon: journalOutline, data: 'note'},
      {text: t('cancel'), role: 'cancel'},
    ],
  });
  await sheet.present();
  const {data} = await sheet.onDidDismiss();
  if (data === 'note') {
    noteReference.value = {
      label: `${bookName} ${chapterNumber}, ${verse.number}`,
      path: `/bible/${bookName}/${chapterNumber}#v${verse.number}`,
      quote: verse.text,
    };
  } else {
    highlightedVerse.value = null;
  }
};

const scrollToVerse = async (verse: number) => {
  highlightedVerse.value = verse;
  await nextTick();
  reader.value?.querySelector(`#v${verse}`)?.scrollIntoView({behavior: 'smooth', block: 'center'});
};

const entryPath = (entry: TrailEntry) =>
    `/bible/${entry.book}/${entry.chapter}${entry.verse ? `#v${entry.verse}` : ''}`;

const openEntry = (entry: TrailEntry, direction: 'forward' | 'back') => {
  if (entry.book === bookName && entry.chapter === chapterNumber) {
    if (entry.verse) scrollToVerse(entry.verse);
    return;
  }
  ionRouter.navigate(entryPath(entry), direction, 'push');
};

// The tapped reference becomes a child of the verse it was opened from.
const openReference = (verse: Verse, reference: BibleCrossReference) => {
  const target = reference.target;
  if (!target) return;
  const abbreviation = book?.abbreviation ?? bookName;
  const targetText = store.getVerseText(target.book, target.chapter, target.verse ?? 1);
  const origin: TrailEntry = {
    book: bookName,
    chapter: chapterNumber,
    verse: verse.number,
    label: `${abbreviation} ${chapterNumber}:${verse.number}`,
    quote: verse.text,
  };
  const child: TrailEntry = {...target, label: reference.label, quote: targetText};
  trail.follow(origin, child);
  openEntry(child, 'forward');
};

const goToTrailStep = (position: number) => {
  const entry = trail.entries[position];
  if (!entry) return;
  const direction = position < trail.index ? 'back' : 'forward';
  trail.goTo(position);
  openEntry(entry, direction);
};

onIonViewDidEnter(async () => {
  if (!isValidChapter) return;
  store.setLastRead({book: bookName, chapter: chapterNumber});
  // Arriving by any other way (back button, book list) keeps the trail only if it covers this chapter.
  trail.sync(bookName, chapterNumber);

  // Diary notes link to a verse as #v<number>; Ionic does not scroll to hashes on its own.
  const verse = Number(route.hash.replace('#v', '')) || null;
  highlightedVerse.value = verse;
  if (verse) await scrollToVerse(verse);
});
</script>

<style scoped>
.reader {
  max-width: 880px;
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

.verse-row {
  display: grid;
  grid-template-columns: minmax(4.5rem, 24%) minmax(0, 1fr);
  column-gap: 0.9rem;
  margin-bottom: 0.6rem;
  scroll-margin-top: 5rem;
}

.verse {
  grid-column: 2;
  margin: 0;
  scroll-margin-top: 5rem;
}

.verse-references {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: flex-end;
  gap: 0.3rem 0.35rem;
  padding-top: 0.2em;
  font-size: 0.6em;
  line-height: 1.5;
  text-align: right;
  user-select: none;
  -webkit-user-select: none;
}

.verse-reference {
  padding: 0.05em 0.55em;
  border-radius: 999px;
  background: rgba(235, 68, 90, 0.12);
  background: color-mix(in srgb, var(--ion-color-danger) 12%, transparent);
  color: var(--ion-color-danger);
  font-weight: 500;
  white-space: nowrap;
}

a.verse-reference {
  text-decoration: none;
}

a.verse-reference:active {
  background: color-mix(in srgb, var(--ion-color-danger) 24%, transparent);
}

@media (min-width: 768px) {
  .verse-row {
    grid-template-columns: 11rem minmax(0, 1fr);
    column-gap: 1.5rem;
  }
}

.verse-initial {
  font-size: 1.6em;
  line-height: 0;
  color: var(--ion-color-primary);
}

.verse.is-highlighted {
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

.verse-row:first-child .verse-number {
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
