<script lang="ts" setup>
import LatinPrayerSelector from "@/modules/app/components/molecules/prayers/LatinPrayerSelector.vue";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";

const settingsStore = useSettingsStore();
</script>

<template>
  <h4 class="title title-color">
    Oración a San Miguel Arcángel
  </h4>
  <p class="subtitle"><i>del papa León XIII</i></p>

  <LatinPrayerSelector/>

  <div v-if="settingsStore.settings.latinPrayers === 'es'" class="prayer-content">
    <p>
      San Miguel Arcángel,<br/>
      defiéndenos en la lucha.<br/>
      Sé nuestro amparo<br/>
      contra la perversidad y acechanzas del demonio.<br/>
      Que Dios manifieste sobre él su poder,<br/>
      es nuestra humilde súplica.<br/>
      Y tú, oh Príncipe de la Milicia Celestial,<br/>
      con el poder que Dios te ha conferido,<br/>
      arroja al infierno a Satanás,<br/>
      y a los demás espíritus malignos<br/>
      que vagan por el mundo<br/>
      para la perdición de las almas.
    </p>
    <p class="text-red">Amén.</p>
  </div>
  <div v-else class="prayer-content">
    <p>
      Sancte Michael Archangele,<br/>
      defende nos in proelio;<br/>
      contra nequitiam et insidias diaboli esto praesidium.<br/>
      Imperet illi Deus, supplices deprecamur:<br/>
      tuque, Princeps militiae caelestis,<br/>
      Satanam aliosque spiritus malignos,<br/>
      qui ad perditionem animarum pervagantur in mundo,<br/>
      divina virtute in infernum detrude.
    </p>
    <p class="text-red">Amen.</p>
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
