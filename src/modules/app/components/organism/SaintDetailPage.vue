<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {computed} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {SaintInfo} from "sanctus";
import {useSanctusStore} from "@/modules/app/stores/sanctus.ts";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {formatFeastDay, saintPath} from "@/modules/app/constants/saints.ts";
import SaintList from "@/modules/app/components/molecules/saints/SaintList.vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";

// Received as route props so each page in the Ionic stack keeps its own saint
const props = defineProps<{
  month: string;
  day: string;
  name: string;
}>();

const {t, locale} = useI18n();
const router = useRouter();
const sanctusStore = useSanctusStore();
const settingsStore = useSettingsStore();

const month = computed(() => Number(props.month));
const day = computed(() => Number(props.day));

const saint = computed(() => sanctusStore.findSaint(month.value, day.value, props.name));
const feastDay = computed(() => formatFeastDay(month.value, day.value, locale.value));
const sameDaySaints = computed(() => sanctusStore.getSaintsOfMonthDay(month.value, day.value)
    .filter((other) => other.name !== props.name));

const facts = computed(() => [
  {label: t('saints.birth'), value: saint.value?.birth},
  {label: t('saints.death'), value: saint.value?.dead},
  {label: t('saints.meaning'), value: saint.value?.meaning},
].filter((fact) => fact.value));

// Same reading size the prayer pages use
const readingStyle = computed(() => ({
  fontSize: `${settingsStore.settings.fontSize * 1.1}px`,
  lineHeight: `${settingsStore.settings.fontSize * 1.7}px`
}));

const openSaint = (other: SaintInfo) => {
  HapticsService.light();
  router.push(saintPath(other));
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/saint" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ t('saints.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <article v-if="saint" class="saint-detail">
        <p class="eyebrow">{{ t('saints.feast') }} · {{ feastDay }}</p>
        <h1 class="saint-name">{{ saint.name }}</h1>

        <dl v-if="facts.length" class="facts">
          <div v-for="fact in facts" :key="fact.label" class="fact">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>

        <section>
          <h2 class="section-title">{{ t('saints.history') }}</h2>
          <p v-if="saint.description" :style="readingStyle" class="description">{{ saint.description }}</p>
          <p v-else class="muted">{{ t('saints.no_bio') }}</p>
        </section>

        <section v-if="sameDaySaints.length">
          <h2 class="section-title">{{ t('saints.also_on', {date: feastDay}) }}</h2>
          <SaintList :saints="sameDaySaints" @select="openSaint"/>
        </section>
      </article>

      <div v-else class="saint-detail">
        <p class="muted">{{ t('saints.not_found') }}</p>
        <router-link to="/saint">{{ t('saints.back_to_saints') }}</router-link>
      </div>

      <p class="footer">
        <a href="https://breviarium.es/" target="_blank">Breviarium Project</a> •
        <a href="https://breviarium.es/sanctus/" target="_blank">Sanctus</a>
      </p>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.saint-detail {
  max-width: 640px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem 0;
}

.eyebrow {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ion-color-primary);
}

.saint-name {
  margin: 0.35rem 0 1.25rem;
  font-size: 1.9rem;
  font-weight: 600;
  line-height: 1.2;
}

.facts {
  margin: 0 0 1.5rem;
  padding: 0.25rem 1rem;
  border-radius: 16px;
  background: var(--background-color-card);
}

.fact {
  padding: 0.7rem 0;
}

.fact:not(:last-child) {
  border-bottom: 0.5px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
}

.fact dt {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

.fact dd {
  margin: 0.15rem 0 0;
}

section {
  margin-bottom: 1.75rem;
}

.section-title {
  margin: 0 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}

.description {
  margin: 0;
  user-select: text;
}

.muted {
  opacity: 0.65;
}

.footer {
  text-align: center;
  /* Bottom padding keeps the footer clear of the floating tab bar */
  padding: 0.5em 0 96px;
  font-size: 0.9rem;
}
</style>
