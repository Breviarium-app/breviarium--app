<template>
  <div class="date-button" @click="setOpen(true)">
    <CircleLiturgicalColor :liturgical-color-var="color"/>
    {{ liturgyInformationData?.celebration }}<br/>
    <small class="title-color">{{ buildLocalDate(printableDate) }} - {{ rank }}</small>
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
import {IonButton, IonDatetime, IonHeader, IonModal, IonToolbar} from "@ionic/vue";
import CircleLiturgicalColor from "@/components/atoms/CircleLiturgicalColor.vue";
import HapticsService from "@/services/HapticsService.ts";
import {useDateStore} from "@/stores/useDateStore.ts";
import {useBreviariumStore} from "@/stores/breviarium.ts";

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

</script>
<style scoped>

.date-button {
  font-size: 1.2em;
  padding: 8px;
  cursor: pointer;
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