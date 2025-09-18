<template>
  <!-- Only one reading option -->
  <div v-if="!false">
    <p>
      {{ officium?.lectura_patristica_cita_a?.split("$")[0] }}
    </p>
    <p class="title-color">
      <span class="reference-bible cita">
        {{ officium?.lectura_patristica_cita_a?.split("$")[1] }}
      </span>
      <i class="text-center cita">
        {{ formatText(officium?.lectura_patristica_titulo_a) }}
      </i>
    </p>
    <p v-html="formatText(officium?.lectura_patristica_texto_a)"></p>
    <br/>
    <p><span v-html="formatText(officium?.responsorio3_a[0])?.replace('℟.','℣.')"></span></p>
    <p><span v-html="formatText(officium?.responsorio3_a[0])?.replace('℣.','℟.')"></span></p>
    <p><span v-html="formatText(officium?.responsorio3_a[1])?.replace('℟.','℣.')"></span></p>
    <p><span v-html="formatText(officium?.responsorio3_a[2])?.replace('℣.','℟.')"></span></p>
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
import {onMounted, ref} from 'vue';
import {formatText, formatTextLecture} from "@/constants/formatText.ts";
import {OfficiumSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import {useBreviariumStore} from "@/stores/breviarium.ts";

const officium = ref<OfficiumSchemaOutput>();
// const lecturaCita = ref<string | undefined>()
// const lecturaTitulo = ref<string | undefined>()
// const lecturaTexto = ref<string | undefined>()
// const hasTwoReadings = computed(() => officium.value?.lectura_patristica_cita.length === 2);
const selectedInvitatorium = ref("ordinary");

onMounted(async () => {
  await useBreviariumStore().getOfficium().then(data => {
    officium.value = data;

    // lecturaCita.value = Array.isArray(officium.value?.lectura_patristica_cita) ? officium.value?.lectura_patristica_cita[0] : officium.value?.lectura_patristica_cita;
    // lecturaTitulo.value = Array.isArray(officium.value?.lectura_patristica_titulo) ? officium.value?.lectura_patristica_titulo[0] : officium.value?.lectura_patristica_titulo;
    // lecturaTexto.value = Array.isArray(officium.value?.lectura_patristica_texto) ? officium.value?.lectura_patristica_texto[0] : officium.value?.lectura_patristica_texto;
    // console.log("lecturaCita", lecturaCita.value)
    // console.log("lecturaTitulo", lecturaTitulo.value)
  });
});


</script>

<style scoped>
</style>
