<script lang="ts" setup>
import {IonContent, IonIcon, IonPage, onIonViewWillEnter, useBackButton, useIonRouter} from '@ionic/vue';
import {App} from '@capacitor/app';
import {computed, ref} from "vue";
import {arrowForward} from "ionicons/icons";
import {currentLiturgyHour} from "@/modules/app/constants/utils.ts";
import DateAndCelebration from "@/modules/app/components/molecules/home-banners/DateAndCelebration.vue";
import router from "@/modules/app/router";
import {useI18n} from 'vue-i18n'
import SaintBannerComponent from "@/modules/app/components/molecules/home-banners/SaintBannerComponent.vue";
import PopularPrayers from "@/modules/app/components/molecules/home-banners/PopularPrayers.vue";
import JerusalemBibleBanner from "@/modules/app/views/JerusalemBibleBanner.vue";
import EvangeliumBanner from "@/modules/app/views/EvangeliumBanner.vue";
import AnimatedComponent from "@/modules/app/components/molecules/AnimatedComponent.vue";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import SocialIcons from "@/modules/app/components/molecules/SocialIcons.vue";
import LiturgyHoursInfo from "@/modules/app/components/molecules/home-banners/LiturgyHoursInfo.vue";

const {t} = useI18n()

const ionRouter = useIonRouter();
useBackButton(-1, () => {
  if (!ionRouter.canGoBack()) {
    App.exitApp();
  }
});

const baseDelay = 150;
const delayIncrement = 60;

// Use a function to calculate the delay for each component
const getDelay = (index: number) => baseDelay + (index * delayIncrement);

// Keys match the values returned by currentLiturgyHour()
const officium = {
  key: 'Officium',
  path: '/prayer/officium',
  label: 'breviarium.officium',
  hint: 'landing.hours.officium'
};
const hours = [
  {key: 'Laudes', path: '/prayer/laudes', label: 'breviarium.laudes', hint: 'landing.hours.laudes'},
  {key: 'Tercia', path: '/prayer/tertia', label: 'breviarium.tercia', hint: 'landing.hours.tercia'},
  {key: 'Sexta', path: '/prayer/sexta', label: 'breviarium.sexta', hint: 'landing.hours.sexta'},
  {key: 'Nona', path: '/prayer/nona', label: 'breviarium.nona', hint: 'landing.hours.nona'},
  {key: 'Vesperae', path: '/prayer/vesperae', label: 'breviarium.vesperae', hint: 'landing.hours.vesperae'},
  {
    key: 'Completorium',
    path: '/prayer/completorium',
    label: 'breviarium.completorium',
    hint: 'landing.hours.completorium'
  },
];

// The page stays alive in the Ionic stack, so refresh the current hour on every visit
const currentHourKey = ref(currentLiturgyHour());
onIonViewWillEnter(() => {
  currentHourKey.value = currentLiturgyHour();
});

const currentHour = computed(() => hours.find(hour => hour.key === currentHourKey.value) ?? hours[0]);

useDateStore().updateDateParams()
</script>

<template>
  <ion-page>
    <ion-content>
      <div class="home">
        <header class="masthead">
          <img alt="" class="masthead-logo" height="52" src="/breviarium-favicon-small.png" width="52"/>
          <div>
            <h1 class="masthead-title">{{ t('title') }}</h1>
            <p class="masthead-subtitle">{{ t('landing.subtitle') }}</p>
          </div>
        </header>

        <AnimatedComponent :delay="getDelay(0)">
          <DateAndCelebration/>
        </AnimatedComponent>

        <AnimatedComponent :delay="getDelay(1)">
          <button class="now-card btn" @click="router.push(currentHour.path)">
            <span class="now-eyebrow">{{ t('landing.now') }}</span>
            <span class="now-title">{{ t(currentHour.label) }}</span>
            <span class="now-hint">{{ t(currentHour.hint) }}</span>
            <ion-icon :icon="arrowForward" class="now-arrow"/>
          </button>
        </AnimatedComponent>

        <section>
          <div class="section-heading">
            <h2 class="section-title">{{ t('landing.hours_title') }}</h2>
            <LiturgyHoursInfo/>
          </div>
          <AnimatedComponent :delay="getDelay(2)">
            <div class="hours-grid">
              <button v-for="hour in hours" :key="hour.key"
                      :aria-current="hour.key === currentHourKey ? 'time' : undefined"
                      :class="{ 'hour-tile--current': hour.key === currentHourKey }"
                      class="hour-tile btn"
                      @click="router.push(hour.path)">
                <span class="hour-name">{{ t(hour.label) }}</span>
                <span class="hour-hint">{{ t(hour.hint) }}</span>
              </button>
              <button class="hour-tile hour-tile--wide btn" @click="router.push(officium.path)">
                <span class="hour-name">{{ t(officium.label) }}</span>
                <span class="hour-hint">{{ t(officium.hint) }}</span>
              </button>
            </div>
          </AnimatedComponent>
        </section>

        <section>
          <h2 class="section-title">{{ t('landing.today_title') }}</h2>
          <AnimatedComponent :delay="getDelay(3)">
            <div class="today-list">
              <EvangeliumBanner/>
              <SaintBannerComponent/>
              <PopularPrayers/>
              <JerusalemBibleBanner/>
            </div>
          </AnimatedComponent>
        </section>

        <AnimatedComponent :delay="getDelay(4)">
          <SocialIcons/>
        </AnimatedComponent>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.home {
  max-width: 560px;
  margin: 0 auto;
  /* Bottom padding keeps the last section clear of the floating tab bar */
  padding: 1.25rem 1rem 96px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.masthead {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.25rem 0.25rem 0.5rem;
}

.masthead-logo {
  flex-shrink: 0;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
}

.masthead-title {
  margin: 0;
  font-size: 1.85rem;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.01em;
  color: var(--ion-color-primary);
}

.masthead-subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.9rem;
  font-style: italic;
  opacity: 0.7;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0.25rem 0.6rem;
}

.section-heading .section-title {
  margin: 0;
}

.section-title {
  margin: 0.5rem 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}

button {
  font-family: inherit;
  font-weight: 400;
  color: inherit;
  text-align: left;
  border: 0;
  -webkit-tap-highlight-color: transparent;
}

.now-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.1rem 3.5rem 1.15rem 1.25rem;
  border-radius: 18px;
  background: var(--ion-color-primary);
  color: #fff;
  box-shadow: 0 6px 20px -8px var(--ion-color-primary);
}

.now-eyebrow {
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.85;
}

.now-title {
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.2;
}

.now-hint {
  font-size: 0.9rem;
  font-style: italic;
  opacity: 0.9;
}

.now-arrow {
  position: absolute;
  right: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.4rem;
  padding: 0.45rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
}

.hours-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.hour-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.8rem 1rem;
  border-radius: 14px;
  background: var(--background-color-card);
  box-shadow: inset 0 0 0 1.5px transparent;
  transition: transform 0.15s ease-out, box-shadow 0.2s ease;
}

.hour-tile--wide {
  grid-column: 1 / -1;
}

.hour-tile--current {
  box-shadow: inset 0 0 0 1.5px var(--ion-color-primary);
}

.hour-tile--current::after {
  content: '';
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ion-color-primary);
}

.hour-name {
  font-size: 1.05rem;
  font-weight: 400;
}

.hour-tile--current .hour-name {
  color: var(--ion-color-primary);
}

.hour-hint {
  font-size: 0.8rem;
  opacity: 0.65;
}

.today-list {
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-color-card);
}

/* The banners carry their own card styling for standalone use; flatten them into one grouped list here */
.today-list :deep(.prayer-item) {
  --background: transparent;
  --border-radius: 0;
  --padding-start: 16px;
  --inner-padding-top: 4px;
  --inner-padding-bottom: 4px;
}

.today-list :deep(.prayer-item:not(:last-child)) {
  --inner-border-width: 0 0 0.5px 0;
  --border-color: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
}

.today-list :deep(ion-icon[slot="start"]) {
  margin-inline-end: 14px;
  font-size: 1.3rem;
  color: var(--ion-color-primary);
}

@media (prefers-reduced-motion: reduce) {
  .hour-tile, .btn {
    transition: none;
  }
}
</style>
