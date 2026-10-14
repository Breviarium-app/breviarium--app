<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('prayer_intentions_title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="intentions">
        <p class="intro">{{ t('prayer_intentions_explanation_1') }}</p>
        <p class="privacy">
          <ion-icon :icon="lockClosedOutline" aria-hidden="true"/>
          {{ t('prayer_intentions_explanation_offline') }}
        </p>

        <section v-if="intentions.length > 0">
          <h2 class="section-title">{{ t('prayer_intentions_list_title', {n: intentions.length}) }}</h2>
          <div class="intention-list">
            <div v-for="(intention, index) in intentions" :key="index" class="intention-row">
              <button :aria-label="t('prayer_intentions_edit_title')" class="intention-text btn"
                      @click="openModalForEdit(index, intention)">
                {{ intention }}
              </button>
              <button :aria-label="t('delete')" class="delete-button btn" @click="deleteIntention(index)">
                <ion-icon :icon="trashOutline" aria-hidden="true"/>
              </button>
            </div>
            <button class="add-row btn" @click="openModalForAdd">
              <ion-icon :icon="addOutline" aria-hidden="true"/>
              {{ t('prayer_intentions_add_button') }}
            </button>
          </div>
        </section>

        <section v-else class="empty-state">
          <ion-icon :icon="heartOutline" aria-hidden="true" class="empty-icon"/>
          <p class="empty-title">{{ t('prayer_intentions_empty') }}</p>
          <p class="empty-text">{{ t('prayer_intentions_empty_hint') }}</p>
          <button class="add-button btn" @click="openModalForAdd">
            <ion-icon :icon="addOutline" aria-hidden="true"/>
            {{ t('prayer_intentions_add_button') }}
          </button>
        </section>

        <SocialIcons/>
      </div>
    </ion-content>

    <ion-modal :is-open="isModalOpen" @didDismiss="closeModal" @didPresent="focusTextarea">
      <div class="modal-content">
        <h2 class="modal-title">{{ isEditing ? t('prayer_intentions_edit_title') : t('prayer_intentions_add_title') }}</h2>
        <div class="textarea-wrap">
          <ion-textarea
              ref="textareaRef"
              v-model="modalIntention"
              :aria-label="isEditing ? t('prayer_intentions_edit_title') : t('prayer_intentions_add_title')"
              :auto-grow="true"
              :placeholder="t('prayer_intentions_add_placeholder')"
              :rows="3"
              class="intention-textarea"
          />
        </div>
        <p class="textarea-hint">{{ t('prayer_intentions_modal_hint') }}</p>
        <div class="modal-actions">
          <button class="cancel-button btn" @click="closeModal">{{ t('cancel') }}</button>
          <button :disabled="!modalIntention.trim()" class="save-button btn" @click="saveIntention">
            {{ t('save') }}
          </button>
        </div>
      </div>
    </ion-modal>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  alertController,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {addOutline, heartOutline, lockClosedOutline, trashOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import {IntentionsStorageManager} from '@/modules/app/services/IntentionsStorageManager.ts';
import SocialIcons from "@/modules/app/components/molecules/SocialIcons.vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";

const {t} = useI18n();

// Initialize IntentionsStorageManager
const storageManager = new IntentionsStorageManager('prayerIntentions');

// State
const intentions = ref<string[]>([]);
const isModalOpen = ref(false);
const modalIntention = ref('');
const editingIndex = ref<number | null>(null);

const isEditing = computed(() => editingIndex.value !== null);

// Opens the keyboard straight away instead of needing a second tap on the field
const textareaRef = ref();
const focusTextarea = () => textareaRef.value?.$el.setFocus();

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

// Deleting cannot be undone, so it asks first
const deleteIntention = async (index: number) => {
  HapticsService.light();
  const alert = await alertController.create({
    header: t('prayer_intentions_delete_title'),
    message: intentions.value[index],
    buttons: [
      {text: t('cancel'), role: 'cancel'},
      {text: t('delete'), role: 'destructive'},
    ],
  });
  await alert.present();
  const {role} = await alert.onDidDismiss();
  if (role === 'destructive') {
    intentions.value = storageManager.deleteIntention(intentions.value, index);
  }
};
</script>

<style scoped>
.intentions {
  max-width: 560px;
  margin: 0 auto;
  /* Bottom padding keeps the last section clear of the floating tab bar */
  padding: 1rem 1rem 96px;
}

.intro {
  margin: 0.25rem 0.25rem 0.75rem;
  line-height: 1.5;
}

.privacy {
  display: flex;
  gap: 0.5rem;
  margin: 0 0.25rem 1.75rem;
  font-size: 0.85rem;
  line-height: 1.45;
  opacity: 0.65;
}

.privacy ion-icon {
  flex-shrink: 0;
  margin-top: 0.15rem;
}

.section-title {
  margin: 0 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}

button {
  font-family: inherit;
  font-weight: 400;
  color: inherit;
  text-align: left;
  border: 0;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
}

.intention-list {
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-color-card);
}

.intention-row {
  display: flex;
  align-items: center;
  border-bottom: 0.5px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
}

.intention-text {
  flex: 1;
  min-width: 0;
  padding: 0.85rem 0.5rem 0.85rem 1rem;
  font-size: 1rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.delete-button {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-right: 0.25rem;
  padding: 0;
  border-radius: 50%;
  font-size: 1.15rem;
  opacity: 0.5;
}

.delete-button:hover,
.delete-button:focus-visible {
  opacity: 1;
  color: var(--ion-color-danger);
}

.add-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.85rem 1rem;
  color: var(--ion-color-primary);
}

.add-row ion-icon {
  font-size: 1.25rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  border-radius: 18px;
  text-align: center;
  background: var(--background-color-card);
}

.empty-icon {
  font-size: 2rem;
  color: var(--ion-color-primary);
}

.empty-title {
  margin: 0.75rem 0 0.25rem;
  font-size: 1.1rem;
}

.empty-text {
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
  line-height: 1.45;
  opacity: 0.65;
}

.add-button,
.save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.4rem;
  border-radius: 999px;
  font-size: 1rem;
  color: #fff;
  background: var(--ion-color-primary);
}

.save-button:disabled {
  opacity: 0.4;
}

ion-modal {
  --height: auto;
  --width: 90%;
  --max-width: 420px;
  --border-radius: 20px;
  --background: var(--ion-background-color);
  margin: auto;
}

.modal-content {
  padding: 1.25rem;
}

.modal-title {
  margin: 0 0 1rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--ion-color-primary);
}

/* Wrapper draws the rounded field and focus ring, which ion-textarea does not clip itself */
.textarea-wrap {
  border-radius: 14px;
  overflow: hidden;
  background: var(--background-color-card);
  box-shadow: inset 0 0 0 1.5px transparent;
  transition: box-shadow 0.15s ease;
}

.textarea-wrap:focus-within {
  box-shadow: inset 0 0 0 1.5px var(--ion-color-primary);
}

.intention-textarea {
  --background: transparent;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 14px;
  --padding-bottom: 14px;
  min-height: 110px;
  line-height: 1.45;
}

.textarea-hint {
  margin: 0.5rem 0.25rem 0;
  font-size: 0.8rem;
  opacity: 0.6;
}

.modal-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.25rem;
}

.cancel-button,
.modal-actions .save-button {
  flex: 1;
  justify-content: center;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  font-size: 1rem;
  text-align: center;
}

.cancel-button {
  background: var(--background-color-card);
}

@media (prefers-reduced-motion: reduce) {
  .textarea-wrap {
    transition: none;
  }
}
</style>
