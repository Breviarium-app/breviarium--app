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
      <i class="text-center cita">
        {{ formatText(lecturaTitulo) }}
      </i>
    </p>
    <p v-html="formatText(lecturaTexto)"></p>
    <br/>
    <p><span v-html="formatText(officium?.responsorio2[0])?.replace('℟.','℣.')"></span></p>
    <p><span v-html="formatText(officium?.responsorio2[0])?.replace('℣.','℟.')"></span></p>
    <p><span v-html="formatText(officium?.responsorio2[1])?.replace('℟.','℣.')"></span></p>
    <p><span v-html="formatText(officium?.responsorio2[2])?.replace('℣.','℟.')"></span></p>
  </div>

  <!--  &lt;!&ndash; Two reading options with info button &ndash;&gt;-->
  <!--  <div v-if="hasTwoReadings" class="selector-container">-->
  <!--    <breviarium-segment-->
  <!--        :value="selectedLectura"-->
  <!--        @update:value="onChangeLectura">-->
  <!--      <breviarium-segment-button :value="lecturaPar">-->
  <!--        <ion-label>{{ $t('ordinaryCycle') }}</ion-label>-->
  <!--      </breviarium-segment-button>-->
  <!--      <breviarium-segment-button :value="lecturaImpar">-->
  <!--        <ion-label>{{ $t('bienalCycle') }}</ion-label>-->
  <!--      </breviarium-segment-button>-->
  <!--    </breviarium-segment>-->
  <!--    <BreviariumSegmentButton class="segment-info-button" value="info" @click="() => isModalOpen = true">-->
  <!--      <strong> i </strong>-->
  <!--    </BreviariumSegmentButton>-->
  <!--  </div>-->

  <!--  <div v-if="hasTwoReadings">-->
  <!--    <p>-->
  <!--      {{ selectedLectura == lecturaPar ? lecturaCita[0]?.split("$")[0] : lecturaCita[1]?.split("$")[0] }}-->
  <!--    </p>-->
  <!--    <p class="title-color">-->
  <!--      <span class="reference-bible cita">-->
  <!--        {{ selectedLectura == lecturaPar ? lecturaCita[0]?.split("$")[1] : lecturaCita[1]?.split("$")[1] }}-->
  <!--      </span>-->
  <!--      <i class="text-center">-->
  <!--        {{ selectedLectura == lecturaPar ? formatText(lecturaTitulo[0]) : formatText(lecturaTitulo[1]) }}-->
  <!--      </i>-->
  <!--    </p>-->
  <!--    <div v-html="formattedLecturaTexto"></div>-->

  <!--    <p><br><br></p>-->
  <!--    <div v-if="hasTwoReadings && (selectedLectura == lecturaPar)">-->
  <!--      <p><span v-html="formatText(officium?.responsorio2[0])?.replace('℟.', '℣.')"></span></p>-->
  <!--      <p><span v-html="formatText(officium?.responsorio2[0])?.replace('℣.', '℟.')"></span></p>-->
  <!--      <p><span v-html="formatText(officium?.responsorio2[1])?.replace('℟.', '℣.')"></span></p>-->
  <!--      <p><span v-html="formatText(officium?.responsorio2[2])?.replace('℣.', '℟.')"></span></p>-->
  <!--    </div>-->
  <!--    <div v-if="hasTwoReadings && (selectedLectura == lecturaImpar)">-->
  <!--      <p><span v-html="formatText(officium?.responsorio2B[0])?.replace('℟.', '℣.')"></span></p>-->
  <!--      <p><span v-html="formatText(officium?.responsorio2B[0])?.replace('℣.', '℟.')"></span></p>-->
  <!--      <p><span v-html="formatText(officium?.responsorio2B[1])?.replace('℟.', '℣.')"></span></p>-->
  <!--      <p><span v-html="formatText(officium?.responsorio2B[2])?.replace('℣.', '℟.')"></span></p>-->
  <!--    </div>-->

  <!--    &lt;!&ndash;    <InfoModal v-model:isOpen="isModalOpen" :modalContent="infoModalContent"/>&ndash;&gt;-->
  <!--  </div>-->
</template>

<script lang="ts" setup>
import {computed, onBeforeMount, ref} from 'vue';
import {formatText} from "@/constants/formatText.ts";
import {OfficiumSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import Breviarium from "breviarium";


const officium = ref<OfficiumSchemaOutput>();
const lecturaCita = ref<string | undefined>()
const lecturaTitulo = ref<string | undefined>()
const lecturaTexto = ref<string | undefined>()
const hasTwoReadings = computed(() => officium.value?.lectura_biblica_cita.length === 2);

onBeforeMount(() => {
  const brev = new Breviarium();
  brev.getOfficium().then(data => {
    officium.value = data;

    lecturaCita.value = Array.isArray(officium.value?.lectura_biblica_cita) ? officium.value?.lectura_biblica_cita[0] : officium.value?.lectura_biblica_cita;
    lecturaTitulo.value = Array.isArray(officium.value?.lectura_biblica_titulo) ? officium.value?.lectura_biblica_titulo[0] : officium.value?.lectura_biblica_titulo;
    lecturaTexto.value = Array.isArray(officium.value?.lectura_biblica_texto) ? officium.value?.lectura_biblica_texto[0] : officium.value?.lectura_biblica_texto;
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
