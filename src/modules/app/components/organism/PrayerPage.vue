<script lang="ts" setup>
import {IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {journalOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {useRoute} from 'vue-router';
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {computed, ref} from "vue";
import LiturgyInformation from "@/modules/app/components/molecules/home-banners/LiturgyInformation.vue";
import AutoScrollButton from "@/modules/app/components/atoms/AutoScrollButton.vue";
import DiaryEntryModal from "@/modules/app/components/molecules/DiaryEntryModal.vue";
import {datedPath, type DiaryReference} from "@/modules/app/stores/diaryStore.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";

const route = useRoute();
const prayerType = route.params.type;

const props = defineProps({
  title: {
    required: false,
  },
  displayLiturgicalInfo: {
    required: false,
    default: false,
    type: Boolean,
  }
})

const getPrayerTitle = (type: string) => {
  const titles: { [key: string]: string } = {
    'evangelium-and-lectiones': 'Evangelio y lecturas',
    laudes: 'Laudes',
    vesperae: 'Vísperas',
    officium: 'Oficio',
    tertia: 'Tercia',
    sexta: 'Sexta',
    nona: 'Nona',
    completorium: 'Completas',
    lectiones: 'Lecturas'
  };
  return titles[type as string] || type;
};

const settingsStore = useSettingsStore();
const {t, locale} = useI18n();

const noteReference = ref<DiaryReference | null>(null);
let selectedText = '';

// Read on pointerdown: on mobile the selection is cleared by the time the click fires.
const captureSelection = () => {
  selectedText = window.getSelection()?.toString().trim().slice(0, 1000) ?? '';
};

const openNote = () => {
  const path = datedPath(route.path, useDateStore().currentDate);
  const title = String(props.title || getPrayerTitle(prayerType as string));
  const isDated = /^\/\d{4}\/\d{1,2}\/\d{1,2}\//.test(path);
  const date = useDateStore().currentDate.toLocaleDateString(locale.value, {day: 'numeric', month: 'long', year: 'numeric'});
  noteReference.value = {
    label: isDated ? `${title} · ${date}` : title,
    path,
    quote: selectedText || undefined,
  };
  selectedText = '';
};

const prayerWrapperStyle = computed(() => ({
  fontSize: `${settingsStore.settings.fontSize * 1.2}px`,
  lineHeight: `${settingsStore.settings.fontSize * 1.7}px`
}));

</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title || getPrayerTitle(prayerType as string) }}</ion-title>
        <ion-buttons slot="end">
          <slot name="header-end"></slot>
          <ion-button :aria-label="t('diary.write_note')" @click="openNote" @pointerdown="captureSelection">
            <ion-icon slot="icon-only" :icon="journalOutline" aria-hidden="true"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="prayer-page">
        <div :style="prayerWrapperStyle" class="prayer-wrapper">
          <div v-if="displayLiturgicalInfo" class="center">
            <LiturgyInformation/>
          </div>
          <slot></slot>
        </div>
      </div>
      <AutoScrollButton/>
    </ion-content>

    <DiaryEntryModal :is-open="noteReference !== null" :reference="noteReference" @close="noteReference = null"/>
  </ion-page>
</template>
<style scoped>
.prayer-page {
  display: flex;
  justify-content: center;
}

.prayer-wrapper {
  display: block;
  max-width: min(800px, 100%);
  font-size: 1.2rem;
  -webkit-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  user-select: auto !important;
  margin-bottom: 4rem;
}

:deep(.prayer-wrapper p) {
  margin: 0 0 0.7rem 0;
}
</style>