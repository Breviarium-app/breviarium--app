<script lang="ts" setup>
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {ellipsisHorizontal, journalOutline, notificationsOutline, shareOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {useRoute} from 'vue-router';
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {computed, ref} from "vue";
import LiturgyInformation from "@/modules/app/components/molecules/home-banners/LiturgyInformation.vue";
import AutoScrollButton from "@/modules/app/components/atoms/AutoScrollButton.vue";
import TextToSpeechButton from "@/modules/app/components/atoms/TextToSpeechButton.vue";
import DiaryEntryModal from "@/modules/app/components/molecules/DiaryEntryModal.vue";
import {datedPath, type DiaryReference} from "@/modules/app/stores/diaryStore.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import PrayerAlertModal from "@/modules/app/components/molecules/PrayerAlertModal.vue";
import {useAlertsStore} from "@/modules/app/stores/alertsStore.ts";
import {type AlertKey, isAlertKey} from "@/modules/app/constants/alerts.ts";
import {useShareLink} from "@/modules/app/composables/useShareLink.ts";
import HapticsService from "@/modules/app/services/HapticsService.ts";

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
  },
  // Dated route segment used for the share link, e.g. "laudes"; no share option without it
  sharePage: {
    type: String,
    required: false,
  },
  // Daily reminder offered in the menu; defaults to the one matching sharePage
  alert: {
    type: String as () => AlertKey,
    required: false,
  },
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

const alertsStore = useAlertsStore();
const {share} = useShareLink();

const alertKey = computed<AlertKey | null>(() => {
  if (!alertsStore.isSupported) return null;
  if (props.alert) return props.alert;
  return isAlertKey(props.sharePage) ? props.sharePage : null;
});

const alertModalKey = ref<AlertKey | null>(null);

const menuEvent = ref<Event | null>(null);

const openMenu = (event: Event) => {
  HapticsService.light();
  menuEvent.value = event;
};

// Runs once the menu is fully closed: it hands focus back to its button on dismiss, which
// would otherwise land in the next overlay's focus trap and focus (open) its first input
let pendingMenuAction: (() => void) | null = null;

const runMenuAction = (action: () => void) => {
  pendingMenuAction = action;
  menuEvent.value = null;
};

const onMenuDismissed = () => {
  menuEvent.value = null;
  pendingMenuAction?.();
  pendingMenuAction = null;
};

const prayerWrapper = ref<HTMLElement | null>(null);

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
          <ion-button :aria-label="t('prayer_menu.open')" @click="openMenu" @pointerdown="captureSelection">
            <ion-icon slot="icon-only" :icon="ellipsisHorizontal" aria-hidden="true"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="prayer-page">
        <div ref="prayerWrapper" :style="prayerWrapperStyle" class="prayer-wrapper">
          <div v-if="displayLiturgicalInfo" class="center">
            <LiturgyInformation/>
          </div>
          <slot></slot>
        </div>
      </div>
      <TextToSpeechButton :target="prayerWrapper"/>
      <AutoScrollButton/>
    </ion-content>

    <ion-popover :event="menuEvent" :is-open="menuEvent !== null" alignment="end" @didDismiss="onMenuDismissed">
      <ion-list lines="none">
        <ion-item v-if="sharePage" :button="true" :detail="false" @click="runMenuAction(() => share(sharePage!))">
          <ion-icon slot="start" :icon="shareOutline" aria-hidden="true"></ion-icon>
          <ion-label>{{ t('prayer_menu.share') }}</ion-label>
        </ion-item>
        <ion-item :button="true" :detail="false" @click="runMenuAction(openNote)">
          <ion-icon slot="start" :icon="journalOutline" aria-hidden="true"></ion-icon>
          <ion-label>{{ t('diary.write_note') }}</ion-label>
        </ion-item>
        <ion-item v-if="alertKey" :button="true" :detail="false"
                  @click="runMenuAction(() => alertModalKey = alertKey)">
          <ion-icon slot="start" :icon="notificationsOutline" aria-hidden="true"></ion-icon>
          <ion-label>{{ t('prayer_menu.alert') }}</ion-label>
          <ion-note v-if="alertsStore.alerts[alertKey].enabled" slot="end">{{ alertsStore.alerts[alertKey].time }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-popover>

    <DiaryEntryModal :is-open="noteReference !== null" :reference="noteReference" @close="noteReference = null"/>
    <PrayerAlertModal :alert-key="alertModalKey" @close="alertModalKey = null"/>
  </ion-page>
</template>
<style scoped>
ion-popover {
  --width: 250px;
}

ion-popover ion-list {
  padding: 0;
}

/* Items are optional, so the separators are drawn between the visible ones only */
ion-popover ion-item:not(:last-of-type) {
  --inner-border-width: 0 0 0.55px 0;
}

ion-popover ion-icon {
  margin-inline-end: 0.9rem;
  font-size: 1.25rem;
}

ion-popover ion-note {
  font-variant-numeric: tabular-nums;
}

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