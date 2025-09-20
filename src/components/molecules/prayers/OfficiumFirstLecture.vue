<template>
  <div>
    <ion-segment v-model="selectedCycle">
      <ion-segment-button value="ordinary">
        <ion-label>{{ $t('ordinaryCycle') }}</ion-label>
      </ion-segment-button>
      <ion-segment-button value="bienal">
        <ion-label>{{ $t('bienalCycle') }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <div>
      <div v-if="selectedCycle == 'ordinary'">
        <p>
          {{ officium?.lectura_biblica_cita_a?.split("$")[0] }}
        </p>
        <p class="title-color">
      <span class="reference-bible cita">
        {{ officium?.lectura_biblica_cita_a?.split("$")[1] }}
      </span>
          <i class="text-center cita">
            {{ formatText(officium?.lectura_biblica_titulo_a) }}
          </i>
        </p>
        <p v-html="formatText(officium?.lectura_biblica_texto_a)"></p>
        <br/>
        <p><span v-html="formatText(officium?.responsorio2_a[0])?.replace('℟.','℣.')"></span></p>
        <p><span v-html="formatText(officium?.responsorio2_a[0])?.replace('℣.','℟.')"></span></p>
        <p><span v-html="formatText(officium?.responsorio2_a[1])?.replace('℟.','℣.')"></span></p>
        <p><span v-html="formatText(officium?.responsorio2_a[2])?.replace('℣.','℟.')"></span></p>
      </div>
      <div v-if="selectedCycle == 'bienal'">
        <div v-if="true">
          <p>
            {{ officium?.lectura_biblica_cita_i?.split("$")[0] }}
          </p>
          <p class="title-color">
          <span class="reference-bible cita">
          {{ officium?.lectura_biblica_cita_i?.split("$")[1] }}
          </span>
            <i class="text-center cita">
              {{ formatText(officium?.lectura_biblica_titulo_i) }}
            </i>
          </p>
          <p v-html="formatText(officium?.lectura_biblica_texto_i)"></p>
          <br/>
          <p><span v-html="formatText(officium?.responsorio2_i[0])?.replace('℟.','℣.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio2_i[0])?.replace('℣.','℟.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio2_i[1])?.replace('℟.','℣.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio2_i[2])?.replace('℣.','℟.')"></span></p>
        </div>
        <div v-else>
          <p>
            {{ officium?.lectura_biblica_cita_p?.split("$")[0] }}
          </p>
          <p class="title-color">
          <span class="reference-bible cita">
          {{ officium?.lectura_biblica_cita_p?.split("$")[1] }}
          </span>
            <i class="text-center cita">
              {{ formatText(officium?.lectura_biblica_titulo_p) }}
            </i>
          </p>
          <p v-html="formatText(officium?.lectura_biblica_texto_p)"></p>
          <br/>
          <p><span v-html="formatText(officium?.responsorio2_p[0])?.replace('℟.','℣.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio2_p[0])?.replace('℣.','℟.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio2_p[1])?.replace('℟.','℣.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio2_p[2])?.replace('℣.','℟.')"></span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {formatText} from "@/constants/formatText.ts";
import {OfficiumSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import {useBreviariumStore} from "@/stores/breviarium.ts";

const officium = ref<OfficiumSchemaOutput>();
// const lecturaCita = ref<string | undefined>()
// const lecturaTitulo = ref<string | undefined>()
// const lecturaTexto = ref<string | undefined>()
// const hasTwoReadings = computed(() => officium.value?.lectura_biblica_cita.length === 2);
const selectedCycle = ref("ordinary");

onMounted(async () => {
  await useBreviariumStore().getOfficium().then(data => {
    officium.value = data;
    console.log("officium", officium.value)
    // lecturaCita.value = Array.isArray(officium.value?.lectura_biblica_cita) ? officium.value?.lectura_biblica_cita[0] : officium.value?.lectura_biblica_cita;
    // lecturaTitulo.value = Array.isArray(officium.value?.lectura_biblica_titulo) ? officium.value?.lectura_biblica_titulo[0] : officium.value?.lectura_biblica_titulo;
    // lecturaTexto.value = Array.isArray(officium.value?.lectura_biblica_texto) ? officium.value?.lectura_biblica_texto[0] : officium.value?.lectura_biblica_texto;
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
