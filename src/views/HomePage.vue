<script lang="ts" setup>
import {ref} from 'vue';
import {
  IonButton,
  IonCol,
  IonContent,
  IonDatetime,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useBackButton,
  useIonRouter
} from '@ionic/vue';
import {format} from 'date-fns';
import {App} from '@capacitor/app';
import SaintBanner from "@/components/molecules/SaintBanner.vue";
import {currentLiturgyHour} from "@/services/utils/utils.ts";

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

const ionRouter = useIonRouter();
useBackButton(-1, () => {
  if (!ionRouter.canGoBack()) {
    App.exitApp();
  }
});


</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Breviarium</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="date-section ion-padding">
        <div id="open-modal-calendar" class="date-button">
          {{ format(new Date(selectedDate), 'MMMM d, yyyy') }}
        </div>
        <SaintBanner/>
      </div>

      <div class="prayer-grid">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item class="prayer-item" router-link="/prayer/evangelium-and-lectiones">
                <ion-label>Evangelio y lecturas</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Laudes' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/laudes">
                <ion-label>Laudes</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Vesperae' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/vesperae">
                <ion-label>Vísperas</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item class="prayer-item" router-link="/prayer/officium">
                <ion-label>Oficio</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Tercia' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/tertia">
                <ion-label>Tercia</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Sexta' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/sexta">
                <ion-label>Sexta</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Nona' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/nona">
                <ion-label>Nona</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Completorium' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/completorium">
                <ion-label>Completas</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <ion-modal ref="modal" class="date-picker-modal" trigger="open-modal-calendar">
        <ion-datetime
            v-model="selectedDate"
            presentation="date"
            @ionChange="handleDateChange($event.detail.value)"
        >
          <div slot="buttons">
            <ion-button @click="isDatePickerOpen = false">Cancel</ion-button>
            <ion-button @click="confirmDate">Confirm</ion-button>
          </div>
        </ion-datetime>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.date-section {
  text-align: center;
  margin-bottom: 1rem;
}

.date-button {
  font-size: 1.2em;
  padding: 8px;
  cursor: pointer;
}

.prayer-grid {
  padding: 6px;
}

.prayer-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --border-radius: 8px;
  --background: var(--background-color-card);
  border: 0 solid var(--border-color);
}

.date-picker-modal {
  --height: auto;
  --width: 90%;
  --border-radius: 16px;
}

/* Add animation for page transitions */
:deep(.ion-page) {
  animation: slideIn 0.3s ease-out;
}

.selected_hour {
  font-weight: bold;
  box-shadow: 1px 1px 5px var(--breviarium-primary);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>