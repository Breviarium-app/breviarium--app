<template>
  <div class="date-navigation">
    <ion-button class="nav-button" fill="clear" @click="changeDate(-1)">
      <ion-icon :icon="chevronBackOutline"></ion-icon>
    </ion-button>

    <div class="date-button" @click="setOpen(true)">
      <CircleLiturgicalColor :liturgical-color-var="color"/>
      {{ liturgyInformationData?.celebration }}<br/>
      <small class="title-color">{{ buildLocalDate(printableDate) }} - {{ rank }}</small>
    </div>

    <ion-button class="nav-button" fill="clear" @click="changeDate(1)">
      <ion-icon :icon="chevronForwardOutline"></ion-icon>
    </ion-button>
  </div>

  <Teleport to="body">
    <ion-modal ref="modal" :is-open="isOpen" @didDismiss="setOpen(false)">
      <ion-header>
        <ion-toolbar>
          <ion-button slot="start" fill="clear" @click="setOpen(false)">Cerrar</ion-button>
          <ion-button slot="end" fill="clear" @click="goToday()">Hoy</ion-button>
        </ion-toolbar>
      </ion-header>

      <div class="modal-wrapper">
        <ion-datetime
            ref="datetimeRef"
            v-model="datetimeModel"
            :first-day-of-week="1"
            :prefer-wheel="false"
            :show-adjacent-days="true"
            locale="es-ES"
            max="2100-12-31"
            min="1990-01-01"
            presentation="date"
            size="cover"
            @ionChange="onDateChange($event)"
        >
        </ion-datetime>
      </div>
    </ion-modal>
  </Teleport>
</template>

<script lang="ts" setup>
import {buildLocalDate, rankTranslate} from "@/modules/app/constants/utils.ts";
import {computed, onMounted, ref, watch} from "vue";
import {IonButton, IonDatetime, IonHeader, IonIcon, IonModal, IonToolbar} from "@ionic/vue";
import CircleLiturgicalColor from "@/modules/app/components/atoms/CircleLiturgicalColor.vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";
import {chevronBackOutline, chevronForwardOutline} from "ionicons/icons";

const pad = (n: number) => String(n).padStart(2, "0");
const toIsoDateString = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseIsoDateString = (s: string) => {
  const datePart = s.split("T")[0];
  const [y, m, d] = datePart.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
};

const dateStore = useDateStore();
const breviariumStore = useBreviariumStore();

const isOpen = ref(false);
const datetimeModel = ref<string>(
    toIsoDateString(dateStore.getCurrentDate || new Date())
);
const datetimeRef = ref();
const printableDate = computed(() => parseIsoDateString(datetimeModel.value));

const liturgyInformationData = ref();
const color = ref();
const rank = ref();

async function onDateChange(event: any) {

  try {
    // Ensure the internal value of ion-datetime is committed
    datetimeRef.value?.$el?.confirm?.();
  } catch (e) {
  }

  console.log(event.detail.value);
  const newDate = event.detail.value;
  console.log("new date", newDate)
  datetimeModel.value = newDate;
  const selectedDate = parseIsoDateString(newDate);
  await updateLiturgy(selectedDate);
  HapticsService.light();

  isOpen.value = false;
}

/* Calendar funtions */
const setOpen = (open: boolean) => {
  HapticsService.light();
  isOpen.value = open;
};

const updateLiturgy = async (newDate: Date) => {
  dateStore.setDate(newDate);
  const data = await breviariumStore.getLiturgyInformation();
  liturgyInformationData.value = data;
  color.value = data?.color;
  if (data?.rank) {
    rank.value = await rankTranslate(data?.rank);
  }
};

const goToday = async () => {
  const today = new Date();
  datetimeModel.value = toIsoDateString(today);
  await updateLiturgy(today);
  setOpen(false);
  HapticsService.light();
};

const changeDate = (days: number) => {
  const current = parseIsoDateString(datetimeModel.value);
  current.setDate(current.getDate() + days);
  datetimeModel.value = toIsoDateString(current);
  updateLiturgy(current);
  HapticsService.light();
};

onMounted(async () => {
  const start = parseIsoDateString(datetimeModel.value);
  await updateLiturgy(start);
});

watch(datetimeModel, async (newDate) => {
  console.log("datetimeModel", newDate);
});
</script>

<style scoped>
.date-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.nav-button {
  --padding-start: 8px;
  --padding-end: 8px;
  height: 100%;
}

.date-button {
  font-size: 1.1em;
  padding: 8px;
  cursor: pointer;
  flex: 1;
  text-align: center;
  touch-action: pan-y pinch-zoom;
}


ion-modal {
  --height: auto;
  --width: 90%;
  --max-width: 400px;
  --border-radius: 16px;
  --background: var(--ion-background-color);
  margin: auto;
}

.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 16px;
}

ion-datetime {
  --background: var(--ion-background-color);
  color: var(--ion-text-color);
  border-radius: 12px;
  box-shadow: 0 0 10px var(--ion-color-step-100);
  --wheel-highlight-background: var(--ion-background-color);
  --wheel-fade-background-rgb: var(--ion-background-color);
}

ion-datetime::part(wheel-item active) {
  color: var(--ion-tab-bar-color);
}

</style>
