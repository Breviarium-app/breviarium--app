<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('diary.title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :aria-label="t('diary.calendar_button')" @click="openCalendar">
            <ion-icon :icon="calendarOutline" aria-hidden="true" slot="icon-only"/>
          </ion-button>
          <ion-button :aria-label="t('diary.search_button')" @click="toggleSearch">
            <ion-icon :icon="isSearchOpen ? closeOutline : searchOutline" aria-hidden="true" slot="icon-only"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar v-if="isSearchOpen">
        <ion-searchbar
            ref="searchbarRef"
            v-model="searchQuery"
            :animated="true"
            :placeholder="t('diary.search_placeholder')"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="diary">
        <template v-if="!isSearchOpen">
          <p class="intro">{{ t('diary.explanation') }}</p>
          <p class="privacy">
            <ion-icon :icon="lockClosedOutline" aria-hidden="true"/>
            {{ t('diary.explanation_offline') }}
          </p>

          <button :aria-label="t('diary.add_button')" class="compose btn" @click="openNew">
            <ion-icon :icon="createOutline" aria-hidden="true" class="compose-icon"/>
            <span class="compose-prompt">{{ composePrompt }}</span>
          </button>
        </template>

        <div v-if="selectedDayFilter" class="filter-chip">
          <span>{{ dayLabel(selectedDayFilter) }}</span>
          <button :aria-label="t('diary.filter_clear')" class="chip-clear btn" @click="clearDayFilter">
            <ion-icon :icon="closeOutline" aria-hidden="true"/>
          </button>
        </div>

        <section v-if="store.entries.length === 0" class="empty-state">
          <ion-icon :icon="journalOutline" aria-hidden="true" class="empty-icon"/>
          <p class="empty-title">{{ t('diary.empty') }}</p>
          <p class="empty-text">{{ t('diary.empty_hint') }}</p>
        </section>

        <section v-else-if="filteredEntries.length === 0" class="empty-state">
          <ion-icon :icon="searchOutline" aria-hidden="true" class="empty-icon"/>
          <p class="empty-title">{{ noResultsMessage }}</p>
        </section>

        <template v-else>
          <section v-for="group in groups" :key="group.key">
            <h2 class="section-title">{{ group.label }}</h2>
            <div class="entries">
              <article v-for="entry in group.entries" :key="entry.id" class="entry">
                <DiaryReferenceCard v-if="entry.reference" :reference="entry.reference"/>
                <button :aria-label="t('diary.edit_title')" class="entry-body btn" @click="openEdit(entry)">
                  <span class="entry-text">{{ entry.text }}</span>
                  <span class="entry-time">{{ formatTime(entry.createdAt) }}</span>
                </button>
              </article>
            </div>
          </section>

          <p v-if="filteredEntries.length > PAGE_SIZE" class="pagination-hint">
            {{ t('diary.pagination_hint', {shown: PAGE_SIZE, total: filteredEntries.length}) }}
          </p>
        </template>
      </div>
    </ion-content>

    <DiaryEntryModal :entry="editing" :is-open="isModalOpen" @close="isModalOpen = false"/>

    <Teleport to="body">
      <ion-modal :is-open="calendarOpen" @didDismiss="calendarOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-button fill="clear" slot="start" @click="calendarOpen = false">
              {{ t('diary.calendar_close') }}
            </ion-button>
            <ion-button fill="clear" slot="end" @click="clearDayFilterAndClose">
              {{ t('diary.filter_clear') }}
            </ion-button>
          </ion-toolbar>
        </ion-header>
        <div class="modal-wrapper">
          <ion-datetime
              v-model="datetimeModel"
              :first-day-of-week="1"
              :highlighted-dates="highlightEntryDates"
              :prefer-wheel="false"
              :show-adjacent-days="true"
              :locale="locale === 'en' ? 'en-US' : 'es-ES'"
              presentation="date"
              size="cover"
              @ionChange="onCalendarDateChange"
          ></ion-datetime>
        </div>
      </ion-modal>
    </Teleport>
  </ion-page>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter
} from '@ionic/vue';
import {calendarOutline, closeOutline, createOutline, journalOutline, lockClosedOutline, searchOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {type DiaryEntry, useDiaryStore} from '@/modules/app/stores/diaryStore.ts';
import DiaryEntryModal from '@/modules/app/components/molecules/DiaryEntryModal.vue';
import DiaryReferenceCard from '@/modules/app/components/molecules/DiaryReferenceCard.vue';
import HapticsService from '@/modules/app/services/HapticsService.ts';

const {t, tm, locale} = useI18n();
const store = useDiaryStore();

// Shown while there is no real pagination yet, so long diaries stay fast to render
const PAGE_SIZE = 20;

// A different prompt each time the page is opened, to keep the invitation to write feeling fresh
const prompts = computed<string[]>(() => tm('diary.prompts') as string[]);
const composePrompt = ref('');
const pickPrompt = () => {
  const list = prompts.value;
  composePrompt.value = list[Math.floor(Math.random() * list.length)] ?? t('diary.placeholder');
};
pickPrompt();
// The page stays alive in the Ionic stack, so pick again on every return visit
onIonViewWillEnter(pickPrompt);

const isModalOpen = ref(false);
const editing = ref<DiaryEntry | null>(null);

const pad = (n: number) => String(n).padStart(2, '0');
const toIsoDateString = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseIsoDateString = (s: string) => {
  const [y, m, d] = s.split('T')[0].split('-');
  return new Date(Number(y), Number(m) - 1, Number(d));
};

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

// "Hoy" and "Ayer" for recent notes; the year only when it is not the current one
const dayLabel = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  if (dayKey(date) === dayKey(today)) return t('diary.today');
  if (dayKey(date) === dayKey(yesterday)) return t('diary.yesterday');
  return date.toLocaleDateString(locale.value, {
    weekday: 'long', day: 'numeric', month: 'long',
    ...(date.getFullYear() !== today.getFullYear() && {year: 'numeric'}),
  });
};

/* Search */
const isSearchOpen = ref(false);
const searchQuery = ref('');
const searchbarRef = ref();
const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase());

const toggleSearch = async () => {
  HapticsService.light();
  isSearchOpen.value = !isSearchOpen.value;
  if (!isSearchOpen.value) {
    searchQuery.value = '';
    return;
  }
  setTimeout(() => searchbarRef.value?.$el?.setFocus?.(), 50);
};

/* Calendar day filter */
const selectedDayFilter = ref<Date | null>(null);
const calendarOpen = ref(false);
const datetimeModel = ref<string>(toIsoDateString(new Date()));

const entryDateSet = computed(() => new Set(store.entries.map((entry) => toIsoDateString(new Date(entry.createdAt)))));

// Marks days that already contain a note with a soft dot-like highlight
const highlightEntryDates = (isoString: string) => {
  if (!entryDateSet.value.has(isoString.split('T')[0])) return undefined;
  return {
    textColor: 'var(--ion-color-primary)',
    backgroundColor: 'color-mix(in srgb, var(--ion-color-primary) 18%, transparent)',
  };
};

const openCalendar = () => {
  HapticsService.light();
  datetimeModel.value = toIsoDateString(selectedDayFilter.value ?? new Date());
  calendarOpen.value = true;
};

const onCalendarDateChange = (event: any) => {
  const iso = event.detail.value;
  if (!iso) return;
  datetimeModel.value = iso;
  selectedDayFilter.value = parseIsoDateString(iso);
  calendarOpen.value = false;
  HapticsService.light();
};

const clearDayFilter = () => {
  selectedDayFilter.value = null;
};

const clearDayFilterAndClose = () => {
  clearDayFilter();
  calendarOpen.value = false;
  HapticsService.light();
};

/* Filtering + pagination */
const matchesSearch = (entry: DiaryEntry) => {
  if (!normalizedQuery.value) return true;
  const haystack = `${entry.text} ${entry.reference?.label ?? ''} ${entry.reference?.quote ?? ''}`.toLowerCase();
  return haystack.includes(normalizedQuery.value);
};

const matchesDay = (entry: DiaryEntry) => {
  if (!selectedDayFilter.value) return true;
  return dayKey(new Date(entry.createdAt)) === dayKey(selectedDayFilter.value);
};

// Entries are stored newest first, so this stays newest first too
const filteredEntries = computed(() => store.entries.filter((entry) => matchesDay(entry) && matchesSearch(entry)));
const visibleEntries = computed(() => filteredEntries.value.slice(0, PAGE_SIZE));

const noResultsMessage = computed(() => {
  if (normalizedQuery.value) return t('diary.search_no_results', {query: searchQuery.value.trim()});
  return t('diary.filtered_day_empty');
});

// Consecutive entries share a day, so a running group is extended rather than duplicated
const groups = computed(() => {
  const result: { key: string; label: string; entries: DiaryEntry[] }[] = [];
  for (const entry of visibleEntries.value) {
    const date = new Date(entry.createdAt);
    const key = dayKey(date);
    const last = result[result.length - 1];
    if (last?.key === key) last.entries.push(entry);
    else result.push({key, label: dayLabel(date), entries: [entry]});
  }
  return result;
});

const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(locale.value, {hour: '2-digit', minute: '2-digit'});

const openNew = () => {
  editing.value = null;
  isModalOpen.value = true;
  HapticsService.light();
};

const openEdit = (entry: DiaryEntry) => {
  editing.value = entry;
  isModalOpen.value = true;
  HapticsService.light();
};
</script>

<style scoped>
.diary {
  max-width: 560px;
  margin: 0 auto;
  /* Bottom padding keeps the last section clear of the floating tab bar */
  padding: 1rem 1rem 96px;
}

.intro {
  margin: 0.25rem 0.25rem 0.75rem;
  line-height: 1.5;
}

.privacy {
  display: flex;
  gap: 0.5rem;
  margin: 0 0.25rem 1.5rem;
  font-size: 0.85rem;
  line-height: 1.45;
  opacity: 0.65;
}

.privacy ion-icon {
  flex-shrink: 0;
  margin-top: 0.15rem;
}

button {
  font-family: inherit;
  font-weight: 400;
  color: inherit;
  text-align: left;
  border: 0;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
}

/* Looks like the start of a note, so writing feels one tap away */
.compose {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 1.75rem;
  padding: 1rem 1.1rem;
  border-radius: 16px;
  background: var(--background-color-card);
  box-shadow: inset 0 0 0 1.5px transparent;
  transition: box-shadow 0.15s ease;
}

.compose:hover,
.compose:focus-visible {
  box-shadow: inset 0 0 0 1.5px var(--ion-color-primary);
}

.compose-icon {
  flex-shrink: 0;
  font-size: 1.3rem;
  color: var(--ion-color-primary);
}

.compose-prompt {
  font-style: italic;
  opacity: 0.6;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0.25rem 1.25rem;
  padding: 0.4rem 0.4rem 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  text-transform: capitalize;
  background: var(--background-color-card);
}

.chip-clear {
  display: inline-flex;
  padding: 0.2rem;
  font-size: 1rem;
  opacity: 0.65;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  border-radius: 18px;
  text-align: center;
  border: 1px dashed rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.2);
}

.empty-icon {
  font-size: 2rem;
  color: var(--ion-color-primary);
}

.empty-title {
  margin: 0.75rem 0 0.25rem;
  font-size: 1.1rem;
}

.empty-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  opacity: 0.65;
}

section {
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.entry {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.9rem 1rem 0.75rem;
  border-radius: 16px;
  background: var(--background-color-card);
}

.entry-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0;
}

.entry-text {
  white-space: pre-wrap;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.entry-time {
  align-self: flex-end;
  font-size: 0.75rem;
  opacity: 0.55;
}

.pagination-hint {
  margin: 0 0.25rem;
  font-size: 0.8rem;
  text-align: center;
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .compose {
    transition: none;
  }
}

ion-modal {
  --height: auto;
  --width: 90%;
  --max-width: 400px;
  --border-radius: 16px;
  --background: var(--ion-background-color);
  margin: auto;
}

.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 16px;
}

ion-datetime {
  --background: var(--ion-background-color);
  color: var(--ion-text-color);
  border-radius: 12px;
  box-shadow: 0 0 10px var(--ion-color-step-100);
  --wheel-highlight-background: var(--ion-background-color);
  --wheel-fade-background-rgb: var(--ion-background-color);
}
</style>
