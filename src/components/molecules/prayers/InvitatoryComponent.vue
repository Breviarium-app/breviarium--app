<template>

  <breviarium-segment :value="pSalmSelected" @update:value="segmentChanged($event)">
    <breviarium-segment-button value="psalm94">
      <ion-label>{{ $t('psalm') }} 94</ion-label>
    </breviarium-segment-button>
    <breviarium-segment-button value="psalm99">
      <ion-label>{{ $t('psalm') }} 99</ion-label>
    </breviarium-segment-button>
    <breviarium-segment-button value="psalm66">
      <ion-label>{{ $t('psalm') }} 66</ion-label>
    </breviarium-segment-button>
    <breviarium-segment-button value="psalm23">
      <ion-label>{{ $t('psalm') }} 23</ion-label>
    </breviarium-segment-button>
  </breviarium-segment>
  <div class="wrapper">
    <span class="subtitle title-color cita">
      {{ invitatory?.title }}
    </span>
    <p v-html="invitatory?.psalm"></p>
  </div>
</template>
<script lang="ts" setup>
import {ref, Ref} from "vue";
import {IonLabel} from "@ionic/vue";
import BreviariumSegment from "@/components/molecules/prayers/BreviariumSegment.vue";
import BreviariumSegmentButton from "@/components/molecules/prayers/BreviariumSegmentButton.vue";
import Breviarium from "breviarium";

const brev = new Breviarium();
const invitatorium_psalms = await brev.getInvitatoriumPsalms();

const pSalmSelected: Ref<string> = ref('psalm94');
let invitatory = invitatorium_psalms.find((element: any) => element.id === pSalmSelected.value);

const segmentChanged = (event: any) => {
  pSalmSelected.value = event;
  invitatory = invitatorium_psalms.find((element: any) => element.id === pSalmSelected.value);
}

</script>
<style scoped>

.wrapper {
  margin-top: 10px;
}
</style>