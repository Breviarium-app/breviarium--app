<template>
  <div class="es-field">
    <label :for="inputId" class="es-field-label">{{ label }}</label>
    <input :id="inputId"
           v-model="text"
           :placeholder="placeholder"
           autocapitalize="off"
           autocomplete="off"
           class="es-input"
           enterkeyhint="done"
           spellcheck="false"
           type="text"
           @keydown.enter="passage && emit('submit')">

    <div v-if="passage" class="preview">
      <p class="preview-title">{{ formatPassage(passage, 'long') }}</p>
      <p class="preview-text">
        <template v-for="[number, verse] in previewVerses.slice(0, PREVIEW_VERSES)" :key="number">
          <sup>{{ number }}</sup>{{ verse }}
        </template>
        <span v-if="previewVerses.length > PREVIEW_VERSES" class="preview-more">
          {{ t('escrute.more_verses', {n: previewVerses.length - PREVIEW_VERSES}) }}
        </span>
      </p>
    </div>
    <p v-else-if="text.trim()" class="es-field-hint">{{ t('escrute.passage_unknown') }}</p>
    <p v-else class="es-field-hint">{{ t('escrute.passage_hint') }}</p>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, useId, watch} from "vue";
import {useI18n} from "vue-i18n";
import {formatPassage, getPassageVerses, type Passage, parsePassage} from "../reference";

const props = withDefaults(defineProps<{
  label: string,
  placeholder?: string,
  /** Reference the field starts with, e.g. the verse tapped in the Bible */
  initial?: string,
}>(), {
  placeholder: 'Mt 1,1-5',
});
const emit = defineEmits<{ submit: [] }>();
const {t} = useI18n();

/** The parsed passage, or undefined while the text is not a valid reference */
const passage = defineModel<Passage | undefined>();

const PREVIEW_VERSES = 2;
const inputId = useId();
const text = ref(props.initial ?? '');

watch(text, value => passage.value = parsePassage(value), {immediate: true});
// Clearing the model from outside (e.g. after adding a lecture) clears the field
watch(passage, value => {
  if (!value) text.value = parsePassage(text.value) ? '' : text.value;
});

const previewVerses = computed(() => passage.value ? Object.entries(getPassageVerses(passage.value)) : []);
</script>

<style scoped>
.preview {
  padding: var(--space-3) var(--space-4);
  background: var(--paper-sunken);
  border-left: 3px solid var(--rubric);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.preview-title {
  margin: 0 0 var(--space-1);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--rubric);
}

.preview-text {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--ink-soft);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

sup {
  font-size: 0.65em;
  font-weight: 600;
  color: var(--rubric);
  margin: 0 0.2em 0 0.3em;
}

.preview-more {
  font-size: 0.8rem;
  color: var(--ink-faint);
}
</style>
