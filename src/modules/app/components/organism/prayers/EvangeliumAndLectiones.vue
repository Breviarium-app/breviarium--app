<template>
  <PrayerPage title="Evangelio y lecturas">
    <div class="">
      <div>
        <h3 class="center">{{ $t('cycle') }} {{ liturgyInfo?.cycle }}</h3>
        <h3 class="center">{{ liturgyInfo?.celebration }}, {{ rank }}</h3>
      </div>
      <CopyLink :link="shareLink" show-description/>
    </div>


    <div v-for="item in lecturesBlocks">
      <ion-segment v-if="item.lectures.value.length > 1" v-model="item.selected.value">
        <!--  && item.lectures.value[1].texto -->
        <ion-segment-button v-for="(_item, index) in item.lectures.value" :value="(index)">
          <ion-label>Opción {{ index + 1 }}</ion-label>
        </ion-segment-button>
      </ion-segment>
      <div v-for="(lecture, index) in item.lectures.value" class="lecture-block">
        <div v-if="item.selected.value == index">
          <h4 class="title-color" v-html="formatText(lecture.ref)"></h4>
          <p v-html="formatTextLecture(lecture.texto)"></p>
          <p v-if="item.responseKey" class="right">{{ t(item.responseKey) }}</p>
        </div>
      </div>
    </div>
  </PrayerPage>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";
import {LecturesSchemaOutput, SingleLectureSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import {formatText, formatTextLecture} from "@/modules/app/constants/formatText.ts";
import {LectureTypes} from "@/modules/app/constants/types.ts";
import {useI18n} from 'vue-i18n'
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";
import {rankTranslate} from "@/modules/app/constants/utils.ts";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import CopyLink from "@/modules/app/components/molecules/CopyLink.vue";

const {t} = useI18n()

const dateStore = useDateStore();
const shareLink = computed(() => {
  const date = dateStore.currentDate;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${window.location.origin}/${year}/${month}/${day}/evangelium`;
});

const selectedFirst = ref<number>(0);
const selectedPsalm = ref<number>(0);
const selectedSecond = ref<number>(0);
const selectedGospel = ref<number>(0);

useDateStore().updateDateParams()

onMounted(async () => {

  await useBreviariumStore().getLiturgyInformation().then((data) => {
    liturgyInfo.value = data;
  });
  rank.value = await rankTranslate(liturgyInfo.value?.rank)

  await useBreviariumStore().getLectures().then((data) => {
    prayers.value = data?.filter(x => x.cycle == 'YEAR_' + liturgyInfo.value.cycle);
    if (prayers.value?.length === 0) {
      const isEven: boolean = liturgyInfo.value.calendar.endOfLiturgycalSeason.split('-')[0] % 2 == 0;
      if (isEven) {
        prayers.value = data?.filter(x => x.cycle == "EVEN");
      } else {
        prayers.value = data?.filter(x => x.cycle == "ODD");
      }
    }
    //check memory
    if (prayers.value?.length === 0) {
      prayers.value = data;
    }
  });
});

const prayers = ref<LecturesSchemaOutput[]>();
const liturgyInfo = ref();
const rank = ref();

const firstLectures = ref<SingleLectureSchemaOutput[]>([]);
const psalmLectures = ref<SingleLectureSchemaOutput[]>([]);
const secondLectures = ref<SingleLectureSchemaOutput[]>([]);
const gospelLectures = ref<SingleLectureSchemaOutput[]>([]);

watch(prayers, () => {

  prayers.value?.forEach(prayer => {
    prayer.lecturas.forEach(lecture => {
      if ([LectureTypes.FIRST_LECTURE, LectureTypes.FIRST_LECTURE_ALTERNATIVE, LectureTypes.FIRST_LECTURE_CELEBRATION].includes(lecture.type as LectureTypes)) {
        if (lecture.texto?.length > 0) firstLectures.value?.push(lecture)
      }
      if ([LectureTypes.PSALM, LectureTypes.PSALM_CELEBRATION].includes(lecture.type as LectureTypes)) {
        if (lecture.texto?.length > 0) psalmLectures.value?.push(lecture)
      }
      if ([LectureTypes.SECOND_LECTURE, LectureTypes.SECOND_LECTURE_ALTERNATIVE, LectureTypes.SECOND_LECTURE_CELEBRATION].includes(lecture.type as LectureTypes)) {
        if (lecture.texto?.length > 0) secondLectures.value?.push(lecture)
      }
      if ([LectureTypes.GOSPEL, LectureTypes.GOSPEL_SHORT, LectureTypes.GOSPEL_CELEBRATION, LectureTypes.GOSPEL_ALTERNATIVE_CELEBRATION].includes(lecture.type as LectureTypes)) {
        if (lecture.texto?.length > 0) gospelLectures.value?.push(lecture)
      }
    })
  });
})

const lecturesBlocks = [
  {lectures: firstLectures, selected: selectedFirst, responseKey: 'theWordOfTheLord'},
  {lectures: psalmLectures, selected: selectedPsalm, responseKey: ''},
  {lectures: secondLectures, selected: selectedSecond, responseKey: 'theWordOfTheLord'},
  {lectures: gospelLectures, selected: selectedGospel, responseKey: 'theGospelOfTheLord'},
]
</script>
<style lang="css" scoped>
.lecture-block {
  margin-bottom: 1.5em;
}
</style>