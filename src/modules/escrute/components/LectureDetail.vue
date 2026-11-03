<template>
  <div v-if="lecture">
    <blockquote v-if="origin" class="origin">
      <span class="origin-label">{{ t('escrute.origin_from', {reference: origin.reference}) }}</span>
      {{ origin.text }}
    </blockquote>

    <ScriptureText :highlight="fromVerse"
                   :verses="verses"
                   @select="verse => fromVerse = fromVerse === verse ? '' : verse"/>

    <section class="section">
      <h2 class="section-title">{{ t('escrute.notes_title') }}</h2>
      <textarea :aria-label="t('escrute.notes_title')"
                :placeholder="t('escrute.note_placeholder')"
                :value="lecture.note"
                class="es-input note"
                @input="store.updateNote(escrute.id, lectureId, ($event.target as HTMLTextAreaElement).value)"></textarea>
      <p class="es-field-hint">{{ t('escrute.note_device_hint') }}</p>
    </section>

    <section v-if="children.length" class="section">
      <h2 class="section-title">{{ t('escrute.jumps_title') }}</h2>
      <ul class="jumps">
        <li v-for="child in children" :key="child.id">
          <button class="jump" type="button" @click="emit('open', child.id)">
            <span class="jump-heading">
              <span v-if="child.fromVerse" class="jump-from">{{ t('escrute.verse_short', {n: child.fromVerse}) }}</span>
              <ion-icon :icon="returnDownForwardOutline" aria-hidden="true" class="jump-icon"></ion-icon>
              {{ formatPassage(child.passage, 'long') }}
            </span>
            <span v-if="child.note" class="jump-note">{{ child.note }}</span>
          </button>
        </li>
      </ul>
    </section>

    <section class="section">
      <h2 class="section-title">{{ t('escrute.jump_title') }}</h2>
      <p v-if="fromVerse" class="from-chip">
        {{ t('escrute.from_verse', {n: fromVerse}) }}
        <button :aria-label="t('escrute.from_verse_clear')" class="from-chip-clear" type="button" @click="fromVerse = ''">
          <ion-icon :icon="closeOutline" aria-hidden="true"></ion-icon>
        </button>
      </p>
      <p v-else class="es-field-hint hint">{{ t('escrute.jump_hint') }}</p>

      <PassageInput v-model="nextPassage" :label="t('escrute.jump_passage')" placeholder="Is 7,14" @submit="jump"/>
      <button :disabled="!nextPassage" class="es-btn es-btn-primary" type="button" @click="jump">
        <ion-icon :icon="returnDownForwardOutline" aria-hidden="true"></ion-icon>
        {{ t('escrute.jump') }}
      </button>
    </section>

    <div v-if="lecture.parentId" class="danger-zone">
      <button class="es-btn es-btn-quiet" type="button" @click="remove">
        <ion-icon :icon="trashOutline" aria-hidden="true"></ion-icon>
        {{ t('escrute.lecture_delete') }}
      </button>
    </div>
  </div>
  <p v-else class="not-found">{{ t('escrute.lecture_missing') }}</p>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {alertController, IonIcon} from "@ionic/vue";
import {closeOutline, returnDownForwardOutline, trashOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import ScriptureText from "./ScriptureText.vue";
import PassageInput from "./PassageInput.vue";
import {formatPassage, getPassageVerses, getVerseText, type Passage} from "../reference";
import {childrenOf, type Escrute, findLecture, pathTo, subtreeIds} from "../escrute";
import {useEscruteStore} from "../escruteStore";

/** Everything about one lecture of an escrute: its text, reflections and jumps. Moving to another lecture is left to the parent. */
const props = defineProps<{ escrute: Escrute, lectureId: string }>();
const emit = defineEmits<{
  /** Show another lecture: a jump from this one, or one just created */
  open: [lectureId: string];
  /** This lecture was deleted; show the one it jumped from */
  removed: [parentId: string];
}>();
const store = useEscruteStore();
const {t} = useI18n();

const lecture = computed(() => findLecture(props.escrute, props.lectureId));
const path = computed(() => pathTo(props.escrute, props.lectureId));
const children = computed(() => childrenOf(props.escrute, props.lectureId));
const verses = computed(() => lecture.value ? getPassageVerses(lecture.value.passage) : {});

/** The verse of the previous lecture this one jumped from */
const origin = computed(() => {
  const parent = path.value[path.value.length - 2];
  const verse = lecture.value?.fromVerse;
  if (!parent || !verse) return undefined;
  const {book, chapter} = parent.passage;
  return {
    reference: formatPassage({book, chapter, from: Number(verse)}),
    text: getVerseText(book, chapter, verse),
  };
});

const fromVerse = ref('');
const nextPassage = ref<Passage>();

// Moving to another lecture starts with a clean jump form
watch(() => props.lectureId, () => {
  fromVerse.value = '';
  nextPassage.value = undefined;
});

function jump() {
  if (!nextPassage.value) return;
  const child = store.addLecture(props.escrute.id, props.lectureId, nextPassage.value, fromVerse.value || undefined);
  nextPassage.value = undefined;
  fromVerse.value = '';
  if (child) emit('open', child.id);
}

async function remove() {
  if (!lecture.value?.parentId) return;
  const parentId = lecture.value.parentId;
  const jumps = subtreeIds(props.escrute, props.lectureId).size - 1;
  const alert = await alertController.create({
    header: t('escrute.lecture_delete_title'),
    message: jumps ? t('escrute.lecture_delete_jumps', {n: jumps}, jumps) : t('escrute.lecture_delete_message'),
    buttons: [
      {text: t('cancel'), role: 'cancel'},
      {
        text: t('delete'), role: 'destructive', handler: () => {
          store.removeLecture(props.escrute.id, props.lectureId);
          emit('removed', parentId);
        }
      },
    ],
  });
  await alert.present();
}
</script>

<style scoped>
.origin {
  margin: 0 0 var(--space-6);
  padding: var(--space-3) var(--space-4);
  font-style: italic;
  line-height: 1.55;
  color: var(--ink-soft);
  background: var(--paper-sunken);
  border-left: 3px solid var(--rule-strong);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.origin-label {
  display: block;
  margin-bottom: var(--space-1);
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.section {
  margin-top: var(--space-7);
}

.section-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 var(--space-3);
}

.note {
  min-height: 9rem;
  font-size: 1.05rem;
}

.hint {
  margin: 0 0 var(--space-4);
}

.from-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0 0 var(--space-4);
  padding: var(--space-1) var(--space-1) var(--space-1) var(--space-3);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--ink);
  background: var(--highlight);
  border-radius: var(--radius-pill);
}

.from-chip-clear {
  display: flex;
  padding: 4px;
  border: none;
  border-radius: var(--radius-pill);
  background: none;
  color: var(--ink-soft);
  cursor: pointer;
}

.from-chip-clear:hover {
  color: var(--ink);
  background: rgba(var(--shadow-color), 0.08);
}

.jumps {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--rule);
}

.jumps li {
  border-bottom: 1px solid var(--rule);
}

.jump {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: calc(100% + 2 * var(--space-2));
  padding: var(--space-3) var(--space-2);
  margin: 0 calc(-1 * var(--space-2));
  font: inherit;
  text-align: left;
  border: none;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--ink);
  cursor: pointer;
}

.jump:hover {
  background: var(--paper-sunken);
}

.jump-heading {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 1.08rem;
  font-weight: 600;
}

.jump-from {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--rubric);
}

.jump-icon {
  flex-shrink: 0;
  color: var(--ink-faint);
}

.jump-note {
  max-width: 100%;
  font-size: 0.88rem;
  color: var(--ink-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.danger-zone {
  margin-top: var(--space-7);
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule);
}

.not-found {
  color: var(--ink-faint);
}
</style>
