<script lang="ts" setup>
import {ref} from 'vue';
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {format} from 'date-fns';

const selectedDate = ref(new Date().toISOString());
const isDatePickerOpen = ref(false);
const saintOfDay = ref('');
const modal = ref();

const prayerTypes = [
  {id: 'evangelium', title: 'Evangelium'},
  {id: 'laudes', title: 'Laudes'},
  {id: 'vesperae', title: 'Vesperae'},
  {id: 'officium', title: 'Officium'},
  {id: 'tertia', title: 'Tertia'},
  {id: 'sexta', title: 'Sexta'},
  {id: 'nona', title: 'Nona'},
  {id: 'completorium', title: 'Completorium'},
  {id: 'lectiones', title: 'Lectiones'}
];

const saints = [
  'Saint Francis of Assisi',
  'Saint Teresa of Ávila',
  'Saint Augustine of Hippo',
  'Saint Thomas Aquinas',
  'Saint Catherine of Siena',
  'Saint Ignatius of Loyola',
  'Saint Benedict of Nursia',
  'Saint Thérèse of Lisieux',
  'Saint Patrick',
  'Saint Joan of Arc'
];

const updateSaintOfDay = () => {
  const randomIndex = Math.floor(Math.random() * saints.length);
  saintOfDay.value = saints[randomIndex];
};

const handleDateChange = (value: any) => {
  console.log(value);
  selectedDate.value = value;
  updateSaintOfDay();
};

const confirmDate = () => {
  isDatePickerOpen.value = false;
};

// Set initial saint
updateSaintOfDay();
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
        <div class="saint-day">{{ saintOfDay }}</div>
      </div>

      <div class="prayer-grid">
        <ion-item v-for="prayer in prayerTypes" :key="prayer.id" :router-link="'/prayer/' + prayer.id"
                  class="prayer-item">
          <ion-label>{{ prayer.title }}</ion-label>
        </ion-item>
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

.saint-day {
  color: var(--ion-color-danger);
  font-size: 0.9em;
  margin-top: 0.5rem;
}

.prayer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 16px;
}

.prayer-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --border-radius: 8px;
  --background: var(--ion-color-light);
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

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>