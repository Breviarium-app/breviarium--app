<template>
  <Transition name="trail">
    <aside v-if="escrute"
           v-bind="$attrs"
           :aria-label="t('escrute.ongoing')"
           :class="['trail', {'tabbar-hidden': !tabbarVisible, collapsed}]">
      <header class="trail-header">
        <button :aria-expanded="!collapsed" class="trail-toggle" type="button" @click="collapsed = !collapsed">
          <ion-icon :icon="gitBranchOutline" aria-hidden="true" class="trail-icon"></ion-icon>
          <span class="trail-title">{{ escrute.title }}</span>
          <span class="trail-count">{{ escrute.lectures.length }}</span>
          <ion-icon :icon="chevronDownOutline" aria-hidden="true" class="trail-chevron"></ion-icon>
        </button>
        <router-link :aria-label="t('escrute.see_tree')" :to="`/escrutes/${escrute.id}`" class="trail-action">
          <ion-icon :icon="gitNetworkOutline" aria-hidden="true"></ion-icon>
        </router-link>
      </header>

      <template v-if="!collapsed">
        <ol ref="list" class="trail-list">
          <li v-for="(lecture, position) in store.trail.lectures"
              :key="lecture.id"
              :class="{current: position === store.trail.index, ahead: position > store.trail.index}"
              :style="{paddingInlineStart: `${Math.min(position, 5) * 0.55}rem`}">
            <button :aria-current="position === store.trail.index ? 'step' : undefined"
                    class="trail-step"
                    type="button"
                    @click="emit('select', lecture)">
              <span class="trail-label">{{ formatPassage(lecture.passage) }}</span>
              <span class="trail-quote">{{ firstVerse(lecture) }}</span>
              <span v-if="lecture.note" class="trail-note">{{ lecture.note }}</span>
            </button>
            <button :aria-label="t(lecture.note ? 'escrute.note_edit' : 'escrute.note_add', {passage: formatPassage(lecture.passage)})"
                    :class="['trail-note-button', {filled: lecture.note}]"
                    type="button"
                    @click="editingId = lecture.id">
              <ion-icon :icon="createOutline" aria-hidden="true"></ion-icon>
            </button>
          </li>
        </ol>
        <p class="trail-hint">{{ t('escrute.trail_hint') }}</p>
        <button class="trail-finish" type="button" @click="finish">
          <ion-icon :icon="checkmarkOutline" aria-hidden="true"></ion-icon>
          {{ t('escrute.finish') }}
        </button>
      </template>
    </aside>
  </Transition>

  <LectureNoteModal v-if="escrute" v-model="editingId" :escrute="escrute"/>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, watch} from "vue";
import {IonIcon} from "@ionic/vue";
import {checkmarkOutline, chevronDownOutline, createOutline, gitBranchOutline, gitNetworkOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useTabbarVisibility} from "@/modules/app/composables/useTabbarVisibility";
import LectureNoteModal from "./LectureNoteModal.vue";
import {formatPassage, getPassageVerses} from "../reference";
import type {Lecture} from "../escrute";
import {useEscruteStore} from "../escruteStore";

// The page's slot="fixed" belongs on the panel, not on the modal next to it
defineOptions({inheritAttrs: false});

/** The path of the escrute being read in the Bible, floating over the chapter */
const emit = defineEmits<{ select: [lecture: Lecture] }>();

const {t} = useI18n();
const router = useRouter();
const store = useEscruteStore();
const tabbarVisible = useTabbarVisibility();
const escrute = computed(() => store.ongoingEscrute);
const collapsed = ref(false);
const list = ref<HTMLElement>();

/** Lecture whose reflection is being written, without leaving the chapter */
const editingId = ref<string>();

// Ends with a look at the whole escrute; coming from its tree just returns there, so going back does not bounce
const finish = () => {
  const path = `/escrutes/${escrute.value?.id}`;
  store.finish();
  if (router.options.history.state.back === path) router.back();
  else router.push(path);
};

const firstVerse = (lecture: Lecture) => Object.values(getPassageVerses(lecture.passage))[0] ?? '';

// Keep the current step in view when the trail grows or the reader steps back
watch(() => [store.trail.index, store.trail.lectures.length, collapsed.value], async () => {
  await nextTick();
  list.value?.querySelector('.current')?.scrollIntoView({block: 'nearest'});
});
</script>

<style scoped>
/* Floats on the right, right above the auto-scroll fab. The fab sits at its ion-fab margin
   (16px, 24px on wide screens) plus the 8px margin of ion-fab-button, and the button is 40px. */
.trail {
  --tabbar-top: calc(var(--ion-safe-area-bottom, 0px) + 69px);
  --fab-inset: 24px;
  position: fixed;
  z-index: 10;
  right: var(--fab-inset);
  bottom: calc(var(--tabbar-top) + var(--fab-inset) + 40px + 12px);
  width: min(16rem, calc(100vw - 2 * var(--fab-inset)));
  background: var(--paper-raised);
  color: var(--ink);
  border: 1px solid var(--rule);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  font-size: 0.85rem;
  transition: bottom 300ms var(--ease);
}

.trail.tabbar-hidden {
  --tabbar-top: calc(var(--ion-safe-area-bottom, 0px) + 19px);
}

.trail-header {
  display: flex;
  align-items: center;
}

button, .trail-action {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
}

.trail-toggle {
  border-radius: 0;
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-3);
  text-align: start;
}

.trail-icon {
  flex-shrink: 0;
  color: var(--rubric);
}

.trail-title {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trail-count {
  min-width: 1.3rem;
  padding: 0 0.35rem;
  border-radius: var(--radius-pill);
  background: var(--rubric-soft);
  color: var(--rubric);
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
}

.trail-chevron {
  flex-shrink: 0;
  margin-inline-start: auto;
  transition: transform 200ms var(--ease);
}

.collapsed .trail-chevron {
  transform: rotate(180deg);
}

.trail-action {
  display: flex;
  padding: var(--space-2) var(--space-3);
  color: var(--ink-soft);
}

.trail-action:hover {
  color: var(--rubric);
}

.trail-list {
  max-height: 13rem;
  margin: 0;
  padding: 0 var(--space-2);
  overflow-y: auto;
  list-style: none;
}

.trail-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-1);
}

.trail-step {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.3rem var(--space-2);
  border-radius: var(--radius-sm);
  border-inline-start: 2px solid rgba(var(--rubric-rgb), 0.35);
  text-align: start;
}

.current .trail-step {
  background: var(--rubric-soft);
  border-inline-start-color: var(--rubric);
}

.ahead {
  opacity: 0.55;
}

.trail-label {
  color: var(--rubric);
  font-weight: 600;
  white-space: nowrap;
}

.trail-quote {
  overflow: hidden;
  font-size: 0.8rem;
  color: var(--ink-soft);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trail-note {
  overflow: hidden;
  font-size: 0.75rem;
  font-style: italic;
  color: var(--ink-faint);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trail-note-button {
  flex-shrink: 0;
  display: flex;
  padding: 0.45rem;
  border-radius: var(--radius-sm);
  color: var(--ink-faint);
}

.trail-note-button:hover,
.trail-note-button.filled {
  color: var(--rubric);
}

.trail-hint {
  margin: var(--space-2) var(--space-3) 0;
  font-size: 0.75rem;
  color: var(--ink-faint);
}

.trail-finish {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: calc(100% - 2 * var(--space-2));
  margin: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  background: var(--paper-sunken);
  font-weight: 600;
  color: var(--ink);
}

.trail-finish:hover {
  color: var(--rubric);
}

.trail-enter-active,
.trail-leave-active {
  transition: opacity 200ms var(--ease), transform 250ms var(--ease);
}

.trail-enter-from,
.trail-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

@media (min-width: 768px) {
  .trail {
    --fab-inset: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .trail,
  .trail-enter-active,
  .trail-leave-active,
  .trail-chevron {
    transition: none;
  }
}
</style>
