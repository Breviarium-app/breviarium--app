<template>
  <PrayerPage title="Oraciones">
    <ion-segment v-model="selectedPrayer">
      <ion-segment-button value="rosary">
        <ion-label>{{ $t('rosary') }}</ion-label>
      </ion-segment-button>
      <ion-segment-button value="angelus">
        <ion-label>{{ $t('angelus') }}</ion-label>
      </ion-segment-button>
      <ion-segment-button value="chapletDivineMercy">
        <ion-label>{{ $t('chapletDivineMercyShort') }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <div v-if="selectedPrayer == 'rosary'">
      <RosariumComponent/>
    </div>
    <div v-if="selectedPrayer == 'angelus'">
      <AngelusComponent/>
    </div>
    <div v-if="selectedPrayer == 'chapletDivineMercy'">
      <ChapletDivineMercyComponent/>
    </div>

  </PrayerPage>
</template>
<script lang="ts" setup>
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";
import RosariumComponent from "@/modules/app/components/molecules/prayers/RosariumComponent.vue";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import {ref} from "vue";
import AngelusComponent from "@/modules/app/components/molecules/prayers/AngelusComponent.vue";
import ChapletDivineMercyComponent from "@/modules/app/components/molecules/prayers/ChapletDivineMercyComponent.vue";

const selectedPrayer = ref<string>('rosary');
</script>
<style lang="css" scoped>
</style>