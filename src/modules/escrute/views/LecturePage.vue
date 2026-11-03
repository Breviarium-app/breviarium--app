<template>
  <BasePage :back-href="`/escrutes/${id}`"
            :eyebrow="escrute?.title"
            :title="lecture ? formatPassage(lecture.passage, 'long') : t('escrute.lecture_not_found')"
            :back-text="t('escrute.tree')">
    <template v-if="path.length > 1" #subtitle>
      <nav :aria-label="t('escrute.path_label')" class="path">
        <template v-for="step in path.slice(0, -1)" :key="step.id">
          <router-link :to="`/escrutes/${id}/${step.id}`">{{ formatPassage(step.passage) }}</router-link>
          <span aria-hidden="true" class="path-separator">›</span>
        </template>
      </nav>
    </template>

    <LectureDetail v-if="escrute"
                   :escrute="escrute"
                   :lecture-id="lectureId"
                   @open="id => router.push(`/escrutes/${props.id}/${id}`)"
                   @removed="parentId => router.replace(`/escrutes/${props.id}/${parentId}`)"/>
    <p v-else class="not-found">{{ t('escrute.missing') }}</p>
  </BasePage>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import BasePage from "../components/BasePage.vue";
import {formatPassage} from "../reference";
import LectureDetail from "../components/LectureDetail.vue";
import {findLecture, pathTo} from "../escrute";
import {useEscruteStore} from "../escruteStore";

const props = defineProps<{ id: string, lectureId: string }>();
const store = useEscruteStore();
const router = useRouter();
const {t} = useI18n();

const escrute = computed(() => store.find(props.id));
const lecture = computed(() => escrute.value && findLecture(escrute.value, props.lectureId));
const path = computed(() => escrute.value ? pathTo(escrute.value, props.lectureId) : []);
</script>

<style scoped>
.path {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-1) var(--space-2);
  font-size: 0.85rem;
}

.path a {
  color: var(--ink-soft);
}

.path a:hover {
  color: var(--rubric);
}

.path-separator {
  color: var(--ink-faint);
}

.not-found {
  color: var(--ink-faint);
}
</style>
