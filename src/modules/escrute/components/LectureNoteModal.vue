<template>
  <BaseModal v-model="isOpen" :eyebrow="t('escrute.note_title')" :title="lecture ? formatPassage(lecture.passage, 'long') : ''">
    <template v-if="lecture">
      <p class="note-quote">{{ Object.values(getPassageVerses(lecture.passage))[0] }}</p>
      <textarea :aria-label="t('escrute.note_title')"
                :placeholder="t('escrute.note_placeholder')"
                :value="lecture.note"
                class="es-input note-input"
                @input="store.updateNote(escrute.id, lecture!.id, ($event.target as HTMLTextAreaElement).value)"></textarea>
      <p class="es-field-hint">{{ t('escrute.note_saved_hint') }}</p>
    </template>
    <template #footer>
      <button class="es-btn es-btn-quiet" type="button" @click="openOptions">{{ t('escrute.more_options') }}</button>
      <button class="es-btn es-btn-primary" type="button" @click="lectureId = undefined">{{ t('escrute.done') }}</button>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import BaseModal from "./BaseModal.vue";
import {formatPassage, getPassageVerses} from "../reference";
import {type Escrute, findLecture} from "../escrute";
import {useEscruteStore} from "../escruteStore";

/** Writes the reflection on a lecture without leaving the current page */
const props = defineProps<{ escrute: Escrute }>();

/** The lecture being edited, or undefined when closed */
const lectureId = defineModel<string>();

const {t} = useI18n();
const router = useRouter();
const store = useEscruteStore();

const lecture = computed(() => lectureId.value ? findLecture(props.escrute, lectureId.value) : undefined);
const isOpen = computed({
  get: () => !!lecture.value,
  set: value => !value && (lectureId.value = undefined),
});

// Jumping by typing a reference and deleting the lecture live on the lecture page
const openOptions = () => {
  const path = `/escrutes/${props.escrute.id}/${lectureId.value}`;
  lectureId.value = undefined;
  router.push(path);
};
</script>

<style scoped>
.note-quote {
  margin: 0 0 var(--space-3);
  padding-left: var(--space-3);
  border-left: 3px solid var(--rubric);
  color: var(--ink-soft);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-input {
  min-height: 9rem;
  font-size: 1.05rem;
  resize: vertical;
}
</style>
