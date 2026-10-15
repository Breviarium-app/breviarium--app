<template>
  <component :is="link ? RouterLink : 'div'" :to="link ? reference.path : undefined" class="reference-card">
    <span class="reference-label">
      <ion-icon :icon="bookmarkOutline" aria-hidden="true"></ion-icon>
      <span class="reference-name">{{ reference.label }}</span>
      <ion-icon v-if="link" :icon="chevronForward" aria-hidden="true" class="reference-chevron"></ion-icon>
    </span>
    <span v-if="reference.quote" class="reference-quote">«{{ reference.quote }}»</span>
  </component>
</template>

<script lang="ts" setup>
import {RouterLink} from 'vue-router';
import {IonIcon} from '@ionic/vue';
import {bookmarkOutline, chevronForward} from 'ionicons/icons';
import type {DiaryReference} from '@/modules/app/stores/diaryStore.ts';

withDefaults(defineProps<{ reference: DiaryReference; link?: boolean }>(), {link: true});
</script>

<style scoped>
.reference-card {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.6rem 0.8rem;
  border-left: 2px solid var(--ion-color-primary);
  border-radius: 4px 12px 12px 4px;
  background: var(--ion-background-color);
  color: var(--ion-text-color);
  font-weight: 400;
  text-decoration: none;
}

.reference-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ion-color-primary);
}

.reference-name {
  flex: 1;
  min-width: 0;
}

.reference-chevron {
  flex-shrink: 0;
  opacity: 0.7;
}

.reference-quote {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-style: italic;
  font-size: 0.95rem;
  line-height: 1.45;
  opacity: 0.85;
}
</style>
