<template>
  <div :style="readingStyle" class="scripture">
    <p v-for="(verse, number) in verses"
       :key="number"
       :class="['verse', {highlight: number === highlight}]"
       @click="emit('select', String(number))">
      <span class="verse-number">{{ number }}</span>
      <span class="verse-text">{{ verse }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";

defineProps<{
  verses?: Record<string, string>;
  highlight?: string;
}>();

const emit = defineEmits<{ select: [verse: string] }>();
const settingsStore = useSettingsStore();

const readingStyle = computed(() => ({fontSize: `${settingsStore.settings.fontSize * 1.2}px`}));
</script>

<style scoped>
.scripture {
  line-height: 1.7;
  color: var(--ink);
}

.verse {
  display: grid;
  grid-template-columns: 2rem 1fr;
  margin: 0;
  padding: 0.15em 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 300ms var(--ease);
}

.verse-number {
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 2.9;
  color: var(--rubric);
  font-variant-numeric: tabular-nums;
}

.verse:hover:not(.highlight) {
  background: var(--paper-sunken);
  box-shadow: -0.5rem 0 0 var(--paper-sunken), 0.5rem 0 0 var(--paper-sunken);
}

.verse.highlight {
  background: var(--highlight);
  box-shadow: -0.5rem 0 0 var(--highlight), 0.5rem 0 0 var(--highlight);
}
</style>
