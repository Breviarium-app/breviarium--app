<template>
  <div class="date-button" @click="setOpen(true)">
    <CircleLiturgicalColor :liturgical-color-var="color"/>
    {{ buildLocalDate(printableDate) }}
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
            ref="datetime"
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
import {buildLocalDate} from "@/constants/utils.ts";
import {computed, onMounted, ref, watch} from "vue";
import {IonButton, IonDatetime, IonHeader, IonModal, IonToolbar} from "@ionic/vue";
import CircleLiturgicalColor from "@/components/atoms/CircleLiturgicalColor.vue";
import HapticsService from "@/services/HapticsService.ts";
import {useDateStore} from "@/stores/useDateStore.ts";
import Breviarium from "breviarium";

const modal = ref();
const dateStore = useDateStore();
const datetimeModel = ref(dateStore.getCurrentDate);
const printableDate = computed(() => new Date(datetimeModel.value))
const isOpen = ref(false);

watch(datetimeModel, () => {
  const newDate = new Date(datetimeModel.value)
  if (newDate) {
    dateStore.setDate(newDate);
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

const color = ref();

onMounted(async () => {
  const brev = new Breviarium(useDateStore().getCurrentDate);
  brev.getLiturgyInformation().then(data => {
    color.value = data.color
  });
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