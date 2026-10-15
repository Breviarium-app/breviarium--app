<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('diary.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="diary">
        <p class="intro">{{ t('diary.explanation') }}</p>
        <p class="privacy">
          <ion-icon :icon="lockClosedOutline" aria-hidden="true"/>
          {{ t('diary.explanation_offline') }}
        </p>

        <button :aria-label="t('diary.add_button')" class="compose btn" @click="openNew">
          <ion-icon :icon="createOutline" aria-hidden="true" class="compose-icon"/>
          <span class="compose-prompt">{{ composePrompt }}</span>
        </button>

        <section v-if="store.entries.length === 0" class="empty-state">
          <ion-icon :icon="journalOutline" aria-hidden="true" class="empty-icon"/>
          <p class="empty-title">{{ t('diary.empty') }}</p>
          <p class="empty-text">{{ t('diary.empty_hint') }}</p>
        </section>

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
      </div>
    </ion-content>

    <DiaryEntryModal :entry="editing" :is-open="isModalOpen" @close="isModalOpen = false"/>
  </ion-page>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, onIonViewWillEnter} from '@ionic/vue';
import {createOutline, journalOutline, lockClosedOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {type DiaryEntry, useDiaryStore} from '@/modules/app/stores/diaryStore.ts';
import DiaryEntryModal from '@/modules/app/components/molecules/DiaryEntryModal.vue';
import DiaryReferenceCard from '@/modules/app/components/molecules/DiaryReferenceCard.vue';
import HapticsService from '@/modules/app/services/HapticsService.ts';

const {t, tm, locale} = useI18n();
const store = useDiaryStore();

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

// Entries are stored newest first, so consecutive entries share a day
const groups = computed(() => {
  const result: { key: string; label: string; entries: DiaryEntry[] }[] = [];
  for (const entry of store.entries) {
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

@media (prefers-reduced-motion: reduce) {
  .compose {
    transition: none;
  }
}
</style>
