<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {ref} from "vue";

withDefaults(defineProps<{
  title?: string;
  /** Small label above the title */
  eyebrow?: string;
  /** Show a back button that falls back to this route when there is no history */
  backHref?: string;
  backText?: string;
}>(), {
  title: "",
  eyebrow: "",
  backHref: "",
  backText: "Atrás",
});

// The toolbar title only appears once the page heading has scrolled away
const scrolled = ref(false);
const onScroll = (event: CustomEvent<{ scrollTop: number }>) => {
  scrolled.value = event.detail.scrollTop > 56;
};
</script>

<template>
  <ion-page>
    <ion-header :class="{scrolled}" :translucent="true">
      <ion-toolbar>
        <ion-buttons v-if="backHref" slot="start">
          <ion-back-button :default-href="backHref" :text="backText"/>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons v-if="$slots.end" slot="end">
          <slot name="end"/>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-events="true" @ion-scroll="onScroll">
      <div class="page">
        <header class="page-heading">
          <p v-if="eyebrow" class="es-eyebrow">{{ eyebrow }}</p>
          <h1 class="page-title">{{ title }}</h1>
          <div v-if="$slots.subtitle" class="page-subtitle">
            <slot name="subtitle"/>
          </div>
        </header>
        <slot/>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-title {
  font-size: 1.05rem;
  opacity: 0;
  transition: opacity 200ms var(--ease);
}

.scrolled ion-title {
  opacity: 1;
}

.page {
  max-width: calc(38rem + 2 * var(--space-5));
  margin: 0 auto;
  /* Bottom padding keeps the content clear of the floating tab bar */
  padding: var(--space-2) var(--space-4) 8rem;
  color: var(--ink);
}

.page-heading {
  margin: var(--space-4) 0 var(--space-6);
}

.page-title {
  font-size: clamp(2rem, 6vw, 2.75rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin: 0;
}

.page-subtitle {
  margin-top: var(--space-3);
  color: var(--ink-faint);
  font-size: 0.95rem;
}
</style>
