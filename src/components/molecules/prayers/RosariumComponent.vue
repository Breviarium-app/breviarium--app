<script lang="ts" setup>
import {formatText} from "@/constants/formatText.ts";
import CrossComponent from "@/components/molecules/prayers/CrossComponent.vue";
import {getRosaryMysteriesForToday} from "@/constants/utils.ts";
import {computed, ref} from "vue";
import {IonIcon} from "@ionic/vue";
import {eye} from 'ionicons/icons';

const todaysMysteries = ref(getRosaryMysteriesForToday());
const showAllMysteries = ref(false);

const toggleMysteries = () => {
  showAllMysteries.value = !showAllMysteries.value;
};

const dayText = computed(() => {
  switch (todaysMysteries.value) {
    case 'joyful':
      return "Hoy rezamos los Misterios Gozosos (lunes y sábado)";
    case 'sorrowful':
      return "Hoy rezamos los Misterios Dolorosos (martes y viernes)";
    case 'glorious':
      return "Hoy rezamos los Misterios Gloriosos (miércoles y domingo)";
    case 'luminous':
      return "Hoy rezamos los Misterios Luminosos (jueves)";
    default:
      return "";
  }
});
</script>
<template>
  <div class="rosarium-page">
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

    <div class="mysteries-container">
      <p class="day-indicator ion-text-center">
        <strong>{{ dayText }}</strong>
      </p>
      <ion-button class="button-show btn" fill="clear" size="small" @click="toggleMysteries">
        <ion-icon :icon="eye"></ion-icon>
        {{ showAllMysteries ? 'Mostrar solo misterios de hoy' : 'Mostrar todos los misterios' }}
      </ion-button>

      <div v-if="showAllMysteries || todaysMysteries === 'joyful'">
        <h3 class="title-color">Misterios Gozosos</h3>
        <ol>
          <li>La Encarnación del Hijo de Dios</li>
          <li>La Visitación de Nuestra Señora a su prima Santa Isabel</li>
          <li>El Nacimiento del Hijo de Dios en el portal de Belén</li>
          <li>La presentación de Jesús en el Templo</li>
          <li>El Niño Jesús perdido y hallado en el Templo</li>
        </ol>
      </div>

      <div v-if="showAllMysteries || todaysMysteries === 'sorrowful'">
        <h3 class="title-color">Misterios Dolorosos</h3>
        <ol>
          <li>La oración en el Huerto</li>
          <li>La flagelación de Jesús atado a la columna</li>
          <li>La coronación de espinas</li>
          <li>Jesús con la Cruz a cuestas camino del Calvario</li>
          <li>La crucifixión y muerte de Jesús</li>
        </ol>
      </div>

      <div v-if="showAllMysteries || todaysMysteries === 'glorious'">
        <h3 class="title-color">Misterios Gloriosos</h3>
        <ol>
          <li>La resurrección del Hijo de Dios</li>
          <li>La Ascensión del Señor al cielo</li>
          <li>La venida del Espíritu Santo</li>
          <li>La Asunción de María al cielo</li>
          <li>La coronación de María como Reina y Señora de todo lo creado</li>
        </ol>
      </div>

      <div v-if="showAllMysteries || todaysMysteries === 'luminous'">
        <h3 class="title-color">Misterios Luminosos</h3>
        <ol>
          <li>El Bautismo en el Jordán</li>
          <li>Las bodas de Caná</li>
          <li>El anuncio del Reino de Dios</li>
          <li>La Transfiguración</li>
          <li>La institución de la Eucaristía</li>
        </ol>
      </div>
    </div>

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

    <h3 class="title-color">{{ $t('litanies') }}</h3>

    <div v-html="$t('litaniesFull')"></div>
  </div>
</template>

<style scoped>
.mysteries-container {
  margin: 20px 0;
}

.day-indicator {
  margin: 10px 0;
  color: var(--breviarium-primary);
}

.button-show {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.6em 1.2em;
  cursor: pointer;
  transition: all ease-out 0.25s;
  background-color: var(--border-color-light);
}

.rosarium-page:deep(.response-rosary) {
  margin-left: 0.8rem;
  font-style: italic;
}
</style>