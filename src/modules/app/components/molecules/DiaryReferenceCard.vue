<template>
  <component :is="link ? RouterLink : 'div'" :to="link ? reference.path : undefined" class="reference-card">
    <span class="reference-label">
      <ion-icon :icon="bookmarkOutline" aria-hidden="true"></ion-icon>
      {{ reference.label }}
    </span>
    <span v-if="reference.quote" class="reference-quote">«{{ reference.quote }}»</span>
  </component>
</template>

<script lang="ts" setup>
import {RouterLink} from 'vue-router';
import {IonIcon} from '@ionic/vue';
import {bookmarkOutline} from 'ionicons/icons';
import type {DiaryReference} from '@/modules/app/stores/diaryStore.ts';

withDefaults(defineProps<{ reference: DiaryReference; link?: boolean }>(), {link: true});
</script>

<style scoped>
.reference-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-left: 3px solid var(--ion-color-primary);
  border-radius: 8px;
  background: var(--background-color-card);
  color: var(--ion-text-color);
  font-weight: 400;
  text-decoration: none;
}

.reference-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--ion-color-primary);
}

.reference-quote {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-style: italic;
  font-size: 0.95rem;
  line-height: 1.4;
}
</style>
