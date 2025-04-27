<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('prayer_intentions_title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item class="" lines="none">
        <p>{{ $t('prayer_intentions_explanation_1') }}</p>
      </ion-item>
      <ion-item class="light-3" lines="none">
        <small>{{ $t('prayer_intentions_explanation_offline') }}</small>
      </ion-item>
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-input
                v-model="newIntention"
                :placeholder="$t('prayer_intentions_add_placeholder')"
                @keyup.enter="addIntention"
            ></ion-input>
          </ion-item>
          <ion-button color="primary" expand="block" @click="addIntention">
            {{ $t('prayer_intentions_add_button') }}
          </ion-button>
        </ion-card-content>
      </ion-card>
      <ion-list v-if="intentions.length > 0">
        <ion-item v-for="(intention, index) in intentions" :key="index">
          <ion-label>{{ intention }}</ion-label>
          <ion-button slot="end" color="danger" @click="deleteIntention(index)">
            <ion-icon :icon="trash"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
      <ion-text v-else class="no-intentions">
        <p>{{ $t('prayer_intentions_empty') }}</p>

      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import {trash} from 'ionicons/icons';
import {onMounted, ref} from 'vue';

// State for new intention input and list of intentions
const newIntention = ref<String>('');
const intentions = ref<String[]>([]);

// Load intentions from localStorage on component mount
onMounted(() => {
  const storedIntentions = localStorage.getItem('prayerIntentions');
  if (storedIntentions) {
    intentions.value = JSON.parse(storedIntentions);
  }
});

// Add a new intention
const addIntention = () => {
  if (newIntention.value.trim()) {
    intentions.value.push(newIntention.value?.trim());
    localStorage.setItem('prayerIntentions', JSON.stringify(intentions.value));
    newIntention.value = '';
  }
};

// Delete an intention
const deleteIntention = (index: any) => {
  intentions.value.splice(index, 1);
  localStorage.setItem('prayerIntentions', JSON.stringify(intentions.value));
};
</script>

<style scoped>
ion-card {
  margin: 16px;
}

ion-button {
  margin-top: 8px;
}

.no-intentions {
  display: flex;
  justify-content: center;
  padding: 16px;
  color: #666;
}

ion-list {
  margin: 0 16px;
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
}
</style>