<template>
  <div id="open-modal-calendar" class="date-button">
    <CircleLiturgicalColor :liturgical-color-var="LiturgicalColors.PURPLE_C"/>
    {{ buildLocalDate(new Date(selectedDate)) }}
  </div>

  <Teleport to="body">
    <ion-modal ref="modal" trigger="open-modal-calendar">
      <div class="modal-wrapper">
        <ion-datetime
            v-model="selectedDate"
            presentation="date"
            @ionChange="handleDateChange($event.detail.value)"
        >
          <div slot="buttons">
            <ion-button @click="isDatePickerOpen = false">{{ $t('cancel') }}</ion-button>
            <ion-button @click="confirmDate">{{ $t('accept') }}</ion-button>
          </div>
        </ion-datetime>
      </div>
    </ion-modal>
  </Teleport>
</template>
<script lang="ts" setup>
import {buildLocalDate} from "@/constants/utils.ts";
import {ref} from "vue";
import {IonButton, IonDatetime, IonModal} from "@ionic/vue";
import CircleLiturgicalColor from "@/components/atoms/CircleLiturgicalColor.vue";
import {LiturgicalColors} from "@/constants/types.ts";

const selectedDate = ref(new Date().toISOString());

const isDatePickerOpen = ref(false);
const modal = ref();

const handleDateChange = (value: any) => {
  console.log(value);
  selectedDate.value = value;
};

const confirmDate = () => {
  isDatePickerOpen.value = false;
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