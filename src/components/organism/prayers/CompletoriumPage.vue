<template>
  <PrayerPage title="Completas">

    <h4 class="title title-color">
      {{ formatText($t("initialInvocation")) }}
    </h4>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>

    </p>
    <div v-if="isTodayLent()"
         v-html="formatText($t('initialInvocationBodyLent'))"></div>
    <div v-else
         v-html="formatText($t('initialInvocationBody'))"></div>

    <h4 class="title title-color">
      {{ formatText($t("examinationOfConscience")) }}
    </h4>
    <div v-html="formatText($t('examinationOfConscienceBody'))"></div>

    <breviarium-segment
        :value="selectedFormula"
        @update:value="onChangeFormula($event)">
      <breviarium-segment-button value="firstFormula.body">
        <ion-label>{{ $t("firstFormula.title") }}</ion-label>
      </breviarium-segment-button>
      <breviarium-segment-button value="secondFormula.body">
        <ion-label>{{ $t("secondFormula.title") }}</ion-label>
      </breviarium-segment-button>
      <breviarium-segment-button value="thirdFormula.body">
        <ion-label>{{ $t("thirdFormula.title") }}</ion-label>
      </breviarium-segment-button>
    </breviarium-segment>

    <p v-html="formatText($t(selectedFormula))"></p>
    <p v-html="formatText($t('complineCommonPresidentPrayer'))"></p>

    <HymnComponent :text="prayer?.himno"/>

    <h4 class="title title-color">{{ $t('salmodia') }}</h4>

    <p>
      <span class="title-color">Ant. </span>
      <span v-if="isEaster()">Aleluya, aleluya, aleluya.</span>
      <span v-else v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>
    <span class="subtitle title-color cita"
          v-html="formatText(prayer?.primer_salmo_cita)"></span>
    <div v-html="formatText(prayer?.primer_salmo_texto)"></div>
    <p v-if="isEaster() && !prayer?.segundo_salmo_texto">
      <span class="title-color">Ant. </span>
      <span v-if="isEaster() && !prayer?.segundo_salmo_texto">Aleluya, aleluya, aleluya</span>
      <span v-else v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>
    <p v-if="!isEaster()">
      <span class="title-color">Ant. </span><span v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>
    <div v-if="prayer?.segundo_salmo_texto">
      <p v-if="!isEaster()">
        <span class="title-color">Ant. </span>
        <span v-html="formatText(prayer?.segundo_salmo_antifona)"></span>
      </p>
      <span class="subtitle title-color cita"
            v-html="formatText(prayer?.segundo_salmo_cita)"></span>
      <div v-html="formatText(prayer?.segundo_salmo_texto)"></div>
      <p v-if="!isEaster()">
        <span class="title-color">Ant. </span>
        <span v-html="formatText(prayer?.segundo_salmo_antifona)"></span>
      </p>
      <p v-if="isEaster() && prayer?.segundo_salmo_texto">
        <span class="title-color">Ant. </span>
        <span v-if="isEaster()">Aleluya, aleluya, aleluya</span>
        <span v-else v-html="formatText(prayer?.primer_salmo_antifona)"></span>
      </p>
    </div>

    <h4 class="title title-color">
      {{ $t("briefReading") }}
    </h4>
    <div class="reference-bible title-color cita"
         v-html="formatText(prayer?.lectura_biblica_cita)"></div>
    <div v-html="formatText(prayer?.lectura_biblica_texto)"></div>

    <h4 class="title title-color">
      {{ isTriduum() ? "Antífona" : (isInAlbis() ? "Antífona" : (isEaster() ? $t("responsory") : $t("responsory"))) }}
    </h4>

    <span v-if="isTriduum()">
          <div class="responsorio" v-html="formatText(prayer?.antifona_triduo)"></div>
        </span>

    <span v-else-if="isInAlbis()">
          <div class="responsorio" v-html="formatText(prayer?.antifona_inalbis)"></div>
        </span>

    <span v-else-if="isEaster()">
          <span v-for="item in prayer?.responsorio_pascua" v-bind:key="item">
            <div class="responsorio" v-html="formatText(item)"></div>
          </span>
        </span>

    <span v-else>
          <span v-for="item in prayer?.responsorio" v-bind:key="item">
            <div class="responsorio" v-html="formatText(item)"></div>
          </span>
        </span>


    <h4 class="title title-color">
      {{ $t("evangelicalCanticle") }}
    </h4>
    <p>
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.cantico_evangelico_antifona)"></span>
    </p>

    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <div v-html="formatText($t('luc2'))">
    </div>
    <p>
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.cantico_evangelico_antifona)"></span>
    </p>

    <h4 class="title title-color">
      {{ $t("oratio") }}
    </h4>

    <p>
      <span class="title-color">℣. </span>
      <span v-html="formatText(prayer?.final)"></span>
    </p>

    <p><span class="title-color">℟. </span>Amén.</p>

    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <Cross/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <div v-html="formatText($t('complineFinalPrayer'))"></div>
    <div v-if="isEaster()">
      <h4 class="title title-color">
        {{ $t("complineFinalAntiphonReginaCoeli") }}
      </h4>
      <p>
        <span class="text-red">℣.</span> {{ $t('firstVersiculumReginaCoeli') }}<br/>
        <span class="text-red">℟.</span> {{ $t('firstResponsioReginaCoeli') }}
      </p>

      <p>
        <span class="text-red">℣.</span> {{ $t('secondVersiculumReginaCoeli') }}<br/>
        <span class="text-red">℟.</span> {{ $t('secondResponsioReginaCoeli') }}
      </p>

      <p>
        <span class="text-red">℣.</span> {{ $t('thirdVersiculumReginaCoeli') }}<br/>
        <span class="text-red">℟.</span> {{ $t('thirdResponsioReginaCoeli') }}
      </p>
    </div>

    <!-- Mary Antiphon -->
    <div>
      <p class="title-color text-center">
        {{ $t("complineMarianPrayers") }}
      </p>
      <breviarium-segment
          :value="selectedMaryAntiphonCode"
          @update:value="onChangeMaryAntiphon($event)">
        <breviarium-segment-button value="theHailMary">
          <ion-label>{{ $t("firstFormulaMaryAntiphon") }}</ion-label>
        </breviarium-segment-button>
        <breviarium-segment-button value="motherOfTheRedeemer">
          <ion-label>{{ $t("secondFormulaMaryAntiphon") }}</ion-label>
        </breviarium-segment-button>
        <breviarium-segment-button value="queenOfHeaven">
          <ion-label>{{ $t("thirdFormulaMaryAntiphon") }}</ion-label>
        </breviarium-segment-button>
        <breviarium-segment-button value="toThyProtection">
          <ion-label>{{ $t("fourthFormulaMaryAntiphon") }}</ion-label>
        </breviarium-segment-button>
      </breviarium-segment>
      <div class="maryAntiphon">
        <div v-html="maryAntiphon"></div>
      </div>
    </div>

  </PrayerPage>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PrayerPage from "@/components/organism/PrayerPage.vue";
import {formatText} from "@/constants/formatText.ts";
import {CompletoriumSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import Breviarium from "breviarium";
import CrossComponent from "@/components/molecules/prayers/CrossComponent.vue";
import {isEaster, isInAlbis, isTodayLent, isTriduum} from "@/constants/utils.ts";
import HymnComponent from "@/components/molecules/prayers/HymnComponent.vue";
import BreviariumSegment from "@/components/molecules/prayers/BreviariumSegment.vue";
import BreviariumSegmentButton from "@/components/molecules/prayers/BreviariumSegmentButton.vue";
import {useI18n} from "vue-i18n"; // Import useI18n
const {t} = useI18n(); // Get the t function from useI18n

const prayer = ref<CompletoriumSchemaOutput>();

const selectedFormula = ref<
    "firstFormula.body" | "secondFormula.body" | "thirdFormula.body"
>("firstFormula.body");

const selectedMaryAntiphonCode = ref<
    "theHailMary" | "motherOfTheRedeemer" | "queenOfHeaven" | "toThyProtection"
>("theHailMary");

let maryAntiphon = formatText(t(selectedMaryAntiphonCode.value));

const onChangeFormula = (event: any) => {
  selectedFormula.value = event;
};

const onChangeMaryAntiphon = (event: any) => {
  selectedMaryAntiphonCode.value = event;
  maryAntiphon = formatText(t(selectedMaryAntiphonCode.value));
};

onMounted(async () => {
  const brev = new Breviarium();
  await brev.getCompletorium().then((data) => {
    console.log(data)
    prayer.value = data;
  })

});

</script>
<style lang="css" scoped>
.cita {
  text-align: center;
}

</style>