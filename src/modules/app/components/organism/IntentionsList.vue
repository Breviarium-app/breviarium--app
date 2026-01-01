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
          <ion-button color="primary" expand="block" @click="openModalForAdd">
            <ion-icon :icon="addOutline" slot="start"></ion-icon>
            {{ $t('prayer_intentions_add_button') }}
          </ion-button>
        </ion-card-content>
      </ion-card>
      <ion-list v-if="intentions.length > 0">
        <ion-item v-for="(intention, index) in intentions" :key="index">
          <ion-label class="ion-text-wrap">{{ intention }}</ion-label>
          <ion-button slot="end" fill="clear" @click="openModalForEdit(index, intention)">
            <ion-icon :icon="pencil"></ion-icon>
          </ion-button>
          <ion-button slot="end" fill="clear" color="danger" @click="deleteIntention(index)">
            <ion-icon :icon="trash"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
      <ion-text v-else class="no-intentions">
        <p>{{ $t('prayer_intentions_empty') }}</p>
      </ion-text>
      <SocialIcons/>
    </ion-content>

    <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
      <div class="modal-header">
        <span class="modal-title">{{ isEditing ? $t('prayer_intentions_edit_title') : $t('prayer_intentions_add_title') }}</span>
        <ion-button fill="clear" class="close-button" @click="closeModal">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </div>
      <div class="modal-content">
        <ion-textarea
            v-model="modalIntention"
            :placeholder="$t('prayer_intentions_add_placeholder')"
            :auto-grow="true"
            :rows="4"
            class="intention-textarea"
        />
        <div class="modal-actions">
          <ion-button color="primary" @click="saveIntention" :disabled="!modalIntention.trim()">
            {{ $t('save') }}
          </ion-button>
        </div>
      </div>
    </ion-modal>
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
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {addOutline, closeOutline, pencil, trash} from 'ionicons/icons';
import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import {IntentionsStorageManager} from '@/modules/app/services/IntentionsStorageManager.ts';
import SocialIcons from "@/modules/app/components/molecules/SocialIcons.vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";

// Initialize IntentionsStorageManager
const storageManager = new IntentionsStorageManager('prayerIntentions');

// State
const intentions = ref<string[]>([]);
const isModalOpen = ref(false);
const modalIntention = ref('');
const editingIndex = ref<number | null>(null);

const isEditing = computed(() => editingIndex.value !== null);

onMounted(() => {
  intentions.value = storageManager.loadIntentions();
});

onBeforeUnmount(() => {
  if (isModalOpen.value) {
    isModalOpen.value = false;
  }
});

const openModalForAdd = () => {
  modalIntention.value = '';
  editingIndex.value = null;
  isModalOpen.value = true;
  HapticsService.light();
};

const openModalForEdit = (index: number, intention: string) => {
  modalIntention.value = intention;
  editingIndex.value = index;
  isModalOpen.value = true;
  HapticsService.light();
};

const saveIntention = () => {
  if (!modalIntention.value.trim()) return;

  if (isEditing.value && editingIndex.value !== null) {
    intentions.value = storageManager.updateIntention(intentions.value, editingIndex.value, modalIntention.value);
  } else {
    intentions.value = storageManager.addIntention(intentions.value, modalIntention.value);
  }

  closeModal();
  HapticsService.light();
};

const closeModal = () => {
  isModalOpen.value = false;
  modalIntention.value = '';
  editingIndex.value = null;
};

const deleteIntention = (index: number) => {
  intentions.value = storageManager.deleteIntention(intentions.value, index);
  HapticsService.light();
};
</script>

<style scoped>
ion-card {
  margin: 16px;
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

ion-modal {
  --height: auto;
  --width: 90%;
  --max-width: 400px;
  --border-radius: 16px;
  --background: var(--ion-background-color);
  margin: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 16px 16px 0 16px;
}

.modal-title {
  font-size: 1.1em;
  font-weight: 600;
  color: var(--breviarium-primary);
}

.close-button {
  position: absolute;
  right: 8px;
  top: 70%;
  transform: translateY(-50%);
  --padding-start: 8px;
  --padding-end: 8px;
  margin: 0;
}

.modal-content {
  padding: 16px;
}

.intention-textarea {
  --background: var(--background-color-card);
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  border-radius: 8px;
  min-height: 120px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
