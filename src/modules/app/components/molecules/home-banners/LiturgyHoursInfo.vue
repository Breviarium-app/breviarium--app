<template>
  <button :aria-label="t('landing.info.title')" class="info-badge btn" @click="setOpen(true)">
    <ion-icon :icon="informationCircleOutline"/>
    {{ t('landing.info.badge') }}
  </button>

  <Teleport to="body">
    <ion-modal :breakpoints="[0, 0.8, 1]" :expand-to-scroll="false" :initial-breakpoint="0.8" :is-open="isOpen"
               class="info-modal" @didDismiss="setOpen(false)">
      <ion-content>
        <div class="modal-header">
          <h2 class="modal-title">{{ t('landing.info.title') }}</h2>
          <ion-button class="close-button" fill="clear" @click="setOpen(false)">
            <ion-icon :icon="closeOutline"/>
          </ion-button>
        </div>
        <div class="modal-content">
          <figure class="epigraph">
            <blockquote>«{{ t('landing.info.psalm_quote') }}»</blockquote>
            <figcaption>{{ t('landing.info.psalm_ref') }}</figcaption>
          </figure>

          <p>{{ t('landing.info.what') }}</p>
          <p>{{ t('landing.info.hours') }}</p>

          <h3 class="sheet-section-title">{{ t('landing.info.church_title') }}</h3>
          <figure v-for="quote in churchQuotes" :key="quote.text" class="church-quote">
            <blockquote>«{{ t(quote.text) }}»</blockquote>
            <figcaption>{{ t(quote.ref) }}</figcaption>
          </figure>

          <h3 class="sheet-section-title">{{ t('landing.info.why_title') }}</h3>
          <ul class="benefits">
            <li v-for="benefit in benefits" :key="benefit.key">
              <ion-icon :icon="benefit.icon"/>
              <span>{{ t(benefit.key) }}</span>
            </li>
          </ul>
        </div>
      </ion-content>
    </ion-modal>
  </Teleport>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {IonButton, IonContent, IonIcon, IonModal} from "@ionic/vue";
import {
  closeOutline,
  cloudOfflineOutline,
  informationCircleOutline,
  timeOutline,
  todayOutline
} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import HapticsService from "@/modules/app/services/HapticsService.ts";

const {t} = useI18n();

const benefits = [
  {key: 'landing.info.why_complete', icon: todayOutline},
  {key: 'landing.info.why_hour', icon: timeOutline},
  {key: 'landing.info.why_offline', icon: cloudOfflineOutline},
];

const churchQuotes = [
  {text: 'landing.info.quote_sc', ref: 'landing.info.quote_sc_ref'},
  {text: 'landing.info.quote_cec', ref: 'landing.info.quote_cec_ref'},
];

const isOpen = ref(false);

const setOpen = (open: boolean) => {
  HapticsService.light();
  isOpen.value = open;
};
</script>

<style scoped>
.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem 0.2rem 0.45rem;
  border: 0;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--ion-color-primary);
  background: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.06);
  -webkit-tap-highlight-color: transparent;
}

.info-badge ion-icon {
  font-size: 1rem;
}

ion-modal {
  --background: var(--ion-background-color);
  --border-radius: 20px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0.5rem 0 1.25rem;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.close-button {
  --color: var(--ion-text-color);
  font-size: 1.1rem;
}

.modal-content {
  padding: 0.25rem 1.25rem 2rem;
  line-height: 1.6;
}

.epigraph {
  margin: 0.75rem 0 1.5rem;
  text-align: center;
}

.epigraph blockquote {
  margin: 0;
  font-size: 1.15rem;
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

.church-quote {
  margin: 0 0 1rem;
  padding-left: 1rem;
  border-left: 2px solid var(--ion-color-primary);
}

.church-quote blockquote {
  margin: 0;
  font-style: italic;
}

.sheet-section-title {
  margin: 1.5rem 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}

.benefits {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.benefits li {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
}

.benefits ion-icon {
  flex-shrink: 0;
  margin-top: 0.2rem;
  font-size: 1.25rem;
  color: var(--ion-color-primary);
}
</style>
