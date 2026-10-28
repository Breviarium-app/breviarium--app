<script lang="ts" setup>
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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
import {arrowForward, chevronDownOutline, chevronUpOutline, peopleOutline} from "ionicons/icons";
import {useSanctusStore} from "@/modules/app/stores/sanctus.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import {formatFeastDay, saintPath} from "@/modules/app/constants/saints.ts";
import SaintList from "@/modules/app/components/molecules/saints/SaintList.vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";

const SEARCH_LIMIT = 50;
// Other saints of the day stay collapsed under this count, behind a fade + "show all" toggle
const DAY_SAINTS_COLLAPSED_COUNT = 3;

const {t, n, locale} = useI18n();
const router = useRouter();
const sanctusStore = useSanctusStore();
const {selectedSaint, saintsOfDay} = storeToRefs(sanctusStore);

// Supports /:year/:month/:day/saint deep links
useDateStore().updateDateParams();

const feastDay = computed(() => selectedSaint.value
    ? formatFeastDay(selectedSaint.value.month, selectedSaint.value.day, locale.value)
    : '');

// Same facts shown on the full saint detail page
const facts = computed(() => [
  {label: t('saints.birth'), value: selectedSaint.value?.birth},
  {label: t('saints.death'), value: selectedSaint.value?.dead},
  {label: t('saints.meaning'), value: selectedSaint.value?.meaning},
].filter((fact) => fact.value));

const openSaint = (saint: SaintInfo) => {
  HapticsService.light();
  router.push(saintPath(saint));
};

/* Other saints of the day, shown inline below the main card */
const otherSaintsOfDay = computed(() =>
    (saintsOfDay.value ?? []).filter((saint) => saint.name !== selectedSaint.value?.name));
const isDayListExpanded = ref(false);
const canCollapseDayList = computed(() => otherSaintsOfDay.value.length > DAY_SAINTS_COLLAPSED_COUNT);
const toggleDayList = () => {
  HapticsService.light();
  isDayListExpanded.value = !isDayListExpanded.value;
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
          <span class="eyebrow">{{ t('saints.of_the_day') }} · {{ feastDay }}</span>
          <h2 class="saint-name">
            <button class="saint-name-link btn" @click="openSaint(selectedSaint)">{{ selectedSaint.name }}</button>
          </h2>

          <div v-if="facts.length" class="saint-facts">
            <div v-for="fact in facts" :key="fact.label" class="fact-chip">
              <span class="fact-label">{{ fact.label }}</span>
              <span class="fact-value">{{ fact.value }}</span>
            </div>
          </div>

          <p v-if="selectedSaint.description" class="saint-history">{{ selectedSaint.description }}</p>
          <p v-else class="saint-no-bio">{{ t('saints.no_bio') }}</p>

          <div class="saint-card-actions">
            <button class="details-link btn" @click="openSaint(selectedSaint)">
              {{ t('saints.view_details') }}
              <ion-icon :icon="arrowForward" aria-hidden="true"/>
            </button>
          </div>
        </section>

        <section v-if="otherSaintsOfDay.length" class="day-section">
          <h2 class="section-title">
            <ion-icon :icon="peopleOutline" aria-hidden="true"/>
            {{ t('saints.day_saints', {n: otherSaintsOfDay.length}) }}
          </h2>
          <div class="day-list-wrapper" :class="{ 'day-list-wrapper--collapsed': canCollapseDayList && !isDayListExpanded }">
            <SaintList :saints="otherSaintsOfDay" @select="openSaint"/>
          </div>
          <button v-if="canCollapseDayList" class="day-toggle btn" @click="toggleDayList">
            {{ isDayListExpanded ? t('saints.show_less_day_saints') : t('saints.show_all_day_saints') }}
            <ion-icon :icon="isDayListExpanded ? chevronUpOutline : chevronDownOutline" aria-hidden="true"/>
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
  background: transparent;
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

.eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ion-color-primary);
}

.saint-name {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.2;
}

.saint-name-link {
  display: inline;
  padding: 0;
  font: inherit;
  color: inherit;
  text-underline-offset: 0.2em;
  text-decoration-color: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.3);
}

.saint-name-link:hover,
.saint-name-link:focus-visible {
  text-decoration: underline;
}

.saint-history {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.85;
  /* The text is the point of the card, so it can be selected and copied like any other paragraph */
  user-select: text;
}

.saint-no-bio {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.6;
}

.saint-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.fact-chip {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.4rem 0.7rem;
  border-radius: 10px;
  background: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.06);
}

.fact-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.6;
}

.fact-value {
  font-size: 0.85rem;
}

.saint-card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.1rem;
}

.details-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0;
  font-size: 0.9rem;
  color: var(--ion-color-primary);
}

.day-section {
  margin-top: 1.4rem;
}

.day-list-wrapper {
  position: relative;
  overflow: hidden;
  max-height: 40rem;
  transition: max-height 0.3s ease;
}

.day-list-wrapper--collapsed {
  max-height: 11rem;
}

@media (prefers-reduced-motion: reduce) {
  .day-list-wrapper {
    transition: none;
  }
}

.day-list-wrapper--collapsed::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 3.5rem;
  background: linear-gradient(to bottom, transparent, var(--background-color-card));
  pointer-events: none;
}

.day-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  margin-top: 0.6rem;
  padding: 0.5rem 0;
  font-size: 0.85rem;
  color: var(--ion-color-primary);
}

.search-section {
  /* Tall enough to scroll the search box to the top even with few results */
  min-height: calc(100vh - 120px);
  margin-top: 1.75rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0.25rem 0.4rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}

.section-title ion-icon {
  font-size: 0.95rem;
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
</style>
