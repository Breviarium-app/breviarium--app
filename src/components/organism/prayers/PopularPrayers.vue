<template>
  <PrayerPage title="Oraciones">
    <p class=" title-color">

    </p>
    <h4 class="title title-color">
      {{ $t("rosary") }}
    </h4>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <p v-html="$t('saintCrossEnemy')"></p>

    <h4 class="title-color">
      {{ formatText($t("contritionAct")) }}
    </h4>

    <p v-html="formatText($t('contritionActText'))"></p>

    <h3 class="title-color">Misterios Gozosos (lunes y sábado):</h3>
    <ol>
      <li>La Encarnación del Hijo de Dios</li>
      <li>La Visitación de Nuestra Señora a su prima Santa Isabel</li>
      <li>El Nacimiento del Hijo de Dios en el portal de Belén</li>
      <li>La presentación de Jesús en el Templo</li>
      <li>El Niño Jesús perdido y hallado en el Templo</li>
    </ol>

    <h3 class="title-color">Misterios Dolorosos (martes y viernes):</h3>
    <ol>
      <li>La oración en el Huerto</li>
      <li>La flagelación de Jesús atado a la columna</li>
      <li>La coronación de espinas</li>
      <li>Jesús con la Cruz a cuestas camino del Calvario</li>
      <li>La crucifixión y muerte de Jesús</li>
    </ol>

    <h3 class="title-color">Misterios Gloriosos (miércoles y domingo):</h3>
    <ol>
      <li>La resurrección del Hijo de Dios</li>
      <li>La Ascensión del Señor al cielo</li>
      <li>La venida del Espíritu Santo</li>
      <li>La Asunción de María al cielo</li>
      <li>La coronación de María como Reina y Señora de todo lo creado</li>
    </ol>

    <h3 class="title-color">Misterios Luminosos (jueves):</h3>
    <ol>
      <li>El Bautismo en el Jordán</li>
      <li>Las bodas de Caná</li>
      <li>El anuncio del Reino de Dios</li>
      <li>La Transfiguración</li>
      <li>La institución de la Eucaristía</li>
    </ol>

    <p>En cada misterio:</p>
    <p>
      <b>Padre nuestro</b>, que estás en el cielo, santificado sea tu nombre, venga a nosotros tu reino, hágase tu
      voluntad, en la tierra como en el cielo. Danos hoy nuestro pan de cada día, perdona nuestras ofensas, como también
      nosotros perdonamos a los que nos ofenden. No nos dejes caer en la tentación, y líbranos del mal. Amén
    </p>
    <p>
      (x10) <b>Dios te Salve, María</b>, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las
      mujeres y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores,
      ahora y en la hora de nuestra muerte. Amén
    </p>
    <p>
      <b>Gloria</b> al Padre y al Hijo y al Espíritu Santo. Como era en el principio ahora y siempre, por los siglos de
      los siglos. Amén.
    </p>
    <p>
      <b>María madre de gracia</b>, madre de piedad y misericordia,<br/>
      Defiéndenos del enemigo y ampáranos ahora, y en la hora de nuestra muerte. Amén.
    </p>


  </PrayerPage>
</template>
<script lang="ts" setup>
import PrayerPage from "@/components/organism/PrayerPage.vue";
import {formatText} from "@/constants/formatText.ts";
import CrossComponent from "@/components/molecules/prayers/CrossComponent.vue";
</script>
<style lang="css" scoped>
.cita {
  text-align: center;
}

.reference-bible {
  text-align: right;
}

.custom-prayers li {
  list-style-type: none;
}
</style>