<script lang="ts" setup>
import {formatText} from "@/modules/app/constants/formatText.ts";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";

const settingsStore = useSettingsStore();
</script>

<template>
  <h4 class="title title-color">
    {{ $t("reginaCoeli") }}
  </h4>
  <ion-segment v-model="settingsStore.settings.latinPrayers" @ionChange="settingsStore.saveSettings()">
    <ion-segment-button value="es">
      <ion-label>Español</ion-label>
    </ion-segment-button>
    <ion-segment-button value="la">
      <ion-label>Latin</ion-label>
    </ion-segment-button>
  </ion-segment>
  <div v-if="settingsStore.settings.latinPrayers === 'es'" class="prayer-content">
    <p>
      <span class="text-red">℣.</span> {{ $t('firstVersiculumReginaCoeli') }}<br/>
      <span class="text-red">℟.</span> {{ $t('firstResponseReginaCoeli') }}
    </p>

    <p>
      <span class="text-red">℣.</span> {{ $t('secondVersiculumReginaCoeli') }}<br/>
      <span class="text-red">℟.</span> {{ $t('secondResponseReginaCoeli') }}
    </p>

    <p>
      <span class="text-red">℣.</span> {{ $t('thirdVersiculumReginaCoeli') }}<br/>
      <span class="text-red">℟.</span> {{ $t('thirdResponseReginaCoeli') }}
    </p>
    <p v-html="formatText($t('finalReginaCoeliPrayer'))"></p>
  </div>
  <div v-else class="prayer-content">
    <p>
      Regína cæli, lætáre, allelúia;<br/>
      quia quem meruísti portáre, allelúia,<br/>
      resurréxit, sicut dixit, allelúia;<br/>
      ora pro nobis Deum, allelúia.
    </p>
    <p>
      <span class="text-red">℣.</span> Gaude et lætáre, Virgo María, allelúia.<br/>
      <span class="text-red">℟.</span> Quia surréxit Dóminus vere, allelúia.
    </p>
    <p>
      <b>Oremus</b>: Deus, qui per resurrectiónem Fílii tui Dómini nostri Iesu Christi mundum lætificáre dignátus es:
      praesta, quǽsumus; ut, per eius Genetrícem Vírginem Maríam, perpétuæ capiámus gáudia vitæ. Per eúmdem Christum
      Dóminum nostrum. Amen.
    </p>
  </div>
</template>

<style scoped>
.prayer-content {
  padding-top: 1em;
}
</style>
