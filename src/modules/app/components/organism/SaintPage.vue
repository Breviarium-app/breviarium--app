<script lang="ts" setup>
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {computed, ref} from "vue";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {SaintInfo} from "sanctus";
import {arrowForward, closeOutline, peopleOutline} from "ionicons/icons";
import {useSanctusStore} from "@/modules/app/stores/sanctus.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import {formatFeastDay, saintPath} from "@/modules/app/constants/saints.ts";
import SaintList from "@/modules/app/components/molecules/saints/SaintList.vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";

const SEARCH_LIMIT = 50;

const {t, n, locale} = useI18n();
const router = useRouter();
const sanctusStore = useSanctusStore();
const {selectedSaint, saintsOfDay} = storeToRefs(sanctusStore);

// Supports /:year/:month/:day/saint deep links
useDateStore().updateDateParams();

const feastDay = computed(() => selectedSaint.value
    ? formatFeastDay(selectedSaint.value.month, selectedSaint.value.day, locale.value)
    : '');

const openSaint = (saint: SaintInfo) => {
  HapticsService.light();
  isDayListOpen.value = false;
  router.push(saintPath(saint));
};

/* All saints of the day */
const isDayListOpen = ref(false);
const setDayListOpen = (open: boolean) => {
  HapticsService.light();
  isDayListOpen.value = open;
};

/* Santoral search */
const searchQuery = ref('');
const isSearching = computed(() => searchQuery.value.trim().length > 0);
const searchResults = computed(() => sanctusStore.searchSaints(searchQuery.value));
const visibleResults = computed(() => searchResults.value.slice(0, SEARCH_LIMIT));

const contentRef = ref();
const searchSectionRef = ref<HTMLElement>();

// Brings the search box to the top so results stay visible above the keyboard
const scrollToSearch = () => {
  const offset = (searchSectionRef.value?.offsetTop ?? 0) - 8;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  contentRef.value?.$el.scrollToPoint(0, offset, reduceMotion ? 0 : 300);
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ t('saints.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content ref="contentRef" :fullscreen="true">
      <div class="saints">
        <section v-if="selectedSaint" class="saint-card">
          <button class="saint-card-body btn" @click="openSaint(selectedSaint)">
            <span class="eyebrow">{{ t('saints.of_the_day') }} · {{ feastDay }}</span>
            <span class="saint-name">{{ selectedSaint.name }}</span>
            <span v-if="selectedSaint.description" class="saint-excerpt">{{ selectedSaint.description }}</span>
            <span class="read-more">
              {{ t('saints.read_more') }}
              <ion-icon :icon="arrowForward" aria-hidden="true"/>
            </span>
          </button>

          <button v-if="saintsOfDay?.length" class="day-badge btn" @click="setDayListOpen(true)">
            <ion-icon :icon="peopleOutline" aria-hidden="true"/>
            {{ t('saints.day_saints', {n: saintsOfDay.length}) }}
          </button>
        </section>

        <section ref="searchSectionRef" class="search-section">
          <h2 class="section-title">{{ t('saints.search_title') }}</h2>
          <ion-searchbar
              v-model="searchQuery"
              :cancel-button-text="t('cancel')"
              :debounce="150"
              :placeholder="t('saints.search_placeholder')"
              class="saint-search"
              show-cancel-button="focus"
              @ionFocus="scrollToSearch"
          ></ion-searchbar>

          <p v-if="!isSearching" class="search-hint">
            {{ t('saints.search_hint', {n: n(sanctusStore.totalSaints())}) }}
          </p>
          <p v-else-if="searchResults.length === 0" class="search-hint" role="status">
            {{ t('saints.no_results', {query: searchQuery.trim()}) }}
          </p>
          <template v-else>
            <p class="search-hint" role="status">
              {{
                searchResults.length > SEARCH_LIMIT
                    ? t('saints.results_limited', {shown: SEARCH_LIMIT, n: n(searchResults.length)})
                    : t('saints.results_count', {n: searchResults.length}, searchResults.length)
              }}
            </p>
            <SaintList :saints="visibleResults" :show-date="true" @select="openSaint"/>
          </template>
        </section>

        <p class="footer">
          <a href="https://breviarium.es/" target="_blank">Breviarium Project</a> •
          <a href="https://breviarium.es/sanctus/" target="_blank">Sanctus</a>
        </p>
      </div>

      <Teleport to="body">
        <ion-modal :breakpoints="[0, 0.75, 1]" :expand-to-scroll="false" :initial-breakpoint="0.75"
                   :is-open="isDayListOpen" @didDismiss="isDayListOpen = false">
          <ion-content>
            <div class="sheet-header">
              <h2 class="sheet-title">{{ t('saints.day_saints_title', {date: feastDay}) }}</h2>
              <ion-button class="close-button" fill="clear" @click="setDayListOpen(false)">
                <ion-icon :icon="closeOutline"/>
              </ion-button>
            </div>
            <div class="sheet-content">
              <SaintList :saints="saintsOfDay ?? []" @select="openSaint"/>
            </div>
          </ion-content>
        </ion-modal>
      </Teleport>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.saints {
  max-width: 560px;
  margin: 0 auto;
  /* Bottom padding keeps the footer clear of the floating tab bar */
  padding: 1rem 1rem 96px;
}

button {
  font-family: inherit;
  font-weight: 400;
  color: inherit;
  text-align: left;
  border: 0;
  -webkit-tap-highlight-color: transparent;
}

.saint-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.1rem 1.1rem 1rem;
  border-radius: 18px;
  background: var(--background-color-card);
}

.saint-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0;
  background: transparent;
}

.eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ion-color-primary);
}

.saint-name {
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.2;
}

.saint-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.95rem;
  line-height: 1.55;
  opacity: 0.8;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.15rem;
  font-size: 0.9rem;
  color: var(--ion-color-primary);
}

.day-badge {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem 0.35rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--ion-color-primary);
  background: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.06);
}

.day-badge ion-icon {
  font-size: 1.05rem;
}

.search-section {
  /* Tall enough to scroll the search box to the top even with few results */
  min-height: calc(100vh - 120px);
  margin-top: 1.75rem;
}

.section-title {
  margin: 0 0.25rem 0.4rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}

.saint-search {
  padding: 0;
  --border-radius: 12px;
  --background: var(--background-color-card);
  --box-shadow: none;
}

.search-hint {
  margin: 0.5rem 0.25rem 0.75rem;
  font-size: 0.85rem;
  opacity: 0.65;
}

.footer {
  text-align: center;
  padding: 1.5em 0;
  font-size: 0.9rem;
}

ion-modal {
  --background: var(--ion-background-color);
  --border-radius: 20px;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0.5rem 0.75rem 1.25rem;
}

.sheet-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.close-button {
  --color: var(--ion-text-color);
  font-size: 1.1rem;
}

.sheet-content {
  padding: 0 1rem 2rem;
}
</style>
