<template>
  <PrayerPage title="Evangelio y lecturas">
    <div v-for="(prayer, index) in prayers">
      <h3 class="center" v-html="formatText(prayer?.celebraciones_posibles[index])"></h3>
      <div v-for="(lecture) in prayer?.lecturas" class="lecture-block">
        <h4 class="title-color" v-html="formatText(lecture.ref)"></h4>
        <p v-html="formatTextLecture(lecture.texto)"></p>
        <p v-if="lecture.type == LectureTypes.GOSPEL" class="right">{{ t('theGospelOfTheLord') }}</p>
        <p v-if="lecture.type == LectureTypes.FIRST_LECTURE || lecture.type == LectureTypes.SECOND_LECTURE"
           class="right">{{ t('theWordOfTheLord') }}</p>
      </div>
    </div>
  </PrayerPage>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PrayerPage from "@/components/organism/PrayerPage.vue";
import Breviarium from "breviarium";
import {LecturesSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import {formatText, formatTextLecture} from "@/constants/formatText.ts";
import {LectureTypes} from "@/constants/types.ts";
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

onMounted(async () => {
  const brev = new Breviarium();
  await brev.getLectures().then((data) => {
    prayers.value = data;
    console.log("lectures!", prayers.value);
  });
});

const prayers = ref<LecturesSchemaOutput[]>();

// const selectedLecturesOption: Ref<string> = ref('first');
// const changeLecturesOption = (event: any) => {
//   selectedLecturesOption.value = event
// };

</script>
<style lang="css" scoped>
.lecture-block {
  margin-bottom: 1.5em;
}
</style>