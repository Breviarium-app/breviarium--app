<template>
  <!-- Only one reading option -->
  <div v-if="!hasTwoReadings">
    <p>
      {{ lecturaCita?.split("$")[0] }}
    </p>
    <p class="title-color">
      <span class="reference-bible cita">
        {{ lecturaCita?.split("$")[1] }}
      </span>
      <i class="text-center cita" v-html=" formatText(lecturaTitulo)">
      </i>
    </p>
    <p v-html="formatText(lecturaTexto)"></p>
    <br/>
    <p><span v-html="formatText(officium?.responsorio3[0])?.replace('℟.','℣.')"></span></p>
    <p><span v-html="formatText(officium?.responsorio3[0])?.replace('℣.','℟.')"></span></p>
    <p><span v-html="formatText(officium?.responsorio3[1])?.replace('℟.','℣.')"></span></p>
    <p><span v-html="formatText(officium?.responsorio3[2])?.replace('℣.','℟.')"></span></p>
  </div>
  <div v-else>
    <ion-segment v-model="selectedInvitatorium">
      <ion-segment-button value="ordinary">
        <ion-label>{{ $t('ordinaryCycle') }}</ion-label>
      </ion-segment-button>
      <ion-segment-button value="bienal">
        <ion-label>{{ $t('bienalCycle') }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <div>
      <div v-if="selectedInvitatorium == 'ordinary'">
        <div class="title-color" v-html="formatText(officium?.lectura_patristica_cita[0])"></div>
        <div class="title-color" v-html="formatText(officium?.lectura_patristica_titulo[0])"></div>
        <div v-html="formatText(officium?.lectura_patristica_texto[0])"></div>
        <div class="title-color" v-html="formatTextLecture(officium?.lectura_patristica_titulo[0].split('$')[2])"></div>
        <br/>
        <p><span v-html="formatText(officium?.responsorio3[0])?.replace('℟.','℣.')"></span></p>
        <p><span v-html="formatText(officium?.responsorio3[0])?.replace('℣.','℟.')"></span></p>
        <p><span v-html="formatText(officium?.responsorio3[1])?.replace('℟.','℣.')"></span></p>
        <p><span v-html="formatText(officium?.responsorio3[2])?.replace('℣.','℟.')"></span></p>
      </div>
      <div v-if="selectedInvitatorium == 'bienal'">
        <div class="title-color" v-html="formatText(officium?.lectura_patristica_cita[1])"></div>
        <div class="title-color" v-html="formatText(officium?.lectura_patristica_titulo[1])"></div>
        <div v-html="formatText(officium?.lectura_patristica_texto[1])"></div>
        <div class="title-color" v-html="formatTextLecture(officium?.lectura_patristica_titulo[1].split('$')[2])"></div>

        <br/>
        <p><span v-html="formatText(officium?.responsorio3B[0])?.replace('℟.','℣.')"></span></p>
        <p><span v-html="formatText(officium?.responsorio3B[0])?.replace('℣.','℟.')"></span></p>
        <p><span v-html="formatText(officium?.responsorio3B[1])?.replace('℟.','℣.')"></span></p>
        <p><span v-html="formatText(officium?.responsorio3B[2])?.replace('℣.','℟.')"></span></p>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';
import {formatText, formatTextLecture} from "@/constants/formatText.ts";
import {OfficiumSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import Breviarium from "breviarium";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import {useDateStore} from "@/stores/useDateStore.ts";

const officium = ref<OfficiumSchemaOutput>();
const lecturaCita = ref<string | undefined>()
const lecturaTitulo = ref<string | undefined>()
const lecturaTexto = ref<string | undefined>()
const hasTwoReadings = computed(() => officium.value?.lectura_patristica_cita.length === 2);
const selectedInvitatorium = ref("ordinary");

onMounted(async () => {
  const brev = new Breviarium(useDateStore().getCurrentDate);
  await brev.getOfficium().then(data => {
    officium.value = data;

    lecturaCita.value = Array.isArray(officium.value?.lectura_patristica_cita) ? officium.value?.lectura_patristica_cita[0] : officium.value?.lectura_patristica_cita;
    lecturaTitulo.value = Array.isArray(officium.value?.lectura_patristica_titulo) ? officium.value?.lectura_patristica_titulo[0] : officium.value?.lectura_patristica_titulo;
    lecturaTexto.value = Array.isArray(officium.value?.lectura_patristica_texto) ? officium.value?.lectura_patristica_texto[0] : officium.value?.lectura_patristica_texto;
  });
});


// const lecturaPar = "PAR";
// const lecturaImpar = "IMPAR";
// // const selectedLectura = ref(hasTwoReadings.value ? (dateStore.isEvenYear ? lecturaPar : lecturaPar) : lecturaPar);
//
// const isModalOpen = ref(false);
// // const infoModalContent = ref(t('bienalExplanation'));
//
// const onChangeLectura = (event: any): void => {
//   // selectedLectura.value = event;
// };
//
// const formattedLecturaTexto = computed(() => {
//   const text = selectedLectura.value === lecturaPar ? formatText(lecturaTexto.value[0]) : formatText(lecturaTexto.value[1]);
//   return `<p>${text}</p>`;
// });


</script>

<style scoped>
</style>
