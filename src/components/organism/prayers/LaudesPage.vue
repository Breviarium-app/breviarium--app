<template>
  <PrayerPage :display-liturgical-info="true" title="Laudes">
    <!--    <h4 class="office-title">-->
    <!--      {{ $t("laudes") }}-->
    <!--    </h4>-->
    <p class=" title-color">
      {{ $t("laudesFirstExplanation") }}
    </p>
    <h4 class="title title-color">
      {{ formatText($t("initialInvocation")) }}
    </h4>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center"
       @click="() => isModalInvocationOpen = true">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <!--    <span-->
    <!--        v-if="dateStore.isTodayLent"-->
    <!--        v-html="formatTextIn18('initialInvocationBodyLent')"-->
    <!--    ></span>-->
    <span v-html="formatText($t('initialInvocationBody'))"></span>
    <h4 class="title title-color">
      {{ formatText($t("invitatory")) }}
    </h4>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center"
       @click="() => isModalInvocationOpen = true">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossInvitatory")) }}</small>
    </p>
    <p><span class="title-color"> ℣.</span>{{ $t("firstVersiculumOffice") }}</p>
    <p><span class="title-color"> ℟.</span>{{ $t("firstResponseOffice") }}</p>
    <InvitatoryComponent/>
    <HymnComponent :text="laudes?.himno"/>
    <h4 class="title title-color">
      {{ $t("salmodia") }}
    </h4>
    <p>
      <span class="title-color">Ant. 1. </span>
      <span v-html="formatText(laudes?.primer_salmo_antifona)"></span>
    </p>
    <p class="title-color cita" v-html="formatText(laudes?.primer_salmo_cita)"></p>
    <p v-html="formatText(laudes?.primer_salmo_texto)"></p>
    <p>
      <span class="title-color">Ant. </span><span v-html="formatText(laudes?.primer_salmo_antifona)"></span>
    </p>
    <p>
      <span class="title-color">Ant. 2. </span><span v-html="formatText(laudes?.segundo_salmo_antifona)"></span>
    </p>
    <p></p>
    <p class="title-color cita" v-html="formatText(laudes?.segundo_salmo_cita)"></p>
    <p v-html="formatText(laudes?.segundo_salmo_texto)"></p>
    <p>
      <span class="title-color">Ant. </span><span v-html="formatText(laudes?.segundo_salmo_antifona)"></span>
    </p>
    <p>
      <span class="title-color">Ant. 3. </span>
      <span v-html="formatText(laudes?.tercer_salmo_antifona)"></span>
    </p>
    <p></p>
    <p class="title-color cita" v-html="formatText(laudes?.tercer_salmo_cita)"></p>
    <p v-html="formatText(laudes?.tercer_salmo_texto)"></p>
    <p>
      <span class="title-color">Ant. </span>
      <span v-html="formatText(laudes?.tercer_salmo_antifona)"></span>
    </p>
    <h4 class="title title-color">
      {{ $t("lectioBrevis") }}
    </h4>
    <p class="reference-bible title-color cita" v-html="formatText(laudes?.lectura_biblica_cita)"></p>
    <p v-html="formatText(laudes?.lectura_biblica)"></p>
    <h4 class="title title-color">
      {{ $t("responsory") }}
    </h4>
    <div v-for="item in laudes?.responsorios" v-bind:key="item">
      <p v-html="formatText(item)"></p>
    </div>
    <!------ OFICIO DE LECTURA (opcional) ------>
    <div v-if="settings.laudesOfficium">
      <OfficiumLectures/>
    </div>
    <!------ EVANGELIO (opcional) settings.laudesEvangelium ------>
    <div v-if="settings.laudesEvangelium">
      <EvangeliumLecture/>
    </div>
    <!--    <TimerMeditation/> TODO: handle timer working in the background -->

    <h4 class="title title-color">
      {{ $t("meditationTime") }}
    </h4>
    <p class="title-color">
      <i>{{ $t("meditationTimeNote") }}</i>
    </p>
    <h4 class="title title-color">
      {{ $t("canticumEvangelicum") }}
    </h4>
    <p>
      <span class="title-color">Ant. </span><span v-html="formatText(laudes?.cantico_evangelico_antifona)"></span>
    </p>
    <BenedictusPrayer/>
    <p>
      <span class="title-color">Ant. </span><span v-html="formatText(laudes?.cantico_evangelico_antifona)"></span>
    </p>
    <h4 class="title title-color">
      {{ $t("preces") }}
    </h4>
    <p v-html="formatText(laudes?.preces_intro)"></p>
    <p v-html="formatText(laudes?.preces_respuesta)"></p>
    <div v-for="item in laudes?.preces_contenido" v-bind:key="item" class="preces">
      <p v-html="formatPrayers(item)"></p>
    </div>
    <div class="preces">
      <p class="title-color">{{ $t("explanationPreces") }}</p>
    </div>
    <CustomPrayersBlock/>
    <h4 class="title title-color">
      {{ $t("ourLord") }}
    </h4>
    <p class="margin-y-md">
      <ion-label class="title-color"> ℣.</ion-label>
      <span v-html="formatText(laudes?.invitacion_padrenuestro)"></span>
    </p>
    <PadreNuestro/>
    <h4 class="title title-color">
      {{ $t("oratio") }}
    </h4>
    <p>
      <span class="title-color">℣. </span>
      <span
          v-html="formatText(laudes?.oracion_final)"
      ></span>
    </p>
    <p>
      <span class="title-color">℟.</span>
      Amén.
    </p>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <p>
      <ion-label class="title-color"> ℣.</ion-label>
      {{ $t("finalVersiculumLaudes") }}
    </p>
    <p>
      <ion-label class="title-color"> ℟.</ion-label>
      Amén.
    </p>
  </PrayerPage>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PrayerPage from "@/components/organism/PrayerPage.vue";
import {formatPrayers, formatText} from "@/constants/formatText.ts";
import CrossComponent from "@/components/molecules/prayers/CrossComponent.vue";
import InvitatoryComponent from "@/components/molecules/prayers/InvitatoryComponent.vue";
import HymnComponent from "@/components/molecules/prayers/HymnComponent.vue";
import {LaudesSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import BenedictusPrayer from "@/components/molecules/prayers/Benedictus.vue";
import PadreNuestro from "@/components/molecules/prayers/PadreNuestro.vue";
import {IonLabel} from "@ionic/vue";
import {useSettingsStore} from "@/stores/settingsStore.ts";
import OfficiumLectures from "@/components/molecules/prayers/OfficiumLectures.vue";
import CustomPrayersBlock from "@/components/organism/prayers/CustomPrayersBlock.vue";
import EvangeliumLecture from "@/components/molecules/prayers/EvangeliumLecture.vue";
import {useBreviariumStore} from "@/stores/breviarium.ts";

const laudes = ref<LaudesSchemaOutput>();
const isModalInvocationOpen = ref(false);
const settings = useSettingsStore().settings;

onMounted(async () => {
  await useBreviariumStore().getLaudes().then((data) => {
    laudes.value = data;
  });


});

</script>
<style lang="css" scoped>
.cita {
  text-align: center;
}

.reference-bible {
  text-align: right;
}

.custom-prayers li {
  list-style-type: none;
}
</style>