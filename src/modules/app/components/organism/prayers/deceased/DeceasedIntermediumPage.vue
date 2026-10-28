<template>
  <PrayerPage :title="`${t('settings.office_deceased')} · ${t(hourLabel)}`">
    <p data-tts-skip class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText(t("signOfTheCrossSay")) }}</small>
    </p>
    <span v-html="formatText(t('initialInvocationBody'))"></span>

    <HymnComponent :text="intermedium.hymn"/>

    <h4 class="title title-color">{{ t('salmodia') }}</h4>
    <DeceasedPsalmBlock :ant="intermedium.dayPsaum.psaum1.ant" :body="intermedium.dayPsaum.psaum1.body"
                         :subtitle="intermedium.dayPsaum.psaum1.subtitle" :title="intermedium.dayPsaum.psaum1.title"/>
    <DeceasedPsalmBlock :body="intermedium.dayPsaum.psaum2.body"
                         :subtitle="intermedium.dayPsaum.psaum2.subtitle" :title="intermedium.dayPsaum.psaum2.title"/>
    <DeceasedPsalmBlock :body="intermedium.dayPsaum.psaum3.body"
                         :subtitle="intermedium.dayPsaum.psaum3.subtitle" :title="intermedium.dayPsaum.psaum3.title"/>

    <h4 class="title title-color">{{ t('lectioBrevis') }}</h4>
    <p class="cita">{{ hourContent.biblicalReading.title }}</p>
    <p class="reference-bible cita title-color">{{ hourContent.biblicalReading.reference }}</p>
    <div v-html="hourContent.biblicalReading.body"></div>
  </PrayerPage>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";
import {formatText} from "@/modules/app/constants/formatText.ts";
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import HymnComponent from "@/modules/app/components/molecules/prayers/HymnComponent.vue";
import DeceasedPsalmBlock from "@/modules/app/components/molecules/prayers/DeceasedPsalmBlock.vue";
import officeDeceased from "@/modules/app/stores/deceasedPrayers/office_deceased.json";

const props = defineProps<{
  hour: 'tertia' | 'sexta' | 'nona';
}>();

const {t} = useI18n();

// The JSON key is "tertia" (Latin), but the breviarium.* label keys use "tercia" (Spanish)
const hourLabels = {tertia: 'breviarium.tercia', sexta: 'breviarium.sexta', nona: 'breviarium.nona'};
const hourLabel = hourLabels[props.hour];

const intermedium = officeDeceased.intermediumHour;
const hourContent = intermedium[props.hour];
</script>

<style lang="css" scoped>
.cita {
  text-align: center;
}

.reference-bible {
  text-align: right;
}
</style>
