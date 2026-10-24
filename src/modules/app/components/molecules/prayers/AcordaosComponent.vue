<script lang="ts" setup>
import LatinPrayerSelector from "@/modules/app/components/molecules/prayers/LatinPrayerSelector.vue";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";

const settingsStore = useSettingsStore();
</script>

<template>
  <h4 class="title title-color">
    Acordaos
  </h4>
  <p class="subtitle"><i>Atribuida a san Bernardo de Claraval</i></p>

  <LatinPrayerSelector/>

  <div v-if="settingsStore.settings.latinPrayers === 'es'" class="prayer-content">
    <p>
      Acordaos,<br/>
      oh piadosísima Virgen María,<br/>
      que jamás se ha oído decir<br/>
      que ninguno de los que han acudido<br/>
      a tu protección,<br/>
      implorando tu asistencia<br/>
      y reclamando tu socorro,<br/>
      haya sido abandonado de ti.
    </p>

    <p>
      Animado con esta confianza,<br/>
      a ti también acudo, oh Madre,<br/>
      Virgen de las vírgenes,<br/>
      y aunque gimiendo<br/>
      bajo el peso de mis pecados,<br/>
      me atrevo a comparecer<br/>
      ante tu presencia soberana.
    </p>

    <p>
      No deseches mis humildes súplicas,<br/>
      oh Madre del Verbo divino,<br/>
      antes bien, escúchalas<br/>
      y acógelas benignamente.
    </p>
    <p>Amén.</p>
  </div>
  <div v-else class="prayer-content">
    <p>
      Memoráre,<br/>
      o piíssima Virgo María,<br/>
      non esse audítum a sǽculo quemquam<br/>
      ad tua curréntem præsídia,<br/>
      tua implorántem auxília,<br/>
      tua peténtem suffrágia,<br/>
      esse derelíctum.
    </p>

    <p>
      Ego, tali animátus confidéntia,<br/>
      ad te, Virgo vírginum, mater, curro;<br/>
      ad te vénio,<br/>
      coram te gemens peccátor assísto.
    </p>

    <p>
      Noli, Mater Verbi, verba mea despícere;<br/>
      sed audi propítia,<br/>
      et exáudi.
    </p>
    <p>Amen.</p>
  </div>
</template>

<style scoped>
.subtitle {
  margin-bottom: 1em;
}

.prayer-content {
  padding-top: 1em;
}
</style>
