<template>
  <BaseModal v-model="open" :eyebrow="t('escrute.new')" :title="t('escrute.start_question')">
    <div class="es-field">
      <label :for="titleId" class="es-field-label">{{ t('escrute.title_label') }} <span class="optional">{{ t('escrute.optional') }}</span></label>
      <input :id="titleId"
             v-model="title"
             :placeholder="passage ? formatPassage(passage, 'long') : ''"
             class="es-input"
             type="text"
             @keydown.enter="start">
    </div>
    <PassageInput v-model="passage" :initial="initial" :label="t('escrute.start_passage')" @submit="start"/>
    <p v-if="hint" class="es-field-hint">{{ hint }}</p>
    <template #footer>
      <button class="es-btn es-btn-quiet" type="button" @click="open = false">{{ t('cancel') }}</button>
      <button :disabled="!passage" class="es-btn es-btn-primary" type="button" @click="start">{{ t('escrute.start') }}</button>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import {ref, useId, watch} from "vue";
import {useI18n} from "vue-i18n";
import BaseModal from "./BaseModal.vue";
import PassageInput from "./PassageInput.vue";
import {formatPassage, type Passage} from "../reference";

defineProps<{
  /** Reference the field starts with; it can be widened to more verses before starting */
  initial?: string;
  hint?: string;
}>();
const emit = defineEmits<{ start: [title: string, passage: Passage] }>();

const open = defineModel<boolean>({required: true});
const {t} = useI18n();
const titleId = useId();

const passage = ref<Passage>();
const title = ref('');

// Every opening starts clean
watch(open, () => {
  passage.value = undefined;
  title.value = '';
});

function start() {
  if (!passage.value) return;
  emit('start', title.value.trim() || formatPassage(passage.value, 'long'), passage.value);
  open.value = false;
}
</script>

<style scoped>
.optional {
  font-weight: 400;
  color: var(--ink-faint);
}
</style>
