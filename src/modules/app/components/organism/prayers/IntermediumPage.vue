<template>
  <PrayerPage :display-liturgical-info="true" :title="props.prayerTitle">
    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <span v-if="isTodayLentCondition"
          v-html="formatText($t('initialInvocationBodyLent'))"></span>
    <span v-else
          v-html="formatText($t('initialInvocationBody'))"></span>

    <HymnComponent :text="prayer?.himno"/>

    <h4 class="title title-color">{{ $t('salmodia') }}</h4>

    <p>
      <span class="title-color">Ant. 1. </span>
      <span v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>
    <span class="title-color cita"
          v-html="formatText(prayer?.primer_salmo_cita)"></span>
    <p v-html="formatText(prayer?.primer_salmo_texto)"></p>
    <p v-if="prayer?.segundo_salmo_antifona && isOrdinaryTimeCondition">
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>
    <p v-if="prayer?.segundo_salmo_antifona && isOrdinaryTimeCondition">
      <span class="title-color">Ant. 2. </span>
      <span v-html="formatText(prayer?.segundo_salmo_antifona)"></span>
    </p>
    <span class="title-color cita"
          v-html="formatText(prayer?.segundo_salmo_cita)"></span>
    <p v-html="formatText(prayer?.segundo_salmo_texto)"></p>
    <p v-if="prayer?.segundo_salmo_antifona && isOrdinaryTimeCondition">
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.segundo_salmo_antifona)"></span>
    </p>
    <p v-if="prayer?.tercer_salmo_antifona && isOrdinaryTimeCondition">
      <span class="title-color">Ant. 3. </span>
      <span v-html="formatText(prayer?.tercer_salmo_antifona)"></span>
    </p>
    <span class="title-color cita"
          v-html="formatText(prayer?.tercer_salmo_cita)"></span>
    <p v-html="formatText(prayer?.tercer_salmo_texto)"></p>
    <p v-if="prayer?.tercer_salmo_antifona && isOrdinaryTimeCondition">
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.tercer_salmo_antifona)"></span>
    </p>
    <p v-if="!prayer?.tercer_salmo_antifona || !isOrdinaryTimeCondition">
      <span class="title-color">Ant. </span>
      <span v-html="formatText(prayer?.primer_salmo_antifona)"></span>
    </p>

    <h4 class="title title-color">{{ $t('lectioBrevis') }}</h4>
    <ion-text>
      <ion-label class="reference-bible title-color cita">
        <span v-html="formatText(prayer?.lectura_biblica_cita)"></span>
      </ion-label>
      <p v-html="formatText(prayer?.lectura_biblica)"></p>
    </ion-text>
    <div v-for="item in prayer?.responsorios"
         v-bind:key="item">
      <p v-html="formatText(item)"></p>
    </div>

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
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";
import {formatText} from "@/modules/app/constants/formatText.ts";
import type {IntermediateSchemaOutput} from "breviarium";
import Breviarium from "breviarium";
import {IonLabel, IonText} from "@ionic/vue";
import HymnComponent from "@/modules/app/components/molecules/prayers/HymnComponent.vue";
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import {isOrdinaryTime, isTodayLent} from "@/modules/app/constants/utils.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";

const prayer = ref<IntermediateSchemaOutput>();
const isOrdinaryTimeCondition = ref()
const isTodayLentCondition = ref()

const props = defineProps({
  prayerTitle: {
    type: String,
    required: true
  },
})
useDateStore().updateDateParams()

onMounted(async () => {
  const brev = new Breviarium(useDateStore().getCurrentDate);

  if (props.prayerTitle.toLowerCase() == 'tercia') {
    await brev.getTertia().then((data: any) => {
      prayer.value = data;
    })
  }
  if (props.prayerTitle.toLowerCase() == 'sexta') {
    await brev.getSexta().then((data: any) => {
      prayer.value = data;
    })
  }
  if (props.prayerTitle.toLowerCase() == 'nona') {
    await brev.getNona().then((data: any) => {
      prayer.value = data;
    })
  }

  await isOrdinaryTime().then((data) => {
    isOrdinaryTimeCondition.value = data;
  })
  await isTodayLent().then((data) => {
    isTodayLentCondition.value = data;
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