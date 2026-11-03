<template>
  <div ref="scroller" class="graph-scroller">
    <div :style="{width: rem(width), height: rem(height)}" class="graph">
      <svg :viewBox="`0 0 ${width} ${height}`" aria-hidden="true" class="connectors">
        <path v-for="edge in layout.edges" :key="edge.to.lecture.id" :d="connector(edge)"/>
      </svg>

      <ol class="leaves">
        <li v-for="node in layout.nodes" :key="node.lecture.id"
            :style="{left: rem(left(node)), top: rem(top(node))}"
            class="leaf-slot">
          <button :class="['leaf', {start: !node.lecture.parentId}]" type="button" @click="emit('select', node.lecture.id)">
            <span v-if="!node.lecture.parentId" class="start-label">{{ t('escrute.start_label') }}</span>
            <span :title="formatPassage(node.lecture.passage, 'long')" class="reference">
              {{ formatPassage(node.lecture.passage, 'long') }}
            </span>
            <span v-if="node.lecture.note" class="note">{{ node.lecture.note }}</span>
            <span v-else class="note empty">{{ t('escrute.no_notes') }}</span>
          </button>
          <button :aria-label="t(node.lecture.note ? 'escrute.note_edit' : 'escrute.note_add', {passage: formatPassage(node.lecture.passage)})"
                  class="edit"
                  type="button"
                  @click="emit('edit', node.lecture.id)">
            <ion-icon :icon="createOutline" aria-hidden="true"></ion-icon>
          </button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {IonIcon} from "@ionic/vue";
import {createOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import {formatPassage} from "../reference";
import {type Escrute, layoutTree, type TreeLayout, type TreeNode} from "../escrute";

const props = defineProps<{ escrute: Escrute }>();
const emit = defineEmits<{ select: [lectureId: string], edit: [lectureId: string] }>();
const {t} = useI18n();

// Sizes in rem, so the drawing follows the user's font size
const LEAF_WIDTH = 13;
const LEAF_HEIGHT = 8.25;
const GAP_X = 1.25;
const GAP_Y = 3.25;

const layout = computed(() => layoutTree(props.escrute));
const width = computed(() => Math.max(layout.value.columns * (LEAF_WIDTH + GAP_X) - GAP_X, 0));
const height = computed(() => Math.max(layout.value.rows * (LEAF_HEIGHT + GAP_Y) - GAP_Y, 0));

const rem = (value: number) => `${value}rem`;
const left = (node: TreeNode) => node.column * (LEAF_WIDTH + GAP_X);
const top = (node: TreeNode) => node.depth * (LEAF_HEIGHT + GAP_Y);

/** Drops from the bottom of the previous lecture, curves across and lands straight on top of the next one */
function connector({from, to}: TreeLayout['edges'][number]): string {
  const x1 = left(from) + LEAF_WIDTH / 2;
  const y1 = top(from) + LEAF_HEIGHT;
  const x2 = left(to) + LEAF_WIDTH / 2;
  const y2 = top(to);
  const bend = y1 + 0.5;
  const landing = y2 - 1.5;
  const middle = (bend + landing) / 2;
  return `M${x1} ${y1} V${bend} C${x1} ${middle} ${x2} ${middle} ${x2} ${landing} V${y2}`;
}

// When the tree is wider than the screen, open it centred on the starting lecture
const scroller = ref<HTMLElement>();
// Ionic mounts the page before laying it out, so wait until the scroller has a size
const sized = new ResizeObserver(() => {
  const start = scroller.value?.querySelector('.start');
  if (!scroller.value?.clientWidth || !start) return;
  sized.disconnect();
  const view = scroller.value.getBoundingClientRect();
  const leaf = start.getBoundingClientRect();
  scroller.value.scrollLeft += (leaf.left + leaf.width / 2) - (view.left + view.width / 2);
});
onMounted(() => scroller.value && sized.observe(scroller.value));
onBeforeUnmount(() => sized.disconnect());

const leafWidth = rem(LEAF_WIDTH);
const leafHeight = rem(LEAF_HEIGHT);
</script>

<style scoped>
/* Breaks out of the reading column so wide trees can use the whole screen, and scrolls when they still don't fit */
.graph-scroller {
  margin-inline: calc(50% - 50vw);
  padding: var(--space-5) var(--space-4) var(--space-4);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.graph {
  position: relative;
  margin-inline: auto;
}

.connectors {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.connectors path {
  fill: none;
  stroke: var(--rule-strong);
  stroke-width: 1.5;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.leaves {
  margin: 0;
  padding: 0;
  list-style: none;
}

.leaf-slot {
  position: absolute;
  width: v-bind(leafWidth);
  height: v-bind(leafHeight);
}

.leaf {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
  height: 100%;
  padding: var(--space-3);
  font: inherit;
  text-align: left;
  cursor: pointer;
  color: var(--ink);
  background: var(--paper-raised);
  border: 1px solid var(--rule);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: border-color 150ms var(--ease), box-shadow 150ms var(--ease), transform 150ms var(--ease);
}

.leaf:hover {
  border-color: var(--rule-strong);
  box-shadow: var(--shadow-md);
}

.leaf:active {
  transform: scale(0.98);
}

.leaf.start {
  border-top: 3px solid var(--rubric);
}

/* Just above the first leaf */
.start-label {
  position: absolute;
  bottom: calc(100% + 0.25rem);
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--rubric);
}

.edit {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  display: flex;
  padding: 0.55rem;
  font-size: 1.05rem;
  color: var(--ink-faint);
  background: none;
  border: none;
  cursor: pointer;
}

.reference {
  /* Leaves room for the edit button */
  padding-right: 1.5rem;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
  font-size: 0.84rem;
  line-height: 1.45;
  color: var(--ink-soft);
  white-space: pre-line;
}

.note.empty {
  font-style: italic;
  color: var(--ink-faint);
}

@media (prefers-reduced-motion: reduce) {
  .leaf {
    transition: none;
  }

  .leaf:active {
    transform: none;
  }
}
</style>
