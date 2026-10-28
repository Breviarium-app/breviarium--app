<script lang="ts" setup>
import {formatText} from "@/modules/app/constants/formatText.ts";
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import {getRosaryMysteriesForToday} from "@/modules/app/constants/utils.ts";
import {computed, ref} from "vue";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";

type MysteryKey = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';

const todaysMysteries = ref(getRosaryMysteriesForToday());
const showAllMysteries = ref(false);

const mysteriesView = computed<'today' | 'all'>({
  get: () => showAllMysteries.value ? 'all' : 'today',
  set: (value) => {
    showAllMysteries.value = value === 'all';
  },
});

const onMysteriesViewChange = () => HapticsService.light();

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

const mysteryGroups: { key: MysteryKey; title: string; items: string[] }[] = [
  {
    key: 'joyful',
    title: "Misterios Gozosos",
    items: [
      "La Encarnación del Hijo de Dios",
      "La Visitación de Nuestra Señora a su prima Santa Isabel",
      "El Nacimiento del Hijo de Dios en el portal de Belén",
      "La presentación de Jesús en el Templo",
      "El Niño Jesús perdido y hallado en el Templo",
    ],
  },
  {
    key: 'sorrowful',
    title: "Misterios Dolorosos",
    items: [
      "La oración en el Huerto",
      "La flagelación de Jesús atado a la columna",
      "La coronación de espinas",
      "Jesús con la Cruz a cuestas camino del Calvario",
      "La crucifixión y muerte de Jesús",
    ],
  },
  {
    key: 'glorious',
    title: "Misterios Gloriosos",
    items: [
      "La resurrección del Hijo de Dios",
      "La Ascensión del Señor al cielo",
      "La venida del Espíritu Santo",
      "La Asunción de María al cielo",
      "La coronación de María como Reina y Señora de todo lo creado",
    ],
  },
  {
    key: 'luminous',
    title: "Misterios Luminosos",
    items: [
      "El Bautismo en el Jordán",
      "Las bodas de Caná",
      "El anuncio del Reino de Dios",
      "La Transfiguración",
      "La institución de la Eucaristía",
    ],
  },
];
</script>
<template>
  <div class="rosarium-page">
    <h4 class="title title-color">
      {{ $t("rosary") }}
    </h4>
    <p class="subtitle"><i>Oración mariana meditando los misterios de la vida de Cristo</i></p>

    <p data-tts-skip class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossSay")) }}</small>
    </p>
    <p v-html="$t('saintCrossEnemy')"></p>

    <h4 class="title-color">
      {{ formatText($t("contritionAct")) }}
    </h4>

    <p v-html="formatText($t('contritionActText'))"></p>

    <section class="today-banner">
      <p class="today-label">Hoy</p>
      <p class="today-text">{{ dayText }}</p>
      <ion-segment v-model="mysteriesView" class="mysteries-segment" @ionChange="onMysteriesViewChange">
        <ion-segment-button value="today">
          <ion-label>Misterio de hoy</ion-label>
        </ion-segment-button>
        <ion-segment-button value="all">
          <ion-label>Todos los misterios</ion-label>
        </ion-segment-button>
      </ion-segment>
    </section>

    <div class="mysteries-container">
      <div
          v-for="group in mysteryGroups"
          v-show="showAllMysteries || todaysMysteries === group.key"
          :key="group.key"
          class="mystery-group"
          :class="{ 'mystery-group--active': todaysMysteries === group.key }"
      >
        <h3 class="mystery-title title-color">
          {{ group.title }}
          <span v-if="showAllMysteries && todaysMysteries === group.key" class="today-chip">Hoy</span>
        </h3>
        <ol class="mystery-list">
          <li v-for="(item, index) in group.items" :key="index" class="mystery-item">
            <span class="mystery-marker">{{ index + 1 }}</span>

            <!-- Today's set: the full decade, so reading it aloud actually prays the rosary -->
            <div v-if="group.key === todaysMysteries" class="mystery-body">
              <p class="mystery-text">{{ item }}</p>
              <ol class="decade-sequence">
                <li class="decade-step">
                  <b>Padre nuestro</b>, que estás en el cielo, santificado sea tu nombre, venga a nosotros tu reino,
                  hágase tu voluntad, en la tierra como en el cielo. Danos hoy nuestro pan de cada día, perdona
                  nuestras ofensas, como también nosotros perdonamos a los que nos ofenden. No nos dejes caer en la
                  tentación, y líbranos del mal. Amén
                </li>
                <li class="decade-step" data-tts-repeat="10">
                  <b>Dios te Salve, María</b>, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas
                  las mujeres y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por
                  nosotros pecadores, ahora y en la hora de nuestra muerte. Amén
                  <span class="repeat-badge" data-tts-skip>×10</span>
                </li>
                <li class="decade-step">
                  <b>Gloria</b> al Padre y al Hijo y al Espíritu Santo. Como era en el principio ahora y siempre, por
                  los siglos de los siglos. Amén.
                </li>
                <li class="decade-step">
                  <b>María madre de gracia</b>, madre de piedad y misericordia,<br/>
                  Defiéndenos del enemigo y ampáranos ahora, y en la hora de nuestra muerte. Amén.
                </li>
              </ol>
            </div>

            <!-- Other sets, shown only for reference in the "all mysteries" view -->
            <span v-else class="mystery-text">{{ item }}</span>
          </li>
        </ol>
      </div>
    </div>

    <section class="litanies-section">
      <h3 class="title-color">{{ $t('litanies') }}</h3>
      <div class="litanies-content" v-html="$t('litaniesFull')"></div>
    </section>
  </div>
</template>

<style scoped>
.subtitle {
  margin-bottom: 1em;
}

.today-banner {
  margin: 1.4em 0 0;
  padding: 1em 1.1em;
  border-radius: 16px;
  background: var(--background-color-card);
  border-inline-start: 3px solid var(--breviarium-primary);
  text-align: center;
}

.today-label {
  margin: 0 0 0.2em;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

.today-text {
  margin: 0 0 0.8em;
  font-weight: 600;
  color: var(--breviarium-primary);
}

.mysteries-segment {
  --background: var(--border-color-light);
}

.mysteries-container {
  margin: 1.4em 0;
}

.mystery-group {
  margin-bottom: 1.2em;
  padding: 1.1em 1.2em;
  border-radius: 16px;
  background: var(--background-color-card);
}

.mystery-group--active {
  box-shadow: inset 0 0 0 1.5px var(--breviarium-primary);
}

.mystery-title {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 0 0 0.9em;
  font-size: 1.05rem;
}

.today-chip {
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  background: var(--breviarium-primary);
}

.mystery-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mystery-item {
  position: relative;
  display: flex;
  gap: 0.75rem;
  padding-bottom: 0.9rem;
}

.mystery-item:last-child {
  padding-bottom: 0;
}

/* The connecting line runs the full height of the item (decades can be tall once they
   carry their prayers), from the bottom of one marker down to the top of the next */
.mystery-item::after {
  content: '';
  position: absolute;
  top: 30px;
  bottom: 0;
  left: 14px;
  width: 2px;
  background: var(--border-color-light);
}

.mystery-item:last-child::after {
  display: none;
}

.mystery-marker {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--breviarium-primary);
  background: var(--background);
  color: var(--breviarium-primary);
  font-size: 0.8rem;
  font-weight: 700;
  z-index: 1;
}

.mystery-text {
  padding-top: 0.3rem;
  margin: 0;
}

.mystery-body {
  flex: 1;
  min-width: 0;
}

.mystery-body .mystery-text {
  margin-bottom: 0.6em;
}

.decade-sequence {
  list-style: none;
  margin: 0;
  padding: 0.2em 0.9em;
  border-radius: 10px;
  background: var(--background);
  font-size: 0.92em;
}

.decade-step {
  padding: 0.6em 0;
}

.decade-step + .decade-step {
  border-top: 1px solid var(--border-color-light);
}

.decade-step b {
  color: var(--breviarium-primary);
}

.repeat-badge {
  display: inline-block;
  margin-left: 0.35em;
  padding: 0.05em 0.5em;
  border-radius: 999px;
  font-size: 0.75em;
  font-weight: 700;
  color: var(--breviarium-primary);
  background: color-mix(in srgb, var(--breviarium-primary) 14%, transparent);
  vertical-align: middle;
}

.litanies-section {
  margin-top: 1.6em;
}

.rosarium-page:deep(.response-rosary) {
  margin-left: 0.8rem;
  font-style: italic;
}
</style>
