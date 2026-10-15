<template>
  <button class="history-button btn" @click="setOpen(true)">
    <ion-icon :icon="timeOutline" aria-hidden="true"/>
    {{ t('about.release_notes_button') }}
  </button>

  <Teleport to="body">
    <ion-modal :breakpoints="[0, 0.8, 1]" :expand-to-scroll="false" :initial-breakpoint="0.8" :is-open="isOpen"
               class="history-modal" @didDismiss="setOpen(false)">
      <ion-content>
        <div class="modal-header">
          <h2 class="modal-title">{{ t('about.release_notes_title') }}</h2>
          <ion-button class="close-button" fill="clear" @click="setOpen(false)">
            <ion-icon :icon="closeOutline"/>
          </ion-button>
        </div>
        <div class="modal-content">
          <section v-for="release in releases" :key="release.version" class="release">
            <h3 class="release-version">{{ t('whats_new.version', {version: release.version}) }}</h3>
            <ul class="notes">
              <li v-for="note in release.notes" :key="note.text">
                <ion-icon :icon="note.icon" aria-hidden="true"/>
                <span>{{ note.text }}</span>
              </li>
            </ul>
          </section>
        </div>
      </ion-content>
    </ion-modal>
  </Teleport>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {IonButton, IonContent, IonIcon, IonModal} from "@ionic/vue";
import {closeOutline, timeOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import {RELEASE_NOTES} from "@/modules/onboarding/releaseNotes.ts";
import HapticsService from "@/modules/app/services/HapticsService.ts";

const {t} = useI18n();

// Newest version first; versions are "x.y.z" so each part is compared numerically
const compareVersions = (a: string, b: string) => {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const diff = (partsB[i] ?? 0) - (partsA[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

const releases = Object.entries(RELEASE_NOTES)
    .map(([version, notes]) => ({version, notes}))
    .sort((a, b) => compareVersions(a.version, b.version));

const isOpen = ref(false);
const setOpen = (open: boolean) => {
  HapticsService.light();
  isOpen.value = open;
};
</script>

<style scoped>
.history-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border: 0;
  border-radius: 999px;
  font-family: inherit;
  font-weight: 400;
  font-size: 0.95rem;
  color: var(--ion-color-primary);
  background: var(--background-color-card);
  -webkit-tap-highlight-color: transparent;
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
  padding: 0.25rem 1.25rem 2.5rem;
}

.release {
  margin-top: 1.5rem;
}

.release:first-child {
  margin-top: 0.75rem;
}

.release-version {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}

.notes {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.notes li {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
  line-height: 1.4;
}

.notes ion-icon {
  flex-shrink: 0;
  margin-top: 0.15rem;
  font-size: 1.2rem;
  color: var(--ion-color-primary);
}
</style>
