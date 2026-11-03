<template>
  <p class="intro">{{ t('escrute.list_subtitle') }}</p>

  <button class="es-btn es-btn-primary new-button" type="button" @click="showNew = true">
    <ion-icon :icon="addOutline" aria-hidden="true"></ion-icon>
    {{ t('escrute.new') }}
  </button>

  <ul v-if="store.sorted.length" class="escrutes">
    <li v-for="escrute in store.sorted" :key="escrute.id">
      <router-link :to="`/escrutes/${escrute.id}`" class="escrute btn">
        <span class="escrute-title">{{ escrute.title }}</span>
        <span class="escrute-meta">
          {{ t('escrute.from_passage', {passage: formatPassage(rootLecture(escrute).passage)}) }}
          · {{ t('escrute.lectures_count', {n: escrute.lectures.length}, escrute.lectures.length) }}
          · {{ formatDate(escrute.updatedAt, locale) }}
        </span>
      </router-link>
    </li>
  </ul>

  <section v-else class="empty-state">
    <ion-icon :icon="leafOutline" aria-hidden="true" class="empty-icon"></ion-icon>
    <p class="empty-text" v-html="t('escrute.empty_1')"></p>
    <p class="empty-text">{{ t('escrute.empty_2') }}</p>
  </section>

  <StartEscruteModal v-model="showNew" @start="start"/>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {IonIcon} from "@ionic/vue";
import {addOutline, leafOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import StartEscruteModal from "./StartEscruteModal.vue";
import {biblePath, formatPassage, type Passage} from "../reference";
import {formatDate, rootLecture} from "../escrute";
import {useEscruteStore} from "../escruteStore";

const store = useEscruteStore();
const router = useRouter();
const {t, locale} = useI18n();

const showNew = ref(false);

function start(title: string, passage: Passage) {
  // The escrute becomes the one being read, so its trail floats over the chapter
  store.start(title, passage);
  router.push(biblePath(passage));
}
</script>

<style scoped>
.intro {
  margin: 0.25rem 0.25rem 1rem;
  line-height: 1.5;
}

.new-button {
  margin-bottom: 1.75rem;
}

.escrutes {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.escrute {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  background: var(--background-color-card);
  color: var(--ink);
  font-weight: 400;
  text-decoration: none;
}

.escrute-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.escrute-meta {
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--ink-faint);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1.5rem;
  border-radius: 18px;
  text-align: center;
  border: 1px dashed var(--rule-strong);
}

.empty-icon {
  font-size: 2rem;
  color: var(--ion-color-primary);
}

.empty-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  opacity: 0.75;
}
</style>
