<template>
  <PrayerPage :display-liturgical-info="true" title="Vísperas">
    <div v-if="prayerMultiple && prayerMultiple?.length > 1">
      <ion-segment v-model="selectedOption">
        <ion-segment-button :value="0">
          <ion-label>Memoria</ion-label>
        </ion-segment-button>
        <ion-segment-button :value="1">
          <ion-label>Feria</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>
    <div v-for="(prayer, index) in prayerMultiple">
      <div v-if="selectedOption == index">
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
        <span class="title-color cita" v-html="formatText(prayer?.primer_salmo_cita)"></span>
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
        <span class="title-color cita"
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
        <span class="title-color cita" v-html="formatText(prayer?.tercer_salmo_cita)"></span>

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

        <div
            v-for="(item, index) in prayer?.preces_contenido.slice(0, -1)"
            :key="`preces-${index}`"
            class="preces"
        >
          <p v-html="formatPrayers(item)"></p>
        </div>

        <div class="preces">
          <p class="title-color">{{ $t('explanationPreces') }}</p>
        </div>

        <CustomPrayersBlock/>

        <div
            v-if="prayer?.preces_contenido?.length"
            class="preces"
        >
          <p v-html="formatPrayers(prayer.preces_contenido[prayer.preces_contenido.length - 1])"></p>
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

      </div>
    </div>

  </PrayerPage>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";
import {formatPrayers, formatText} from "@/modules/app/constants/formatText.ts";
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import type {VesperaeSchemaOutput} from "breviarium/dist/prayer-manager-interface.d.ts";
import PadreNuestro from "@/modules/app/components/molecules/prayers/PadreNuestro.vue";
import {IonLabel, IonSegment, IonSegmentButton, IonText} from "@ionic/vue";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import OfficiumLectures from "@/modules/app/components/molecules/prayers/OfficiumLectures.vue";
import MagnificatPrayer from "@/modules/app/components/molecules/prayers/MagnificatPrayer.vue";
import HymnComponent from "@/modules/app/components/molecules/prayers/HymnComponent.vue";
import CustomPrayersBlock from "@/modules/app/components/organism/prayers/CustomPrayersBlock.vue";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";

const isModalInvocationOpen = ref(false);
const settings = useSettingsStore().settings;
const prayerMultiple = ref<VesperaeSchemaOutput[]>();
const selectedOption = ref<number>(0);
useDateStore().updateDateParams()

onMounted(async () => {
  await useBreviariumStore().getVesperae().then((data) => {
    prayerMultiple.value = data;
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