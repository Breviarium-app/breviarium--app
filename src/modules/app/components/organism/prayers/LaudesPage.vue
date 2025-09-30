<template>
  <PrayerPage :display-liturgical-info="true" title="Laudes">
    <div v-if="laudesMultiple && laudesMultiple?.length > 1">
      <ion-segment v-model="selectedOption">
        <ion-segment-button :value="0">
          <ion-label>Memoria</ion-label>
        </ion-segment-button>
        <ion-segment-button :value="1">
          <ion-label>Feria</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>
    <div v-for="(laudes, index) in laudesMultiple">
      <div v-if="selectedOption == index">
        <p class="title-color">
          <small>{{ $t("laudesFirstExplanation") }}</small>
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
        <div v-if="!settings.hideInvitatorium">
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
        </div>
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
      </div>
    </div>

  </PrayerPage>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";
import {formatPrayers, formatText} from "@/modules/app/constants/formatText.ts";
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import InvitatoryComponent from "@/modules/app/components/molecules/prayers/InvitatoryComponent.vue";
import HymnComponent from "@/modules/app/components/molecules/prayers/HymnComponent.vue";
import {LaudesSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import BenedictusPrayer from "@/modules/app/components/molecules/prayers/Benedictus.vue";
import PadreNuestro from "@/modules/app/components/molecules/prayers/PadreNuestro.vue";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import OfficiumLectures from "@/modules/app/components/molecules/prayers/OfficiumLectures.vue";
import CustomPrayersBlock from "@/modules/app/components/organism/prayers/CustomPrayersBlock.vue";
import EvangeliumLecture from "@/modules/app/components/molecules/prayers/EvangeliumLecture.vue";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";

const laudesMultiple = ref<LaudesSchemaOutput[]>();
const selectedOption = ref<number>(0);
const isModalInvocationOpen = ref(false);
const settings = useSettingsStore().settings;

onMounted(async () => {
  await useBreviariumStore().getLaudes().then((data) => {
    laudesMultiple.value = data;
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