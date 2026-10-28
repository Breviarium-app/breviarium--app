<template>
  <button class="hour-tile hour-tile--wide btn" @click="setOpen(true)">
    <span class="hour-name">{{ t('settings.office_deceased') }}</span>
    <span class="hour-hint">{{ t('landing.hours.deceased_hint') }}</span>
  </button>

  <Teleport to="body">
    <ion-modal :breakpoints="[0, 0.5, 0.8]" :initial-breakpoint="0.5" :is-open="isOpen" class="deceased-modal"
               @didDismiss="setOpen(false)">
      <ion-content>
        <div class="modal-header">
          <div>
            <h2 class="modal-title">{{ t('settings.office_deceased') }}</h2>
            <p class="modal-subtitle">{{ t('landing.deceased_modal.subtitle') }}</p>
          </div>
          <ion-button class="close-button" fill="clear" @click="setOpen(false)">
            <ion-icon :icon="closeOutline"/>
          </ion-button>
        </div>
        <div class="hour-list">
          <button v-for="hour in hours" :key="hour.path" class="hour-item btn" @click="goTo(hour.path)">
            <span>{{ t(hour.label) }}</span>
            <ion-icon :icon="chevronForwardOutline"/>
          </button>
        </div>
      </ion-content>
    </ion-modal>
  </Teleport>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {IonButton, IonContent, IonIcon, IonModal} from "@ionic/vue";
import {chevronForwardOutline, closeOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import router from "@/modules/app/router";
import HapticsService from "@/modules/app/services/HapticsService.ts";

const {t} = useI18n();

const hours = [
  {path: '/prayer/deceased/officium', label: 'breviarium.officium'},
  {path: '/prayer/deceased/laudes', label: 'breviarium.laudes'},
  {path: '/prayer/deceased/tertia', label: 'breviarium.tercia'},
  {path: '/prayer/deceased/sexta', label: 'breviarium.sexta'},
  {path: '/prayer/deceased/nona', label: 'breviarium.nona'},
  {path: '/prayer/deceased/vesperae', label: 'breviarium.vesperae'},
];

const isOpen = ref(false);

const setOpen = (open: boolean) => {
  HapticsService.light();
  isOpen.value = open;
};

const goTo = (path: string) => {
  HapticsService.light();
  setOpen(false);
  router.push(path);
};
</script>

<style scoped>
.hour-tile {
  position: relative;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  width: 100%;
  padding: 0.8rem 1rem;
  border: 0;
  border-radius: 14px;
  background: var(--background-color-card);
  font-family: inherit;
  text-align: left;
  transition: transform 0.15s ease-out;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.hour-name {
  font-size: 1.05rem;
  font-weight: 400;
}

.hour-hint {
  font-size: 0.8rem;
  opacity: 0.65;
}

ion-modal.deceased-modal {
  --background: var(--ion-background-color);
  --border-radius: 20px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 0.5rem;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.modal-subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  opacity: 0.65;
}

.close-button {
  --color: var(--ion-text-color);
  font-size: 1.1rem;
}

.hour-list {
  margin: 0.75rem 1.25rem 2rem;
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-color-card);
}

.hour-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.95rem 1rem;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 1.05rem;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.hour-item:not(:last-child) {
  border-bottom: 0.5px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
}

.hour-item ion-icon {
  opacity: 0.4;
}
</style>
