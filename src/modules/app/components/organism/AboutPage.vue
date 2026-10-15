<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ t('about.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="about">
        <header class="masthead">
          <img alt="" class="logo" height="64" src="/breviarium-favicon-small.png" width="64"/>
          <h1 class="app-name">{{ t('title') }}</h1>
          <p class="app-subtitle">{{ t('landing.subtitle') }}</p>
          <VersionNumber :hideOpenSource="true"/>
        </header>

        <div class="top-meta">

          <ReleaseNotesHistory/>
        </div>

        <section>
          <h2 class="section-title">{{ t('about.what_title') }}</h2>
          <p>{{ t('about.what_text') }}</p>

          <ul class="features">
            <li v-for="feature in features" :key="feature.text">
              <ion-icon :icon="feature.icon" aria-hidden="true"/>
              <span>{{ feature.text }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="section-title">{{ t('about.mission_title') }}</h2>
          <p>{{ t('about.mission_text') }}</p>
          <figure v-for="quote in churchQuotes" :key="quote.text" class="church-quote">
            <blockquote>«{{ t(quote.text) }}»</blockquote>
            <figcaption>{{ t(quote.ref) }}</figcaption>
          </figure>
        </section>
        <SocialIcons/>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {checkmarkCircleOutline, flashOutline, journalOutline, leafOutline, listOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import VersionNumber from "@/modules/app/components/molecules/VersionNumber.vue";
import SocialIcons from "@/modules/app/components/molecules/SocialIcons.vue";
import ReleaseNotesHistory from "@/modules/onboarding/ReleaseNotesHistory.vue";

const {t} = useI18n();

const features = [
  {icon: flashOutline, text: t('about.feature_fast')},
  {icon: leafOutline, text: t('about.feature_light')},
  {icon: checkmarkCircleOutline, text: t('about.feature_complete')},
  {icon: listOutline, text: t('about.feature_intentions')},
  {icon: journalOutline, text: t('about.feature_diary')},
];

// Same two citations shown in the "¿Qué es la Liturgia de las Horas?" panel on Home
const churchQuotes = [
  {text: 'landing.info.quote_sc', ref: 'landing.info.quote_sc_ref'},
  {text: 'landing.info.quote_cec', ref: 'landing.info.quote_cec_ref'},
];
</script>

<style scoped>
.about {
  max-width: 560px;
  margin: 0 auto;
  /* Bottom padding keeps the last section clear of the floating tab bar */
  padding: 0.5rem 1.25rem 96px;
}

.masthead {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0 1.75rem;
}

.logo {
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
}

.app-name {
  margin: 0.9rem 0 0.15rem;
  font-size: 1.7rem;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.app-subtitle {
  margin: 0;
  font-size: 0.95rem;
  font-style: italic;
  opacity: 0.7;
}

section {
  margin-bottom: 1.75rem;
}

.section-title {
  margin: 0 0 0.6rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ion-color-primary);
}

p {
  margin: 0 0 0.75rem;
  line-height: 1.6;
}

p:last-child {
  margin-bottom: 0;
}

.features {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.features li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.features ion-icon {
  flex-shrink: 0;
  font-size: 1.2rem;
  color: var(--ion-color-primary);
}

.epigraph {
  margin: 1rem 0 1.5rem;
  text-align: center;
}

.epigraph blockquote {
  margin: 0;
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.4;
  color: var(--ion-color-primary);
}

.epigraph figcaption,
.church-quote figcaption {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  opacity: 0.6;
}

.quote-group-title {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}

.church-quote {
  margin: 0 0 1rem;
  padding-left: 1rem;
  border-left: 2px solid var(--ion-color-primary);
}

.church-quote:last-child {
  margin-bottom: 0;
}

.church-quote blockquote {
  margin: 0;
  font-style: italic;
}

.learn-more {
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.learn-more a {
  color: var(--ion-color-primary);
  font-weight: 400;
}

.top-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  margin: 0 0 2rem;
}

/* Sits right under the masthead here, so it doesn't need the footer's own top spacing */
.top-meta :deep(.version) {
  padding-top: 0;
}
</style>
