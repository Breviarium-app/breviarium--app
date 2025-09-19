<template>
  <PrayerPage :display-liturgical-info="true" title="Oficio">
    <h4 class="title-color">
      <small>{{ $t("laudesFirstExplanation") }}</small>
    </h4>
    <h4 class="title title-color">{{ $t('initialInvocation') }}</h4>

    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>

    <span v-if="isTodayLentCondition" v-html="formatText($t('initialInvocationBodyLent'))"></span>
    <span v-else v-html="formatText($t('initialInvocationBody'))"></span>

    <h4 class="title title-color">{{ $t('invitatory') }}</h4>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossInvitatory")) }}</small>
    </p>
    <p>
      <span class="title-color"> ℣.</span>
      {{ $t('firstVersiculumOffice') }}
    </p>
    <p>
      <span class="title-color"> ℟.</span>
      {{ $t('firstResponseOffice') }}
    </p>
    <InvitatoryComponent/>

    <HymnComponent :text="prayer?.himno"/>

    <h4 class="title title-color">{{ $t('salmodia') }}</h4>
    <p><span class="title-color">Ant. 1. </span><span v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>
    <p class="title-color cita" v-html="formatText(prayer?.primer_salmo_cita)"></p>
    <p v-html="formatText(prayer?.primer_salmo_texto)"></p>
    <p><span class="title-color">Ant. </span><span v-html="formatText(prayer?.primer_salmo_antifona)"></span></p>

    <p><span class="title-color">Ant. 2. </span><span v-html="formatText(prayer?.segundo_salmo_antifona)"></span></p>
    <p></p>
    <p class="title-color cita" v-html="formatText(prayer?.segundo_salmo_cita)"></p>
    <p v-html="formatText(prayer?.segundo_salmo_texto)"></p>
    <p><span class="title-color">Ant. </span><span v-html="formatText(prayer?.segundo_salmo_antifona)"></span></p>

    <p><span class="title-color">Ant. 3. </span><span v-html="formatText(prayer?.tercer_salmo_antifona)"></span></p>
    <p></p>
    <p class="title-color cita" v-html="formatText(prayer?.tercer_salmo_cita)"></p>
    <p v-html="formatText(prayer?.tercer_salmo_texto)"></p>
    <p><span class="title-color">Ant. </span><span v-html="formatText(prayer?.tercer_salmo_antifona)"></span></p>

    <h4 class="title title-color">{{ $t('versiculo') }}</h4>

    <div v-for="item in prayer?.responsorio1" v-bind:key="item"><p v-html="formatText(item)"></p></div>

    <h4 class="title title-color">{{ $t('reading').charAt(0).toUpperCase() + $t('reading').slice(1) }}</h4>

    <OfficiumLectures></OfficiumLectures>

    <!--    TODO: te deum display from romcal rank/season-->
    <!--    <div v-if="showTeDeum()">-->
    <!--      <h4 class="title title-liturgyInformationData">{{ $t('teDeum') }}</h4>-->
    <!--      <TeDeum/>-->
    <!--    </div>-->

    <h4 class="title title-color">{{ $t('oratio') }}</h4>

    <p>
      <span class="title-color">℣. </span>
      <span v-html="formatText(prayer?.oracion_final)"></span>
    </p>
    <p><span class="title-color">℟. </span>Amén.</p>

    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <p v-html="$t('finalPrayerBendigamos')"></p>

  </PrayerPage>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PrayerPage from "@/components/organism/PrayerPage.vue";
import {formatText} from "@/constants/formatText.ts";
import {OfficiumSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import OfficiumLectures from "@/components/molecules/prayers/OfficiumLectures.vue";
import CrossComponent from "@/components/molecules/prayers/CrossComponent.vue";
import InvitatoryComponent from "@/components/molecules/prayers/InvitatoryComponent.vue";
import {isTodayLent} from "@/constants/utils.ts";
import HymnComponent from "@/components/molecules/prayers/HymnComponent.vue";
import {useBreviariumStore} from "@/stores/breviarium.ts";
import { useDateStore } from "@/stores/useDateStore.ts";

const dateStore = useDateStore();
dateStore.setup();

const prayer = ref<OfficiumSchemaOutput>();
const isTodayLentCondition = ref();
onMounted(async () => {
  await useBreviariumStore().getOfficium().then((data) => {
    prayer.value = data;
  })

  await isTodayLent().then(value => isTodayLentCondition.value = value);

});

</script>
<style lang="css" scoped>
.cita {
  text-align: center;
}

</style>