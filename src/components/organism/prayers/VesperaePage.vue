<template>
  <PrayerPage title="Vísperas">
    <h4 class="title title-color">{{ $t('initialInvocation') }}</h4>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center"
       @click="() => isModalInvocationOpen = true">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <!-- dateStore.isTodayLent -->
    <span v-if="false" v-html="formatText($t('initialInvocationBodyLent'))"></span>
    <span v-else v-html="formatText($t('initialInvocationBody'))"></span>

    <HymnComponent :text="prayer?.himno"/>

    <h4 class="title title-color">{{ $t('salmodia') }}</h4>

    <p>
      <span class="title-color">Ant. 1. </span>
      <span v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>
    <span class="subtitle title-color cita" v-html="formatText(prayer?.primer_salmo_cita)"></span>
    <p v-html="formatText(prayer?.primer_salmo_texto)"></p>
    <p>
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>

    <p>
      <span class="title-color">Ant. 2. </span>
      <span v-html="formatText(prayer?.segundo_salmo_antifona)"></span>
    </p>
    <p></p>
    <span class="subtitle title-color cita"
          v-html="formatText(prayer?.segundo_salmo_cita)"></span>
    <p v-html="formatText(prayer?.segundo_salmo_texto)"></p>
    <p>
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.segundo_salmo_antifona)"></span>
    </p>

    <p>
      <span class="title-color">Ant. 3. </span>
      <span v-html="formatText(prayer?.tercer_salmo_antifona)"></span>
    </p>
    <p></p>
    <span class="subtitle title-color cita" v-html="formatText(prayer?.tercer_salmo_cita)"></span>

    <p v-html="formatText(prayer?.tercer_salmo_texto)"></p>

    <p>
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.tercer_salmo_antifona)"></span>
    </p>

    <h4 class="title title-color">{{ $t('lectioBrevis') }}</h4>
    <ion-text>
      <ion-label class="reference-bible title-color cita">
        <span v-html="formatText(prayer?.lectura_biblica_cita)"></span>
      </ion-label>
      <p v-html="formatText(prayer?.lectura_biblica)"></p>

    </ion-text>
    <h4 class="title title-color">{{ $t('responsory') }}</h4>
    <div v-for="item in prayer?.responsorios"
         v-bind:key="item">
      <p v-html="formatText(item)"></p>
    </div>
    <!------ OFICIO DE LECTURA (opcional) ------>
    <div v-if="settings.vesperaeOfficium">
      <OfficiumLectures/>
    </div>

    <h4 class="title title-color">{{ $t('canticumEvangelicum') }}</h4>
    <p>
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.cantico_evangelico_antifona)"></span>
    </p>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <MagnificatPrayer/>
    <p>
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.cantico_evangelico_antifona)"></span>
    </p>

    <h4 class="title title-color">{{ $t('preces') }}</h4>
    <p v-html="formatText(prayer?.preces_intro)"></p>
    <p v-html="formatText(prayer?.preces_respuesta)"></p>
    <div v-for="item in prayer?.preces_contenido"
         v-bind:key="item" class="preces">
      <p v-html="formatText(item)"></p>
    </div>

    <div class="preces">
      <p class="title-color">{{ $t('explanationPreces') }}</p>
    </div>

    <h4 class="title title-color">{{ $t('ourLord') }}</h4>
    <p class="margin-y-md">
      <ion-label class="title-color"> ℣.</ion-label>
      <span v-html="formatText(prayer?.invitacion_padrenuestro)"></span>
    </p>
    <PadreNuestro/>

    <h4 class="title title-color">{{ $t('oratio') }}</h4>
    <p>
      <span class="title-color">℣. </span>
      <span v-html="formatText(prayer?.oracion_final)"></span>
    </p>
    <p>
      <span class="title-color">℟. </span>Amén.</p>

    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <p>
      <ion-label class="title-color"> ℣.</ion-label>
      {{ $t('finalVersiculumLaudes') }}
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
import {formatText} from "@/constants/formatText.ts";
import CrossComponent from "@/components/molecules/prayers/CrossComponent.vue";
import {LaudesSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import PadreNuestro from "@/components/molecules/prayers/PadreNuestro.vue";
import {IonLabel, IonText} from "@ionic/vue";
import {useSettingsStore} from "@/stores/settingsStore.ts";
import Breviarium from "breviarium";
import OfficiumLectures from "@/components/molecules/prayers/OfficiumLectures.vue";
import MagnificatPrayer from "@/components/molecules/prayers/MagnificatPrayer.vue";
import HymnComponent from "@/components/molecules/prayers/HymnComponent.vue";

const prayer = ref<LaudesSchemaOutput>();
const isModalInvocationOpen = ref(false);
const settings = useSettingsStore().settings;

onMounted(async () => {
  const brev = new Breviarium();
  await brev.getVesperae().then((data) => {
    prayer.value = data;
  })

});

</script>
<style lang="css" scoped>
.cita {
  text-align: center;
}

.reference-bible {
  text-align: right;
}
</style>