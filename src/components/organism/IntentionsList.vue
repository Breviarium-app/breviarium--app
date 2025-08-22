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
          <ion-label v-if="editingIndex == null || editingIndex !== index">{{ intention }}</ion-label>
          <ion-textarea
              v-else
              v-model="editedIntention"
              @keyup.enter="updateIntention(index)"
          ></ion-textarea>
          <ion-button
              v-if="editingIndex == null || editingIndex !== index"
              slot="end"
              color="warning"
              @click="startEditing(index, intention)"
          >
            <ion-icon :icon="pencil"></ion-icon>
          </ion-button>
          <ion-button
              v-else
              slot="end"
              color="success"
              @click="updateIntention(index)"
          >
            <ion-icon :icon="checkmark"></ion-icon>
          </ion-button>
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
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {checkmark, pencil, trash} from 'ionicons/icons';
import {onMounted, ref} from 'vue';
import {IntentionsStorageManager} from '@/services/IntentionsStorageManager.ts'; // Adjust the path as needed

// Initialize IntentionsStorageManager
const storageManager = new IntentionsStorageManager('prayerIntentions');

// State for new intention input, list of intentions, and editing
const newIntention = ref<string>('');
const intentions = ref<string[]>([]);
const editingIndex = ref<number | null>(null);
const editedIntention = ref<string>('');

// Load intentions from localStorage on component mount
onMounted(() => {
  intentions.value = storageManager.loadIntentions();
});

// Add a new intention
const addIntention = () => {
  intentions.value = storageManager.addIntention(intentions.value, newIntention.value);
  newIntention.value = '';
};

// Delete an intention
const deleteIntention = (index: number) => {
  intentions.value = storageManager.deleteIntention(intentions.value, index);
};

// Start editing an intention
const startEditing = (index: number, intention: string) => {
  editingIndex.value = index;
  editedIntention.value = intention;
  // TODO: focus textarea
};

// Update an intention
const updateIntention = (index: number) => {
  intentions.value = storageManager.updateIntention(intentions.value, index, editedIntention.value);
  editingIndex.value = null;
  editedIntention.value = '';
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