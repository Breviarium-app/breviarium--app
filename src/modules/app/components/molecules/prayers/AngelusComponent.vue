<script lang="ts" setup>

import {formatText} from "@/modules/app/constants/formatText.ts";
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import LatinPrayerSelector from "@/modules/app/components/molecules/prayers/LatinPrayerSelector.vue";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";

const settingsStore = useSettingsStore();
</script>

<template>
  <h4 class="title title-color">
    {{ $t("angelus") }}
  </h4>
  <p data-tts-skip class="margin-y-md title-color ion-align-items-center ion-text-center">
    <CrossComponent/>
    <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
  </p>
  <LatinPrayerSelector/>

  <div v-if="settingsStore.settings.latinPrayers === 'es'" class="prayer-content">
    <p>
      <span class="text-red">℣.</span> {{ $t('firstVersiculumAngelus') }}<br/>
      <span class="text-red">℟.</span> {{ $t('firstResponseAngelus') }}
    </p>
    <p>{{ $t('hailMary') }}</p>
    <p>
      <span class="text-red">℣.</span> {{ $t('secondVersiculumAngelus') }}<br/>
      <span class="text-red">℟.</span> {{ $t('secondResponseAngelus') }}
    </p>
    <p v-html="$t('indicationHailMary')"></p>
    <p>
      <span class="text-red">℣.</span> {{ $t('thirdVersiculumAngelus') }}<br/>
      <span class="text-red">℟.</span> {{ $t('thirdResponseAngelus') }}
    </p>
    <p v-html="$t('indicationHailMary')"></p>
    <p>
      <span class="text-red">℣.</span> {{ $t('fourthVersiculumAngelus') }}<br/>
      <span class="text-red">℟.</span> {{ $t('fourthResponseAngelus') }}
    </p>
    <p v-html="$t('finalAngelusPrayer')"></p>
    <p>
      <span class="text-red">℣.</span> {{ $t('gloryVersiculum') }}<br/>
      <span class="text-red">℟.</span> {{ $t('gloryResponse') }}
    </p>
  </div>
  <div v-else class="prayer-content">
    <p>
      <span class="text-red">℣.</span> Ángelus Dómini nuntiávit Maríæ.<br/>
      <span class="text-red">℟.</span> Et concépit de Spíritu Sancto.
    </p>
    <p>
      Ave, María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus.
      Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc et in hora mortis nostræ. Amen.
    </p>
    <p>
      <span class="text-red">℣.</span> Ecce ancílla Dómini.<br/>
      <span class="text-red">℟.</span> Fiat mihi secúndum verbum tuum.
    </p>
    <p><b>Ave, María</b>, grátia plena...</p>
    <p>
      <span class="text-red">℣.</span> Et Verbum caro factum est.<br/>
      <span class="text-red">℟.</span> Et habitávit in nobis.
    </p>
    <p><b>Ave, María</b>, grátia plena...</p>
    <p>
      <span class="text-red">℣.</span> Ora pro nobis, sancta Dei Génetrix.<br/>
      <span class="text-red">℟.</span> Ut digni efficiámur promissiónibus Christi.
    </p>
    <p>
      <b>Orémus</b>: Grátiam tuam, quǽsumus, Dómine, méntibus nostris infúnde; ut qui, Ángelo nuntiánte, Christi
      Fílii tui incarnatiónem cognóvimus, per passiónem eius et crucem ad resurrectiónis glóriam perducámur. Per
      eúndem Christum Dóminum nostrum. Amen.
    </p>
    <p>
      <span class="text-red">℣.</span> Glória Patri, et Fílio, et Spirítui Sancto.<br/>
      <span class="text-red">℟.</span> Sicut erat in princípio, et nunc et semper, et in sǽcula sæculórum. Amen.
    </p>
  </div>
  <p><span class="text-red">{{ $t('threeGlory') }}</span></p>

</template>

<style scoped>
.prayer-content {
  padding-top: 1em;
}
</style>
