<template>
  <ion-modal :is-open="isOpen" @didDismiss="emit('close')" @didPresent="focusTextarea">
    <div class="modal-content">
      <h2 class="modal-title">{{ entry ? t('diary.edit_title') : t('diary.new_title') }}</h2>
      <DiaryReferenceCard v-if="currentReference" :link="false" :reference="currentReference"/>
      <div class="textarea-wrap">
        <ion-textarea
            ref="textarea"
            v-model="text"
            :aria-label="entry ? t('diary.edit_title') : t('diary.new_title')"
            :auto-grow="true"
            :placeholder="t('diary.placeholder')"
            :rows="5"
            class="diary-textarea"
        />
      </div>
      <div class="modal-actions">
        <button v-if="entry" :aria-label="t('delete')" class="delete-button btn" @click="remove">
          <ion-icon :icon="trashOutline" aria-hidden="true"/>
        </button>
        <button class="cancel-button btn" @click="emit('close')">{{ t('cancel') }}</button>
        <button :disabled="!text.trim()" class="save-button btn" @click="save">{{ t('save') }}</button>
      </div>
    </div>
  </ion-modal>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {alertController, IonIcon, IonModal, IonTextarea} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import {trashOutline} from 'ionicons/icons';
import {type DiaryEntry, type DiaryReference, useDiaryStore} from '@/modules/app/stores/diaryStore.ts';
import DiaryReferenceCard from '@/modules/app/components/molecules/DiaryReferenceCard.vue';
import HapticsService from '@/modules/app/services/HapticsService.ts';

const props = defineProps<{
  isOpen: boolean;
  entry?: DiaryEntry | null;
  reference?: DiaryReference | null;
}>();

const emit = defineEmits<{ close: [] }>();

const {t} = useI18n();
const store = useDiaryStore();
const text = ref('');
const textarea = ref();

const currentReference = computed(() => props.entry ? props.entry.reference : props.reference);

watch(() => props.isOpen, (open) => {
  if (open) text.value = props.entry?.text ?? '';
});

// Opens the keyboard straight away instead of needing a second tap on the field
const focusTextarea = () => {
  textarea.value?.$el.setFocus();
};

const save = async () => {
  if (!text.value.trim()) return;
  if (props.entry) {
    await store.updateEntry(props.entry.id, text.value);
  } else {
    await store.addEntry(text.value, props.reference ?? undefined);
  }
  HapticsService.light();
  emit('close');
};

// Deleting cannot be undone, so it asks first
const remove = async () => {
  const entry = props.entry;
  if (!entry) return;
  HapticsService.light();
  const alert = await alertController.create({
    header: t('diary.delete_confirm'),
    buttons: [
      {text: t('cancel'), role: 'cancel'},
      {text: t('delete'), role: 'destructive'},
    ],
  });
  await alert.present();
  const {role} = await alert.onDidDismiss();
  if (role !== 'destructive') return;
  await store.deleteEntry(entry.id);
  emit('close');
};
</script>

<style scoped>
ion-modal {
  --height: auto;
  --width: 90%;
  --max-width: 460px;
  --border-radius: 20px;
  --background: var(--ion-background-color);
  margin: auto;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.25rem;
}

.modal-title {
  margin: 0;
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

.diary-textarea {
  --background: transparent;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 14px;
  --padding-bottom: 14px;
  min-height: 140px;
  line-height: 1.5;
}

button {
  font-family: inherit;
  font-weight: 400;
  color: inherit;
  border: 0;
  -webkit-tap-highlight-color: transparent;
}

.modal-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.35rem;
}

.cancel-button,
.save-button {
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  font-size: 1rem;
  text-align: center;
}

.cancel-button {
  background: var(--background-color-card);
}

.save-button {
  color: #fff;
  background: var(--ion-color-primary);
}

.save-button:disabled {
  opacity: 0.4;
}

.delete-button {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  font-size: 1.15rem;
  background: var(--background-color-card);
  color: var(--ion-color-danger);
}

@media (prefers-reduced-motion: reduce) {
  .textarea-wrap {
    transition: none;
  }
}
</style>
