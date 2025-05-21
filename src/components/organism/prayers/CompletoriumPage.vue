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

    <ion-segment v-model="selectedSegment">
      <ion-segment-button content-id="firstFormula.body" value="firstFormula.body">
        <ion-label>{{ $t("firstFormula.title") }}</ion-label>
      </ion-segment-button>
      <ion-segment-button content-id="secondFormula.body" value="secondFormula.body">
        <ion-label>{{ $t("secondFormula.title") }}</ion-label>
      </ion-segment-button>
      <ion-segment-button content-id="thirdFormula.body" value="thirdFormula.body">
        <ion-label>{{ $t("thirdFormula.title") }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <div class="segment-view">
      <div v-if="selectedSegment === 'firstFormula.body'">
        <div v-html="formatText($t('firstFormula.body'))"></div>
      </div>
      <div v-if="selectedSegment === 'secondFormula.body'">
        <div v-html="formatText($t('secondFormula.body'))"></div>
      </div>
      <div v-if="selectedSegment === 'thirdFormula.body'">
        <div v-html="formatText($t('thirdFormula.body'))"></div>
      </div>
    </div>

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

    <div v-if="isTriduum()">
      <div class="responsorio" v-html="formatText(prayer?.antifona_triduo)"></div>
    </div>

    <div v-else-if="isInAlbis()">
      <div class="responsorio" v-html="formatText(prayer?.antifona_inalbis)"></div>
    </div>

    <div v-else-if="isEaster()">
      <div v-for="item in prayer?.responsorio_pascua" v-bind:key="item">
        <div class="responsorio" v-html="formatText(item)"></div>
      </div>
    </div>

    <div v-else>
      <div v-for="item in prayer?.responsorio" v-bind:key="item">
        <div class="responsorio" v-html="formatText(item)"></div>
      </div>
    </div>


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
      <CrossComponent/>
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
      <ion-segment v-model="selectedMaryAntiphonCode">
        <ion-segment-button content-id="theHailMary" value="theHailMary">
          <ion-label>{{ $t("firstFormulaMaryAntiphon") }}</ion-label>
        </ion-segment-button>
        <ion-segment-button content-id="motherOfTheRedeemer" value="motherOfTheRedeemer">
          <ion-label>{{ $t("secondFormulaMaryAntiphon") }}</ion-label>
        </ion-segment-button>
        <ion-segment-button content-id="queenOfHeaven" value="queenOfHeaven">
          <ion-label>{{ $t("thirdFormulaMaryAntiphon") }}</ion-label>
        </ion-segment-button>
        <ion-segment-button content-id="toThyProtection" value="toThyProtection">
          <ion-label>{{ $t("fourthFormulaMaryAntiphon") }}</ion-label>
        </ion-segment-button>
      </ion-segment>
      <div class="segment-view">
        <div v-if="selectedMaryAntiphonCode=='theHailMary'" id="theHailMary">
          <div v-html="$t('theHailMary')"></div>
        </div>
        <div v-if="selectedMaryAntiphonCode=='motherOfTheRedeemer'" id="motherOfTheRedeemer">
          <div v-html="$t('motherOfTheRedeemer')"></div>
        </div>
        <div v-if="selectedMaryAntiphonCode=='queenOfHeaven'" id="queenOfHeaven">
          <div v-html="$t('queenOfHeaven')"></div>
        </div>
        <div v-if="selectedMaryAntiphonCode=='toThyProtection'" id="toThyProtection">
          <div v-html="$t('toThyProtection')"></div>
        </div>
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
import {IonSegment, IonSegmentButton} from "@ionic/vue";
import {useDateStore} from "@/stores/useDateStore.ts";


const prayer = ref<CompletoriumSchemaOutput>();
const selectedSegment = ref('firstFormula.body');

const selectedMaryAntiphonCode = ref<
    "theHailMary" | "motherOfTheRedeemer" | "queenOfHeaven" | "toThyProtection"
>("theHailMary");


onMounted(async () => {
  const brev = new Breviarium(useDateStore().getCurrentDate);
  await brev.getCompletorium().then((data) => {
    console.log("getCompletorium", data);
    prayer.value = data;
  }).catch(error => {
    console.error(error);
  })

});

</script>
<style lang="css" scoped>
.cita {
  text-align: center;
}

.segment-view {
  overflow-y: hidden; /* Prevent scrolling issues */
}

</style>