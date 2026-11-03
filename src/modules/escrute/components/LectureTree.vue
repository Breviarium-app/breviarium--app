<template>
  <li class="node">
    <div class="node-row">
    <button class="node-link" type="button" @click="emit('select', lecture.id)">
      <span class="node-heading">
        <span class="reference">{{ formatPassage(lecture.passage, 'long') }}</span>
      </span>
      <span v-if="lecture.note" class="note">{{ lecture.note }}</span>
    </button>
    <button :aria-label="t(lecture.note ? 'escrute.note_edit' : 'escrute.note_add', {passage: formatPassage(lecture.passage)})"
            class="node-edit"
            type="button"
            @click="emit('edit', lecture.id)">
      <ion-icon :icon="createOutline" aria-hidden="true"></ion-icon>
    </button>
    </div>

    <ul v-if="children.length" class="branches">
      <LectureTree v-for="child in children" :key="child.id" :escrute="escrute" :lecture="child" @edit="id => emit('edit', id)" @select="id => emit('select', id)"/>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {IonIcon} from "@ionic/vue";
import {createOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import {formatPassage} from "../reference";
import {childrenOf, type Escrute, type Lecture} from "../escrute";

const props = defineProps<{ escrute: Escrute, lecture: Lecture }>();
const emit = defineEmits<{ select: [lectureId: string], edit: [lectureId: string] }>();
const {t} = useI18n();

const children = computed(() => childrenOf(props.escrute, props.lecture.id));
</script>

<style scoped>
.node {
  position: relative;
  list-style: none;
}

.node-row {
  display: flex;
  align-items: flex-start;
}

.node-edit {
  flex-shrink: 0;
  display: flex;
  padding: 0.65rem;
  font-size: 1.05rem;
  color: var(--ink-faint);
  background: none;
  border: none;
  cursor: pointer;
}

.node-link {
  flex: 1;
  min-width: 0;
  font: inherit;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-2) var(--space-3);
  margin-left: calc(-1 * var(--space-3));
  border-radius: var(--radius-md);
  color: var(--ink);
  transition: background-color 150ms var(--ease);
}

.node-link:hover {
  background: var(--paper-sunken);
  text-decoration: none;
}

.node-heading {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.reference {
  font-size: 1.12rem;
  font-weight: 600;
}

.note {
  font-size: 0.88rem;
  color: var(--ink-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* Tree lines: a vertical rule per level and a short horizontal tick into each branch */
.branches {
  margin: 0 0 0 0.45rem;
  padding: 0 0 0 1.4rem;
  border-left: 1px solid var(--rule-strong);
}

.branches > .node::before {
  content: '';
  position: absolute;
  left: -1.4rem;
  top: 1.25rem;
  width: 1rem;
  border-top: 1px solid var(--rule-strong);
}

.branches > .node:last-child::after {
  /* Stop the vertical rule at the last branch */
  content: '';
  position: absolute;
  left: calc(-1.4rem - 1px);
  top: calc(1.25rem + 1px);
  bottom: 0;
  border-left: 1px solid var(--paper);
}
</style>
