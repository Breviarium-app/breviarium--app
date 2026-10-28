<template>
  <PrayerPage :title="`${t('settings.office_deceased')} · ${t('breviarium.laudes')}`">
    <p data-tts-skip class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText(t("signOfTheCrossSay")) }}</small>
    </p>
    <span v-html="formatText(t('initialInvocationBody'))"></span>

    <HymnComponent :text="lauds.hymn"/>

    <h4 class="title title-color">{{ t('salmodia') }}</h4>
    <DeceasedPsalmBlock :ant="lauds.firstPsalm.ant" :body="lauds.firstPsalm.body"
                         :subtitle="lauds.firstPsalm.subtitle" :title="lauds.firstPsalm.title"/>
    <DeceasedPsalmBlock :ant="lauds.canticoAT.ant" :body="lauds.canticoAT.body"
                         :subtitle="lauds.canticoAT.subtitle" :title="lauds.canticoAT.title"/>
    <DeceasedPsalmBlock :ant="lauds.secondPsalm.ant" :body="lauds.secondPsalm.body"
                         :subtitle="lauds.secondPsalm.subtitle" :title="lauds.secondPsalm.title"/>

    <h4 class="title title-color">{{ t('lectioBrevis') }}</h4>
    <p class="cita">{{ lauds.biblicalReading.title }}</p>
    <p class="reference-bible cita title-color">{{ lauds.biblicalReading.reference }}</p>
    <div v-html="lauds.biblicalReading.body"></div>

    <h4 class="title title-color">{{ t('canticumEvangelicum') }}</h4>
    <div v-html="lauds.gospelSong.header"></div>
    <BenedictusPrayer/>
    <div v-html="lauds.gospelSong.footer"></div>

    <h4 class="title title-color">{{ t('preces') }}</h4>
    <div v-html="lauds.preces"></div>
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
import BenedictusPrayer from "@/modules/app/components/molecules/prayers/Benedictus.vue";
import PadreNuestro from "@/modules/app/components/molecules/prayers/PadreNuestro.vue";
import CustomPrayersBlock from "@/modules/app/components/organism/prayers/CustomPrayersBlock.vue";
import DeceasedPsalmBlock from "@/modules/app/components/molecules/prayers/DeceasedPsalmBlock.vue";
import officeDeceased from "@/modules/app/stores/deceasedPrayers/office_deceased.json";

const {t} = useI18n();

const lauds = officeDeceased.lauds;
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
