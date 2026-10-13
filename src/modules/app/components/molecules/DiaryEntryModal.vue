<template>
  <ion-modal :is-open="isOpen" @didDismiss="emit('close')" @didPresent="focusTextarea">
    <div class="modal-header">
      <span class="modal-title">{{ entry ? $t('diary.edit_title') : $t('diary.new_title') }}</span>
      <ion-button class="close-button" fill="clear" @click="emit('close')">
        <ion-icon :icon="closeOutline"></ion-icon>
      </ion-button>
    </div>
    <div class="modal-content">
      <DiaryReferenceCard v-if="currentReference" :reference="currentReference" :link="false"/>
      <ion-textarea
          ref="textarea"
          v-model="text"
          :auto-grow="true"
          :placeholder="$t('diary.placeholder')"
          :rows="6"
          class="diary-textarea"
      />
      <div class="modal-actions">
        <ion-button v-if="entry" color="danger" fill="clear" @click="remove">
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          {{ $t('delete') }}
        </ion-button>
        <ion-button :disabled="!text.trim()" color="primary" @click="save">
          {{ $t('save') }}
        </ion-button>
      </div>
    </div>
  </ion-modal>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {alertController, IonButton, IonIcon, IonModal, IonTextarea} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import {closeOutline, trashOutline} from 'ionicons/icons';
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

const remove = async () => {
  const entry = props.entry;
  if (!entry) return;
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
  HapticsService.light();
  emit('close');
};
</script>

<style scoped>
ion-modal {
  --height: auto;
  --width: 90%;
  --max-width: 500px;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.diary-textarea {
  --background: var(--background-color-card);
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  border-radius: 8px;
  min-height: 160px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
