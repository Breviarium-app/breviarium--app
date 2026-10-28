<template>
  <PrayerPage :title="`${t('settings.office_deceased')} · ${t('breviarium.vesperae')}`">
    <p data-tts-skip class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText(t("signOfTheCrossSay")) }}</small>
    </p>
    <span v-html="formatText(t('initialInvocationBody'))"></span>

    <HymnComponent :text="vesperae.hymn"/>

    <h4 class="title title-color">{{ t('salmodia') }}</h4>
    <DeceasedPsalmBlock :ant="vesperae.firstPsalm.ant" :body="vesperae.firstPsalm.body"
                         :subtitle="vesperae.firstPsalm.subtitle" :title="vesperae.firstPsalm.title"/>
    <DeceasedPsalmBlock :ant="vesperae.secondPsalm.ant" :body="vesperae.secondPsalm.body"
                         :subtitle="vesperae.secondPsalm.subtitle" :title="vesperae.secondPsalm.title"/>
    <DeceasedPsalmBlock :ant="vesperae.canticoNT.ant" :body="vesperae.canticoNT.body"
                         :title="vesperae.canticoNT.title"/>

    <h4 class="title title-color">{{ t('lectioBrevis') }}</h4>
    <p class="cita">{{ vesperae.biblicalReading.title }}</p>
    <p class="reference-bible cita title-color">{{ vesperae.biblicalReading.reference }}</p>
    <div v-html="vesperae.biblicalReading.body"></div>

    <h4 class="title title-color">{{ t('canticumEvangelicum') }}</h4>
    <div v-html="vesperae.gospelSong.header"></div>
    <MagnificatPrayer/>
    <div v-html="vesperae.gospelSong.footer"></div>

    <h4 class="title title-color">{{ t('preces') }}</h4>
    <div v-html="vesperae.preces"></div>
    <CustomPrayersBlock/>

    <h4 class="title title-color">{{ t('ourLord') }}</h4>
    <PadreNuestro/>

    <h4 class="title title-color">{{ t('oratio') }}</h4>
    <p class="title-color"><i>{{ commons.final.subtitle }}</i></p>
    <div v-html="commons.final.body"></div>

    <p data-tts-skip class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText(t("signOfTheCrossSay")) }}</small>
    </p>
    <div v-html="commons.finalLaudesVesperae"></div>
  </PrayerPage>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";
import {formatText} from "@/modules/app/constants/formatText.ts";
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import HymnComponent from "@/modules/app/components/molecules/prayers/HymnComponent.vue";
import MagnificatPrayer from "@/modules/app/components/molecules/prayers/MagnificatPrayer.vue";
import PadreNuestro from "@/modules/app/components/molecules/prayers/PadreNuestro.vue";
import CustomPrayersBlock from "@/modules/app/components/organism/prayers/CustomPrayersBlock.vue";
import DeceasedPsalmBlock from "@/modules/app/components/molecules/prayers/DeceasedPsalmBlock.vue";
import officeDeceased from "@/modules/app/stores/deceasedPrayers/office_deceased.json";

const {t} = useI18n();

const vesperae = officeDeceased.vesperae;
const commons = officeDeceased.commons;
</script>

<style lang="css" scoped>
.cita {
  text-align: center;
}

.reference-bible {
  text-align: right;
}
</style>
