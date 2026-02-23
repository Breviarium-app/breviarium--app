<template>
  <PrayerPage :display-liturgical-info="true" title="Completas">

    <h4 class="title title-color">
      {{ formatText($t("initialInvocation")) }}
    </h4>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <div v-if="isLentCondition"
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
      <span v-if="isEasterCondition">Aleluya, aleluya, aleluya.</span>
      <span v-else v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>
    <span class="subtitle title-color cita"
          v-html="formatText(prayer?.primer_salmo_cita)"></span>
    <div v-html="formatText(prayer?.primer_salmo_texto)"></div>
    <p v-if="isEasterCondition && !prayer?.segundo_salmo_texto">
      <span class="title-color">Ant. </span>
      <span v-if="isEasterCondition && !prayer?.segundo_salmo_texto">Aleluya, aleluya, aleluya</span>
      <span v-else v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>
    <p v-if="!isEasterCondition">
      <span class="title-color">Ant. </span><span v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>
    <div v-if="prayer?.segundo_salmo_texto">
      <p v-if="!isEasterCondition">
        <span class="title-color">Ant. </span>
        <span v-html="formatText(prayer?.segundo_salmo_antifona)"></span>
      </p>
      <span class="subtitle title-color cita"
            v-html="formatText(prayer?.segundo_salmo_cita)"></span>
      <div v-html="formatText(prayer?.segundo_salmo_texto)"></div>
      <p v-if="!isEasterCondition">
        <span class="title-color">Ant. </span>
        <span v-html="formatText(prayer?.segundo_salmo_antifona)"></span>
      </p>
      <p v-if="isEasterCondition && prayer?.segundo_salmo_texto">
        <span class="title-color">Ant. </span>
        <span v-if="isEasterCondition">Aleluya, aleluya, aleluya</span>
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
      {{
        isTriduumCondition ? "Antífona" : (isInAlbisCondition ? "Antífona" : (isEasterCondition ? $t("responsory") : $t("responsory")))
      }}
    </h4>

    <div v-if="isTriduumCondition">
      <div class="responsorio" v-html="formatText(prayer?.antifona_triduo)"></div>
    </div>

    <div v-else-if="isInAlbisCondition">
      <div class="responsorio" v-html="formatText(prayer?.antifona_inalbis)"></div>
    </div>

    <div v-else-if="isEasterCondition">
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
    <NuncDimittis/>
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
      <ion-segment v-model="settingsStore.settings.latinPrayers" @ionChange="settingsStore.saveSettings()">
        <ion-segment-button value="es">
          <ion-label>Español</ion-label>
        </ion-segment-button>
        <ion-segment-button value="la">
          <ion-label>Latin</ion-label>
        </ion-segment-button>
      </ion-segment>
      <div class="segment-view prayer-content">
        <div v-if="selectedMaryAntiphonCode=='theHailMary'" id="theHailMary">
          <div v-if="settingsStore.settings.latinPrayers === 'es'" v-html="$t('theHailMary')"></div>
          <div v-else>
            Ave, María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui,
            Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc et in hora mortis nostræ. Amen.
          </div>
        </div>
        <div v-if="selectedMaryAntiphonCode=='motherOfTheRedeemer'" id="motherOfTheRedeemer">
          <div v-if="settingsStore.settings.latinPrayers === 'es'" v-html="$t('motherOfTheRedeemer')"></div>
          <div v-else>
            Alma Redemptóris Mater, quæ pérvia cæli porta manes, et stella maris, succúrre cadénti, súrgere qui curat,
            pópulo: tu quæ genuísti, natúra miránte, tuum sanctum Genitórem, Virgo prius ac postérius, Gabriélis ab ore
            sumens illud Ave, peccatórum miserére.
          </div>
        </div>
        <div v-if="selectedMaryAntiphonCode=='queenOfHeaven'" id="queenOfHeaven">
          <div v-if="settingsStore.settings.latinPrayers === 'es'" v-html="$t('queenOfHeaven')"></div>
          <div v-else>
            Ave, Regína cælórum, ave, Dómina Angelórum: Salve, radix, salve, porta, ex qua mundo lux est orta: Gaude,
            Virgo gloriósa, super omnes speciósa, vale, o valde decóra, et pro nobis Christum exóra.
          </div>
        </div>
        <div v-if="selectedMaryAntiphonCode=='toThyProtection'" id="toThyProtection">
          <div v-if="settingsStore.settings.latinPrayers === 'es'" v-html="$t('toThyProtection')"></div>
          <div v-else>
            Sub tuum præsídium confúgimus, sancta Dei Génetrix; nostras deprecatiónes ne despícias in necessitátibus,
            sed a perículis cunctis líbera nos semper, Virgo gloriósa et benedícta.
          </div>
        </div>
      </div>
    </div>

  </PrayerPage>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";
import {formatText} from "@/modules/app/constants/formatText.ts";
import type {CompletoriumSchemaOutput} from "breviarium";
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import NuncDimittis from "@/modules/app/components/molecules/prayers/NuncDimittis.vue";
import {isEaster, isInAlbis, isTodayLent, isTriduum} from "@/modules/app/constants/utils.ts";
import HymnComponent from "@/modules/app/components/molecules/prayers/HymnComponent.vue";
import {IonSegment, IonSegmentButton} from "@ionic/vue";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";


const prayer = ref<CompletoriumSchemaOutput>();
const selectedSegment = ref('firstFormula.body');

const settingsStore = useSettingsStore();

const selectedMaryAntiphonCode = ref<
    "theHailMary" | "motherOfTheRedeemer" | "queenOfHeaven" | "toThyProtection"
>("theHailMary");

const isEasterCondition = ref();
const isTriduumCondition = ref();
const isInAlbisCondition = ref();
const isLentCondition = ref();
useDateStore().updateDateParams()

onMounted(async () => {
  await useBreviariumStore().getCompletorium().then((data) => {
    prayer.value = data;
  }).catch(error => {
    console.error(error);
  });

  await isEaster().then(value => {
    isEasterCondition.value = value;
  });
  await isInAlbis().then(value => {
    isInAlbisCondition.value = value
  });
  await isTriduum().then(value => {
    isTriduumCondition.value = value
  });
  await isTodayLent().then(value => {
    isLentCondition.value = value
  });
});

</script>
<style lang="css" scoped>
.cita {
  text-align: center;
}

.segment-view {
  overflow-y: hidden; /* Prevent scrolling issues */
}

.prayer-content {
  padding-top: 1em;
}

</style>