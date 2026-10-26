<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>Oraciones Populares</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="popular-prayers">
        <p class="intro">Devociones de la tradición de la Iglesia para rezar en cualquier momento del día.</p>

        <section v-for="group in groups" :key="group.title">
          <h2 class="section-title">{{ group.title }}</h2>
          <div class="prayer-list">
            <ion-item v-for="prayer in group.prayers" :key="prayer.route" :button="true" :detail="true"
                      class="prayer-row" @click="openPrayer(prayer.route)">
              <ion-label>
                <h2>{{ prayer.name }}</h2>
                <p>{{ prayer.description }}</p>
              </ion-label>
              <span v-if="prayer.route === seasonalPrayer && isMiddayNow" slot="end" class="now-badge">Ahora</span>
            </ion-item>
          </div>
        </section>

        <aside class="suggest">
          <ion-icon :icon="mailOutline" aria-hidden="true" class="suggest-icon"/>
          <div>
            <h2 class="suggest-title">¿Echas en falta alguna oración?</h2>
            <p class="suggest-text">
              Si quieres que añadamos una oración, escríbenos por correo electrónico a
              <a href="mailto:info@breviarium.es" target="_blank">info@breviarium.es</a>
            </p>
          </div>
        </aside>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/vue";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {mailOutline} from "ionicons/icons";
import router from "@/modules/app/router";
import {getRosaryMysteriesForToday, isEaster} from "@/modules/app/constants/utils.ts";
import HapticsService from "@/modules/app/services/HapticsService.ts";

const {t} = useI18n();

const mysteryNameKeys: Record<string, string> = {
  joyful: 'joyfulName',
  sorrowful: 'sorrowfulName',
  glorious: 'gloriousName',
  luminous: 'lightName',
};
const todaysMysteries = t(mysteryNameKeys[getRosaryMysteriesForToday()]).toLowerCase();

const groups = computed(() => [
  {
    title: "A la Virgen María",
    prayers: [
      {name: "Rosario", route: "rosary", description: `Hoy, misterios ${todaysMysteries}`},
      {name: "Ángelus", route: "angelus", description: "Al amanecer, al mediodía y al atardecer"},
      {name: "Regina Coeli", route: "regina-coeli", description: "Sustituye al Ángelus en el tiempo pascual"},
      {name: "Acordaos", route: "acordaos", description: "Atribuida a san Bernardo de Claraval"},
    ],
  },
  {
    title: "A Jesucristo",
    prayers: [
      {name: "Coronilla de la Divina Misericordia", route: "chaplet-divine-mercy", description: "Revelada a santa Faustina Kowalska"},
      {name: "Letanías de la Humildad", route: "litanies-humility", description: "Del cardenal Rafael Merry del Val"},
      {name: "Alma de Cristo", route: "alma-de-cristo", description: "Oración eucarística clásica"},
      {name: "Comunión espiritual", route: "comunion-espiritual", description: "De san Alfonso María de Ligorio"},
    ],
  },
  {
    title: "Al Espíritu Santo",
    prayers: [
      {name: "Secuencia de Pentecostés", route: "oracion-espiritu-santo", description: "Invocación clásica previa al estudio o la toma de decisiones"},
    ],
  },
  {
    title: "A los ángeles y santos",
    prayers: [
      {name: "San Miguel Arcángel", route: "san-miguel", description: "Del papa León XIII"},
      {name: "Letanías de San José", route: "litanies-saint-joseph", description: "Aprobadas por san Pío X"},
      {name: "Oración a San José", route: "prayer-saint-joseph", description: "Del papa Francisco, Patris Corde"},
    ],
  },
  {
    title: "A la Sagrada Familia",
    prayers: [
      {name: "Oración a la Sagrada Familia", route: "sagrada-familia", description: "Del papa Francisco, Amoris Laetitia"},
    ],
  },
  {
    title: "Oraciones básicas",
    prayers: [
      {name: "Acto de contrición", route: "acto-contricion", description: "Para examinar la conciencia"},
      {name: "Credo", route: "credo", description: "Símbolo niceno-constantinopolitano y de los apóstoles"},
    ],
  },
]);

// Regina Coeli replaces the Ángelus during Easter time
const seasonalPrayer = ref<string>();

// Both are prayed at midday, so "Ahora" only shows in that window, not all day
const MIDDAY_START_MINUTES = 11 * 60 + 50;
const MIDDAY_END_MINUTES = 12 * 60 + 30;
const isMiddayNow = ref(false);
const updateIsMiddayNow = () => {
  const now = new Date();
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
  isMiddayNow.value = minutesSinceMidnight >= MIDDAY_START_MINUTES && minutesSinceMidnight <= MIDDAY_END_MINUTES;
};

let middayCheckInterval: ReturnType<typeof setInterval> | undefined;

onMounted(async () => {
  seasonalPrayer.value = await isEaster() ? 'regina-coeli' : 'angelus';
  updateIsMiddayNow();
  // Keeps the badge in sync if the page is left open across 11:50 or 12:30
  middayCheckInterval = setInterval(updateIsMiddayNow, 60_000);
});

onBeforeUnmount(() => {
  clearInterval(middayCheckInterval);
});

const openPrayer = (route: string) => {
  HapticsService.light();
  router.push(`/popular-prayers/${route}`);
};
</script>

<style scoped>
.popular-prayers {
  max-width: 560px;
  margin: 0 auto;
  /* Bottom padding keeps the last card clear of the floating tab bar */
  padding: 1rem 1rem 96px;
}

.intro {
  margin: 0.25rem 0.25rem 1.5rem;
  font-style: italic;
  line-height: 1.5;
  opacity: 0.75;
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

.prayer-list {
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-color-card);
}

.prayer-row {
  --background: transparent;
  --padding-start: 16px;
  --inner-padding-top: 4px;
  --inner-padding-bottom: 4px;
}

.prayer-row:not(:last-child) {
  --inner-border-width: 0 0 0.5px 0;
  --border-color: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
}

.now-badge {
  margin-inline-end: 4px;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  background: var(--ion-color-primary);
}

.suggest {
  display: flex;
  gap: 0.9rem;
  margin-top: 2rem;
  padding: 1rem 1.1rem;
  border-radius: 16px;
  border: 1px dashed rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.2);
}

.suggest-icon {
  flex-shrink: 0;
  margin-top: 0.15rem;
  font-size: 1.4rem;
  color: var(--ion-color-primary);
}

.suggest-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 400;
}

.suggest-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.8;
}

.suggest-text a {
  font-weight: 400;
  overflow-wrap: anywhere;
}
</style>
