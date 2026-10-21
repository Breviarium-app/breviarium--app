<template>
  <div>
    <LatinPrayerSelector/>
    <div v-if="settingsStore.settings.latinPrayers === 'es'" class="prayer-content">
      <p>
        <b>Padre nuestro</b>, que estás en el cielo,<br>
        santificado sea tu Nombre;<br>
        venga a nosotros tu reino;<br>
        hágase tu voluntad en la tierra como en el cielo.
      </p>
      <p>
        Danos hoy nuestro pan de cada día;<br>
        perdona nuestras ofensas,<br>
        como también nosotros perdonamos<br>
        a los que nos ofenden.<br>
        No nos dejes caer en la tentación<br>
        y líbranos del mal.
      </p>
    </div>
    <div v-else class="prayer-content">
      <p>
        <b>Pater noster</b>, qui es in cælis,<br>
        sanctificétur nomen tuum;<br>
        advéniat regnum tuum;<br>
        fiat volúntas tua,<br>
        sicut in cælo et in terra.
      </p>
      <p>
        Panem nostrum cotidiánum da nobis hódie;<br>
        et dimítte nobis débita nostra,<br>
        sicut et nos dimíttimus debitóribus nostris;<br>
        et ne nos indúcas in tentatiónem,<br>
        sed líbera nos a malo.
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LatinPrayerSelector from "@/modules/app/components/molecules/prayers/LatinPrayerSelector.vue";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";

const settingsStore = useSettingsStore();
</script>
<style scoped>
.prayer-content {
  padding-top: 1em;
}
</style>
