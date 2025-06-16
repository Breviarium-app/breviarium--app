<script lang="ts" setup>

import {formatText} from "@/constants/formatText.ts";
import CrossComponent from "@/components/molecules/prayers/CrossComponent.vue";
</script>

<template>
  <h4 class="title title-color">
    {{ $t("chapletDivineMercy") }}
  </h4>
  <p class="margin-y-md title-color ion-align-items-center ion-text-center">
    <CrossComponent/>
    <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
  </p>

  <p>{{ formatText($t("signOfTheCross")) }}</p>
  <p v-html="formatText($t('indicationOurFather'))"></p>
  <p v-html="formatText($t('indicationHailMary'))"></p>
  <p v-html="formatText($t('theApostlesCreed'))"></p>
  <p>
    <span class="text-red">{{ formatText($t('chapletFirstExplanation')) }}</span><br/>
    <span v-html="formatText($t('firstChapletDivineMercyPrayer'))"></span>
  </p>
  <p>
    <span class="text-red">{{ formatText($t('chapletSecondExplanation')) }}</span><br/>
    <span v-html="formatText($t('secondChapletDivineMercyPrayer'))"></span>
  </p>
  <p>
    <span v-html="formatText($t('thirdChapletDivineMercyPrayer'))"></span>
    <span class="text-red">{{ formatText($t('threeTimes')) }}</span>
  </p>
  <p>
    <span class="text-red">Oración</span><br/>
    <span v-html="formatText($t('finalChapletDivineMercyPrayer'))"></span><br/><br/>
    <span class="text-red">Se puede añadir:</span><br/>
    <span v-html="formatText($t('finalChapletOptional'))"></span>
  </p>

</template>