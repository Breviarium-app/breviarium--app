<script lang="ts" setup>

import {formatText} from "@/constants/formatText.ts";
import CrossComponent from "@/components/molecules/prayers/CrossComponent.vue";
</script>

<template>
  <h4 class="title title-color">
    {{ $t("angelus") }}
  </h4>
  <p class="margin-y-md title-color ion-align-items-center ion-text-center">
    <CrossComponent/>
    <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
  </p>

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
  <p><span class="text-red">{{ $t('threeGlory') }}</span></p>

</template>