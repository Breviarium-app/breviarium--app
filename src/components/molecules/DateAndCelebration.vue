<template>
  <div class="date-button" @click="setOpen(true)">
    <CircleLiturgicalColor :liturgical-color-var="LiturgicalColors.PURPLE_C"/>
    {{ buildLocalDate(printedDate) }}
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
        <ion-datetime ref="datetime"
                      v-model="datetime"
                      :first-day-of-week="1"
                      :prefer-wheel="false"
                      :value="printedDate.toISOString()"
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
import {ref, watch} from "vue";
import {IonButton, IonDatetime, IonHeader, IonModal, IonToolbar} from "@ionic/vue";
import CircleLiturgicalColor from "@/components/atoms/CircleLiturgicalColor.vue";
import {LiturgicalColors} from "@/constants/types.ts";
import HapticsService from "@/services/HapticsService.ts";
import {useDateStore} from "@/stores/useDateStore.ts";


const modal = ref();
const datetime = ref();
const isOpen = ref<boolean>(false);

const printedDate = ref<Date>((useDateStore().getCurrentDate));

/* Calendar funtions */
const setOpen = (open: boolean) => {
  HapticsService.light();
  isOpen.value = open;
};
watch(datetime, () => {
  console.log("datetime.value", datetime.value)
  useDateStore().setDate(datetime.value);
})
// const onchange = async (event: CustomEvent) => {
//   console.log("EY")
//   HapticsService.light();
//
//   // const oSelectedDay = datetime.value.$el.activeParts
//   const value = event.detail.value;
//
//   selectedDate = new Date(
//       value.year,
//       value.month - 1,
//       value.day,
//       12,
//   );
//   console.log("selectedDate from ionmodal", selectedDate)
//
// };

const goToday = () => {
  datetime.value.$el.setActiveParts(datetime.value.$el.todayParts);
};

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