<template>
  <!-- Only one reading option -->

  <div>
    <ion-segment v-model="selectedCycle" class="office-lecture-selector">
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
      <div v-if="selectedCycle == 'bienal'">
        <div v-if="true">
          <p>
            {{ officium?.lectura_patristica_cita_i?.split("$")[0] }}
          </p>
          <p class="title-color">
          <span class="reference-bible cita">
          {{ officium?.lectura_patristica_cita_i?.split("$")[1] }}
          </span>
            <i class="text-center cita">
              {{ formatText(officium?.lectura_patristica_titulo_i) }}
            </i>
          </p>
          <p v-html="formatText(officium?.lectura_patristica_texto_i)"></p>
          <br/>
          <p><span v-html="formatText(officium?.responsorio3_i[0])?.replace('℟.','℣.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio3_i[0])?.replace('℣.','℟.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio3_i[1])?.replace('℟.','℣.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio3_i[2])?.replace('℣.','℟.')"></span></p>
        </div>
        <div v-else>
          <p>
            {{ officium?.lectura_patristica_cita_p?.split("$")[0] }}
          </p>
          <p class="title-color">
          <span class="reference-bible cita">
          {{ officium?.lectura_patristica_cita_p?.split("$")[1] }}
          </span>
            <i class="text-center cita">
              {{ formatText(officium?.lectura_patristica_titulo_p) }}
            </i>
          </p>
          <p v-html="formatText(officium?.lectura_patristica_texto_p)"></p>
          <br/>
          <p><span v-html="formatText(officium?.responsorio3_p[0])?.replace('℟.','℣.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio3_p[0])?.replace('℣.','℟.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio3_p[1])?.replace('℟.','℣.')"></span></p>
          <p><span v-html="formatText(officium?.responsorio3_p[2])?.replace('℣.','℟.')"></span></p>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {formatText} from "@/modules/app/constants/formatText.ts";
import type {OfficiumSchemaOutput} from "breviarium";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";

const officium = ref<OfficiumSchemaOutput>();

const settingsStore = useSettingsStore()
const selectedCycle = ref(settingsStore.settings.bienalOfficiumDefault ? "bienal" : "ordinary");

onMounted(async () => {
  await useBreviariumStore().getOfficium().then(data => {
    officium.value = data;
  });
});


</script>

<style scoped>
</style>
