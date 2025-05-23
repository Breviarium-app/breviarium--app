<template>
  <PrayerPage title="Evangelio y lecturas">
    <h3 class="center">{{ $t('cycle') }} {{ liturgyInfo?.cycle }}</h3>
    <h3 class="center">{{ liturgyInfo?.celebration }}, {{ rank }}</h3>
    <div v-for="(prayer) in prayers">
      <!--      <h3 v-if="prayer?.celebraciones_posibles[index]" class="center"-->
      <!--          v-html="formatText(prayer?.celebraciones_posibles[index])"></h3>-->
      <div v-for="(lecture) in prayer?.lecturas" class="lecture-block">
        <h4 class="title-color" v-html="formatText(lecture.ref)"></h4>
        <p v-html="formatTextLecture(lecture.texto)"></p>
        <p v-if="lecture.type == LectureTypes.GOSPEL || lecture.type == LectureTypes.CELEBRATION_GOSPEL" class="right">
          {{ t('theGospelOfTheLord') }}</p>
        <p v-if="lecture.type == LectureTypes.FIRST_LECTURE || lecture.type == LectureTypes.SECOND_LECTURE || lecture.type == LectureTypes.CELEBRATION_FIRST_LECTURE || lecture.type == LectureTypes.CELEBRATION_SECOND_LECTURE"
           class="right">{{ t('theWordOfTheLord') }}</p>
      </div>
    </div>
  </PrayerPage>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PrayerPage from "@/components/organism/PrayerPage.vue";
import {LecturesSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import {formatText, formatTextLecture} from "@/constants/formatText.ts";
import {LectureTypes} from "@/constants/types.ts";
import {useI18n} from 'vue-i18n'
import {useBreviariumStore} from "@/stores/breviarium.ts";
import {rankTranslate} from "@/constants/utils.ts";

const {t} = useI18n()

onMounted(async () => {
  await useBreviariumStore().getLectures().then((data) => {
    prayers.value = data;
    console.log("lectures!", prayers.value);
  });
  await useBreviariumStore().getLiturgyInformation().then((data) => {
    liturgyInfo.value = data;

  });
  rank.value = await rankTranslate(liturgyInfo.value?.rank)
});

const prayers = ref<LecturesSchemaOutput[]>();
const liturgyInfo = ref();
const rank = ref();

</script>
<style lang="css" scoped>
.lecture-block {
  margin-bottom: 1.5em;
}
</style>