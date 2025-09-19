<template>
  <PrayerPage title="Evangelio y lecturas">
    <h3 class="center">{{ $t('cycle') }} {{ liturgyInfo?.cycle }}</h3>
    <h3 class="center">{{ liturgyInfo?.celebration }}, {{ rank }}</h3>
    <div v-for="item in lecturesBlocks">
      <ion-segment v-if="item.lectures.value.length > 1" v-model="item.selected.value">
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
import {onMounted, ref, watch} from "vue";
import PrayerPage from "@/components/organism/PrayerPage.vue";
import {LecturesSchemaOutput, SingleLectureSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import {formatText, formatTextLecture} from "@/constants/formatText.ts";
import {LectureTypes} from "@/constants/types.ts";
import {useI18n} from 'vue-i18n'
import {useBreviariumStore} from "@/stores/breviarium.ts";
import {rankTranslate} from "@/constants/utils.ts";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import { useDateStore } from "@/stores/useDateStore.ts";

const dateStore = useDateStore();
dateStore.setup();

const {t} = useI18n()

const selectedFirst = ref<number>(0);
const selectedPsalm = ref<number>(0);
const selectedSecond = ref<number>(0);
const selectedGospel = ref<number>(0);

onMounted(async () => {

  await useBreviariumStore().getLiturgyInformation().then((data) => {
    liturgyInfo.value = data;
  });
  rank.value = await rankTranslate(liturgyInfo.value?.rank)

  await useBreviariumStore().getLectures().then((data) => {
    // console.log("data", data)
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
    console.log("prayers.value", prayers.value)
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
  console.log("prayers", prayers.value)

  prayers.value?.forEach(prayer => {
    prayer.lecturas.forEach(lecture => {
      if ([LectureTypes.FIRST_LECTURE, LectureTypes.FIRST_LECTURE_ALTERNATIVE, LectureTypes.FIRST_LECTURE_CELEBRATION].includes(lecture.type as LectureTypes)) {
        firstLectures.value?.push(lecture)
      }
      if ([LectureTypes.PSALM, LectureTypes.PSALM_CELEBRATION].includes(lecture.type as LectureTypes)) {
        psalmLectures.value?.push(lecture)
      }
      if ([LectureTypes.SECOND_LECTURE, LectureTypes.SECOND_LECTURE_ALTERNATIVE, LectureTypes.SECOND_LECTURE_CELEBRATION].includes(lecture.type as LectureTypes)) {
        secondLectures.value?.push(lecture)
      }
      if ([LectureTypes.GOSPEL, LectureTypes.GOSPEL_SHORT, LectureTypes.GOSPEL_CELEBRATION, LectureTypes.GOSPEL_ALTERNATIVE_CELEBRATION].includes(lecture.type as LectureTypes)) {
        gospelLectures.value?.push(lecture)
      }
    })
  });

  console.log("firstLectures", firstLectures.value)
  console.log("psalm", psalmLectures.value)
  console.log("second", secondLectures.value)
  console.log("gospel", gospelLectures.value)

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