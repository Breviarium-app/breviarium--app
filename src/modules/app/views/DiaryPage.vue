<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('diary.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="diary-page">
        <p class="diary-intro">{{ t('diary.explanation') }}</p>
        <small class="diary-offline">{{ t('diary.explanation_offline') }}</small>

        <ion-button class="add-button" color="primary" expand="block" @click="openNew">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>
          {{ t('diary.add_button') }}
        </ion-button>

        <p v-if="store.entries.length === 0" class="empty-state">{{ t('diary.empty') }}</p>

        <section v-for="group in groups" :key="group.day" class="diary-day">
          <h2 class="day-title">{{ group.day }}</h2>
          <article v-for="entry in group.entries" :key="entry.id" class="diary-entry">
            <DiaryReferenceCard v-if="entry.reference" :reference="entry.reference"/>
            <button class="entry-body" type="button" @click="openEdit(entry)">
              <span class="entry-text">{{ entry.text }}</span>
              <span class="entry-time">{{ formatTime(entry.createdAt) }}</span>
            </button>
          </article>
        </section>
      </div>
    </ion-content>

    <DiaryEntryModal :entry="editing" :is-open="isModalOpen" @close="isModalOpen = false"/>
  </ion-page>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {addOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {type DiaryEntry, useDiaryStore} from '@/modules/app/stores/diaryStore.ts';
import DiaryEntryModal from '@/modules/app/components/molecules/DiaryEntryModal.vue';
import DiaryReferenceCard from '@/modules/app/components/molecules/DiaryReferenceCard.vue';
import HapticsService from '@/modules/app/services/HapticsService.ts';

const {t, locale} = useI18n();
const store = useDiaryStore();

const isModalOpen = ref(false);
const editing = ref<DiaryEntry | null>(null);

const groups = computed(() => {
  const result: { day: string; entries: DiaryEntry[] }[] = [];
  for (const entry of store.entries) {
    const day = new Date(entry.createdAt).toLocaleDateString(locale.value, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    const last = result[result.length - 1];
    if (last?.day === day) last.entries.push(entry);
    else result.push({day, entries: [entry]});
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
.diary-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 0.5rem 1rem 8rem;
}

.diary-intro {
  margin: 0.5rem 0 0.25rem;
}

.diary-offline {
  display: block;
  opacity: 0.7;
}

.add-button {
  margin: 1rem 0 1.5rem;
}

.empty-state {
  margin: 2rem 0;
  text-align: center;
  opacity: 0.7;
}

.diary-day {
  margin-bottom: 1.5rem;
}

.day-title {
  margin: 0 0 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ion-color-primary);
}

.diary-entry {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0.75rem;
  padding: 12px;
  border-radius: 12px;
  background: var(--background-color-card);
}

.diary-entry .reference-card {
  background: var(--ion-background-color);
}

.entry-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--ion-text-color);
  font: inherit;
  text-align: start;
}

.entry-text {
  white-space: pre-wrap;
  line-height: 1.5;
}

.entry-time {
  align-self: flex-end;
  font-size: 0.75rem;
  opacity: 0.6;
}
</style>
