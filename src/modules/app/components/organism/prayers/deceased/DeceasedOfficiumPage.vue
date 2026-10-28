<template>
  <PrayerPage :title="`${t('settings.office_deceased')} · ${t('breviarium.officium')}`">
    <h4 data-tts-skip class="title-color">
      <small>{{ t("laudesFirstExplanation") }}</small>
    </h4>
    <h4 class="title title-color">{{ t('initialInvocation') }}</h4>
    <p data-tts-skip class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText(t("signOfTheCrossSay")) }}</small>
    </p>
    <span v-html="formatText(t('initialInvocationBody'))"></span>

    <h4 class="title title-color">{{ t('invitatory') }}</h4>
    <p data-tts-skip class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText(t("signOfTheCrossInvitatory")) }}</small>
    </p>
    <p>
      <span class="title-color"> ℣.</span>
      {{ t('firstVersiculumOffice') }}
    </p>
    <p>
      <span class="title-color"> ℟.</span>
      {{ t('firstResponseOffice') }}
    </p>
    <ion-segment v-model="selectedInvitatorium">
      <ion-segment-button v-for="(_, index) in invitatoryPsalms" :key="index" :value="index">
        <ion-label>{{ t('psalm') }} {{ invitatoryPsalmNumbers[index] }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <div v-if="invitatoryPsalms[selectedInvitatorium]">
      <div class="title-color" v-html="invitatoryPsalms[selectedInvitatorium].title"></div>
      <div v-html="invitatoryPsalms[selectedInvitatorium].psalm"></div>
    </div>

    <HymnComponent :text="office.hymn"/>

    <h4 class="title title-color">{{ t('salmodia') }}</h4>
    <DeceasedPsalmBlock :ant="office.firstPsalm.ant" :body="office.firstPsalm.body"
                         :subtitle="office.firstPsalm.subtitle" :title="office.firstPsalm.title"/>
    <DeceasedPsalmBlock :ant="office.secondPsalm.ant" :body="office.secondPsalm.body"
                         :title="office.secondPsalm.title"/>
    <DeceasedPsalmBlock :ant="office.thirdPsalm.ant" :body="office.thirdPsalm.body"
                         :subtitle="office.thirdPsalm.subtitle" :title="office.thirdPsalm.title"/>

    <h4 class="title title-color">{{ t('officiumLectionis') }}</h4>
    <div v-html="office.biblicalReading.header"></div>
    <ion-segment v-model="selectedBiblical">
      <ion-segment-button v-for="(_, index) in biblicalReadings" :key="index" :value="index">
        <ion-label>{{ t('reading') }} {{ index + 1 }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <DeceasedReadingBlock :body="biblicalReadings[selectedBiblical].body"
                           :reference="biblicalReadings[selectedBiblical].reference"
                           :subtitle="biblicalReadings[selectedBiblical].subtitle"
                           :title="biblicalReadings[selectedBiblical].title"/>

    <h4 class="title title-color">{{ t('lectioAltera') }}</h4>
    <ion-segment v-model="selectedPatristic">
      <ion-segment-button v-for="(_, index) in patristicReadings" :key="index" :value="index">
        <ion-label>{{ t('reading') }} {{ index + 1 }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <DeceasedReadingBlock :body="patristicReadings[selectedPatristic].body"
                           :reference="patristicReadings[selectedPatristic].reference"
                           :subtitle="patristicReadings[selectedPatristic].subtitle"
                           :title="patristicReadings[selectedPatristic].title"/>

    <h4 class="title title-color">{{ t('oratio') }}</h4>
    <p class="title-color"><i>{{ commons.final.subtitle }}</i></p>
    <div v-html="commons.final.body"></div>

    <p data-tts-skip class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText(t("signOfTheCrossSay")) }}</small>
    </p>
    <div v-html="commons.final.pendingCross"></div>
  </PrayerPage>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";
import {formatText} from "@/modules/app/constants/formatText.ts";
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import HymnComponent from "@/modules/app/components/molecules/prayers/HymnComponent.vue";
import DeceasedPsalmBlock from "@/modules/app/components/molecules/prayers/DeceasedPsalmBlock.vue";
import DeceasedReadingBlock from "@/modules/app/components/molecules/prayers/DeceasedReadingBlock.vue";
import officeDeceased from "@/modules/app/stores/deceasedPrayers/office_deceased.json";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";

const {t} = useI18n();

const office = officeDeceased.officiumPrayer;
const commons = officeDeceased.commons;

// The invitatory psalms (94, 99, 23, 66) are fixed options, unlike their antiphon which
// changes with the day's feast — the Office of the Dead has no antiphon of its own in the
// source data, so only the psalm choice is shown here.
const invitatoryPsalmNumbers = [94, 99, 23, 66];
const invitatoryPsalms = ref<any[]>([]);
const selectedInvitatorium = ref(0);

onMounted(async () => {
  invitatoryPsalms.value = await useBreviariumStore().getInvitatoriumPsalms();
});

const biblicalReadings = [
  office.biblicalReading.reading1,
  office.biblicalReading.reading2,
  office.biblicalReading.reading3,
];
const patristicReadings = [
  office.patristicReading.reading1,
  office.patristicReading.reading2,
];

const selectedBiblical = ref(0);
const selectedPatristic = ref(0);
</script>

<style lang="css" scoped>
</style>
