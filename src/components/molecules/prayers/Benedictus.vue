<template>
  <div>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossProclaim")) }}</small>
    </p>
    <p>
      Bendito sea el Señor, Dios de Israel,<br>
      porque ha visitado y redimido a su pueblo,<br>
      suscitándonos una fuerza de salvación<br>
      en la casa de David, su siervo,<br>
      según lo había predicho desde antiguo<br>
      por boca de sus santos Profetas.
    </p>
    <p>
      Es la salvación que nos libra de nuestros enemigos<br>
      y de la mano de todos los que nos odian;<br>
      realizando la misericordia<br>
      que tuvo con nuestros padres,<br>
      recordando su santa alianza<br>
      y el juramento que juró a nuestro padre Abrahán.
    </p>
    <p>
      Para concedernos que, libres de temor,<br>
      arrancados de la mano de los enemigos,<br>
      le sirvamos con santidad y justicia,<br>
      en su presencia, todos nuestros días.
    </p>
    <p>
      Y a ti, niño, te llamarán profeta del Altísimo,<br>
      porque irás delante del Señor<br>
      a preparar sus caminos,<br>
      anunciando a su pueblo la salvación,<br>
      el perdón de sus pecados.
    </p>
    <p>
      Por la entrañable misericordia de nuestro Dios,<br>
      nos visitará el sol que nace de lo alto,<br>
      para iluminar a los que viven en tinieblas<br>
      y en sombra de muerte,<br>
      para guiar nuestros pasos<br>
      por el camino de la paz.
    </p>
    <p>
      Gloria al Padre, y al Hijo, y al Espíritu Santo.<br>
      Como era en el principio, ahora y siempre,<br>
      por los siglos de los siglos. Amén.
    </p>
  </div>
</template>
<script lang="ts" setup>
import CrossComponent from "@/components/molecules/prayers/CrossComponent.vue";
import {formatText} from "@/constants/formatText.ts";
</script>
<style scoped>
</style>