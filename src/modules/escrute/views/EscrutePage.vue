<template>
  <BasePage :back-text="t('escrute.title')" :eyebrow="t('escrute.eyebrow')" :title="escrute?.title ?? t('escrute.not_found')" back-href="/diary?section=escrutes">
    <template v-if="escrute" #subtitle>
      {{ t('escrute.lectures_count', {n: escrute.lectures.length}, escrute.lectures.length) }}
      · {{ t('escrute.started_on', {date: formatDate(escrute.createdAt, locale)}) }}
    </template>

    <template v-if="escrute">
      <div :aria-label="t('escrute.view')" class="view-picker" role="group">
        <button v-for="option in VIEW_OPTIONS" :key="option.value"
                :aria-pressed="view === option.value"
                :class="['view-option', {selected: view === option.value}]"
                type="button"
                @click="view = option.value">
          <ion-icon :icon="option.icon" aria-hidden="true"></ion-icon>
          {{ t(option.label) }}
        </button>
      </div>

      <LectureGraph v-if="view === 'graph'" :escrute="escrute" @edit="id => editingId = id" @select="openInBible"/>
      <ul v-else class="tree">
        <LectureTree :escrute="escrute" :lecture="rootLecture(escrute)" @edit="id => editingId = id" @select="openInBible"/>
      </ul>
      <LectureNoteModal v-model="editingId" :escrute="escrute"/>

      <div class="actions">
        <button class="es-btn es-btn-quiet" type="button" @click="rename">
          <ion-icon :icon="pencilOutline" aria-hidden="true"></ion-icon>
          {{ t('escrute.rename') }}
        </button>
        <button class="es-btn es-btn-quiet" type="button" @click="remove">
          <ion-icon :icon="trashOutline" aria-hidden="true"></ion-icon>
          {{ t('escrute.delete') }}
        </button>
      </div>
    </template>
    <p v-else class="not-found">{{ t('escrute.missing') }}</p>
  </BasePage>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {alertController, IonIcon} from "@ionic/vue";
import {gitNetworkOutline, listOutline, pencilOutline, trashOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import BasePage from "../components/BasePage.vue";
import LectureGraph from "../components/LectureGraph.vue";
import LectureNoteModal from "../components/LectureNoteModal.vue";
import LectureTree from "../components/LectureTree.vue";
import {biblePath} from "../reference";
import {findLecture, formatDate, rootLecture} from "../escrute";
import {useEscruteStore} from "../escruteStore";

const props = defineProps<{ id: string }>();
const store = useEscruteStore();
const router = useRouter();
const {t, locale} = useI18n();

const escrute = computed(() => store.find(props.id));

type View = 'graph' | 'list';
const VIEW_KEY = 'escrutes.view';
const VIEW_OPTIONS: { value: View, label: string, icon: string }[] = [
  {value: 'graph', label: 'escrute.tree', icon: gitNetworkOutline},
  {value: 'list', label: 'escrute.list', icon: listOutline},
];

const view = ref<View>(localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'graph');
watch(view, value => localStorage.setItem(VIEW_KEY, value));

/** Lecture whose reflection is being written over the tree */
const editingId = ref<string>();

/** Reads on from the tapped lecture in the Bible, with the trail of the escrute over the text */
function openInBible(lectureId: string) {
  const lecture = escrute.value && findLecture(escrute.value, lectureId);
  if (!lecture) return;
  store.resume(props.id, lectureId);
  router.push(biblePath(lecture.passage));
}

async function rename() {
  const alert = await alertController.create({
    header: t('escrute.rename_title'),
    inputs: [{name: 'title', value: escrute.value?.title, attributes: {autocapitalize: 'sentences'}}],
    buttons: [
      {text: t('cancel'), role: 'cancel'},
      {text: t('save'), handler: ({title}) => title?.trim() && store.rename(props.id, title.trim())},
    ],
  });
  await alert.present();
}

async function remove() {
  const alert = await alertController.create({
    header: t('escrute.delete_title'),
    message: t('escrute.delete_message'),
    buttons: [
      {text: t('cancel'), role: 'cancel'},
      {
        text: t('delete'), role: 'destructive', handler: () => {
          store.remove(props.id);
          router.replace('/diary?section=escrutes');
        }
      },
    ],
  });
  await alert.present();
}
</script>

<style scoped>
.view-picker {
  display: inline-flex;
  gap: var(--space-1);
  padding: 3px;
  background: var(--paper-sunken);
  border: 1px solid var(--rule);
  border-radius: var(--radius-md);
}

.view-option {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--ink-soft);
  background: none;
  border: none;
  border-radius: calc(var(--radius-md) - 3px);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}

.view-option:hover {
  color: var(--ink);
}

.view-option.selected {
  background: var(--paper-raised);
  color: var(--rubric);
  box-shadow: var(--shadow-sm), 0 0 0 1px var(--rule);
}

.tree {
  margin: var(--space-4) 0 0;
  padding: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-7);
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule);
}

.not-found {
  color: var(--ink-faint);
}
</style>
