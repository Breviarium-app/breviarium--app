<template>
  <div class="date-navigation">
    <ion-button class="nav-button" fill="clear" @click="changeDate(-1)">
      <ion-icon :icon="chevronBackOutline"></ion-icon>
    </ion-button>

    <div class="date-button">
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
          <ion-button slot="end" :strong="true" fill="clear" @click="goToday()">Hoy</ion-button>
        </ion-toolbar>
      </ion-header>
      <div class="modal-wrapper">
        <ion-datetime
            v-model="datetimeModel"
            :first-day-of-week="1"
            :prefer-wheel="false"
            max="2100-12-31"
            min="1990-01-01"
            presentation="date"
            size="cover"/>
      </div>
    </ion-modal>
  </Teleport>
</template>
<script lang="ts" setup>
import {buildLocalDate, rankTranslate} from "@/constants/utils.ts";
import {computed, onMounted, ref, watch} from "vue";
import {IonButton, IonDatetime, IonHeader, IonIcon, IonModal, IonToolbar} from "@ionic/vue";
import CircleLiturgicalColor from "@/components/atoms/CircleLiturgicalColor.vue";
import HapticsService from "@/services/HapticsService.ts";
import {useDateStore} from "@/stores/useDateStore.ts";
import {useBreviariumStore} from "@/stores/breviarium.ts";
import {chevronBackOutline, chevronForwardOutline} from "ionicons/icons";

const modal = ref();
const dateStore = useDateStore();
const datetimeModel = ref(dateStore.getCurrentDate || new Date());
console.log("datetimeModel", datetimeModel)
const printableDate = computed(() => new Date(datetimeModel.value))
const isOpen = ref(false);

watch(datetimeModel, async () => {
  const newDate = new Date(datetimeModel.value)
  if (newDate) {
    dateStore.setDate(newDate);
    await useBreviariumStore().getLiturgyInformation().then(data => {
      liturgyInformationData.value = data
      color.value = data.color
    });
    rank.value = await rankTranslate(liturgyInformationData.value?.rank)
  }
})

/* Calendar funtions */
const setOpen = (open: boolean) => {
  HapticsService.light();
  isOpen.value = open;
};

const goToday = () => {
  datetimeModel.value = new Date()
};

const liturgyInformationData = ref();
const color = ref();
const rank = ref();

onMounted(async () => {
  useBreviariumStore().getLiturgyInformation().then(data => {
    liturgyInformationData.value = data
    color.value = data.color
  });
  rank.value = await rankTranslate(liturgyInformationData.value?.rank)
})

const changeDate = (days: number) => {
  const currentDate = new Date(datetimeModel.value);
  currentDate.setDate(currentDate.getDate() + days);
  datetimeModel.value = currentDate;
  HapticsService.light();
};

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
  --border-radius: 16px;
}

.modal-wrapper {
  display: flex;
  justify-content: center;
}

ion-datetime {
  --background: var(--background);
}

</style>