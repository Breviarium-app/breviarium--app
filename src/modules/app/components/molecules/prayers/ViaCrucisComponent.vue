<script lang="ts" setup>
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";

type Station = {
  number: number;
  roman: string;
  title: string;
  meditation: string;
};

const stations: Station[] = [
  {number: 1, roman: "I", title: "Jesús es condenado a muerte", meditation: "Pilato lava sus manos y entrega a Jesús a la multitud. El Inocente es condenado para que nosotros seamos librados de la condena del pecado."},
  {number: 2, roman: "II", title: "Jesús con la cruz a cuestas", meditation: "Jesús toma sobre sus hombros el peso de la cruz, aceptando con amor el instrumento de nuestra salvación."},
  {number: 3, roman: "III", title: "Jesús cae por primera vez", meditation: "Agotado por los golpes y la sed, Jesús cae al suelo bajo el peso de la cruz, y se levanta sin una queja."},
  {number: 4, roman: "IV", title: "Jesús encuentra a su Madre", meditation: "En el camino, los ojos de Jesús se cruzan con los de María. Ningún dolor es comparable al de una madre que ve sufrir a su hijo."},
  {number: 5, roman: "V", title: "El Cirineo ayuda a Jesús a llevar la cruz", meditation: "Simón de Cirene es obligado a cargar la cruz junto a Jesús. Lo que empieza como una imposición se convierte en gracia."},
  {number: 6, roman: "VI", title: "La Verónica enjuga el rostro de Jesús", meditation: "Una mujer se abre paso entre la multitud para limpiar con un paño el rostro ensangrentado de Jesús."},
  {number: 7, roman: "VII", title: "Jesús cae por segunda vez", meditation: "De nuevo las fuerzas le fallan y Jesús cae al suelo. Se levanta otra vez, dispuesto a llegar hasta el final."},
  {number: 8, roman: "VIII", title: "Jesús consuela a las mujeres de Jerusalén", meditation: "Mientras le siguen llorando, Jesús se vuelve hacia ellas y, en medio de su propio dolor, encuentra palabras de consuelo."},
  {number: 9, roman: "IX", title: "Jesús cae por tercera vez", meditation: "Cerca ya de la cumbre del Calvario, Jesús cae una tercera vez, mostrando hasta qué punto quiso cargar nuestro peso."},
  {number: 10, roman: "X", title: "Jesús es despojado de sus vestiduras", meditation: "Los soldados le arrancan las vestiduras y se las reparten. Jesús lo entrega todo, sin reservarse nada para sí."},
  {number: 11, roman: "XI", title: "Jesús es clavado en la cruz", meditation: "Los clavos atraviesan sus manos y sus pies. Jesús se deja clavar a la cruz por amor a cada uno de nosotros."},
  {number: 12, roman: "XII", title: "Jesús muere en la cruz", meditation: "Después de tres horas de agonía, Jesús inclina la cabeza y entrega su espíritu al Padre."},
  {number: 13, roman: "XIII", title: "Jesús es bajado de la cruz y entregado a su Madre", meditation: "El cuerpo sin vida de Jesús es depositado en el regazo de María, que lo recibe con el mismo amor con que lo acunó en Belén."},
  {number: 14, roman: "XIV", title: "Jesús es puesto en el sepulcro", meditation: "Envuelto en un lienzo, el cuerpo de Jesús es colocado en el sepulcro nuevo. En el silencio de la tumba comienza a germinar la esperanza de la resurrección."},
];

const scrollToStation = (number: number) => {
  HapticsService.light();
  document.getElementById(`station-${number}`)?.scrollIntoView({behavior: "smooth", block: "start"});
};
</script>

<template>
  <h4 class="title title-color">
    Vía Crucis
  </h4>
  <p class="subtitle"><i>El camino de la cruz · 14 estaciones</i></p>

  <p data-tts-skip class="ion-text-center text-red">
    <CrossComponent/>
    <small>En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.</small>
  </p>

  <p>
    Acompañamos a Jesús en su camino hacia el Calvario, deteniéndonos en cada una
    de las catorce estaciones para meditar su pasión y su muerte.
  </p>

  <aside class="versicle-box">
    <p class="versicle-label">En cada estación</p>
    <p class="versicle-text">
      <i><span class="text-red">℣.</span> Te adoramos, Cristo, y te bendecimos.</i><br/>
      <i><span class="text-red">℟.</span> Por tu santa cruz redimiste al mundo.</i>
    </p>
    <p>Padre Nuestro, Ave María y Gloria…</p>
  </aside>

  <nav class="station-nav" aria-label="Ir a una estación">
    <button
        v-for="station in stations"
        :key="`nav-${station.number}`"
        class="station-pill btn"
        type="button"
        :aria-label="`Ir a la estación ${station.roman}`"
        @click="scrollToStation(station.number)"
    >
      {{ station.roman }}
    </button>
  </nav>

  <ol class="stations">
    <li
        v-for="station in stations"
        :id="`station-${station.number}`"
        :key="station.number"
        class="station"
    >
      <div class="station-marker" aria-hidden="true">
        <span class="station-number">{{ station.roman }}</span>
      </div>
      <div class="station-body">
        <h3 class="station-title">{{ station.title }}</h3>
        <p class="station-meditation">{{ station.meditation }}</p>
      </div>
    </li>
  </ol>

  <div class="closing">
    <span class="closing-cross" aria-hidden="true">†</span>
    <h3 class="closing-title title-color">Oración final</h3>
    <p>
      Oh Jesús, que por amor a nosotros subiste al Calvario y moriste en la cruz,
      concédenos vivir unidos a tu pasión, para que un día merezcamos alcanzar
      la gloria de tu resurrección.
    </p>
    <p>Amén.</p>
  </div>
</template>

<style scoped>
.subtitle {
  margin-bottom: 1em;
}

.versicle-box {
  margin: 1.2em 0;
  padding: 0.85em 1.1em;
  border-radius: 14px;
  background: var(--background-color-card);
  border-inline-start: 3px solid var(--breviarium-primary);
}

.versicle-label {
  margin: 0 0 0.3em;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

.versicle-text {
  margin: 0;
  line-height: 1.5;
}

.station-nav {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.2rem 0.1rem 0.4rem;
  margin-bottom: 1.6em;
  scrollbar-width: none;
}

.station-nav::-webkit-scrollbar {
  display: none;
}

.station-pill {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--border-color-light);
  background: var(--background-color-card);
  color: var(--ion-text-color);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.75;
}

.station-pill:active {
  opacity: 1;
  border-color: var(--breviarium-primary);
  color: var(--breviarium-primary);
}

.stations {
  list-style: none;
  margin: 0;
  padding: 0;
}

.station {
  display: flex;
  gap: 1rem;
  position: relative;
  padding-bottom: 1.9rem;
  scroll-margin-top: 1rem;
}

.station:last-child {
  padding-bottom: 0;
}

.station-marker {
  position: relative;
  flex-shrink: 0;
  width: 42px;
}

.station-marker::after {
  content: '';
  position: absolute;
  top: 42px;
  bottom: -1.9rem;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: var(--border-color-light);
}

.station:last-child .station-marker::after {
  display: none;
}

.station-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--breviarium-primary);
  background: var(--background-color-card);
  color: var(--breviarium-primary);
  font-size: 0.85rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.station-body {
  padding-top: 0.3rem;
}

.station-title {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  line-height: 1.3;
}

.station-meditation {
  margin: 0;
  opacity: 0.85;
}

.closing {
  margin-top: 2.2em;
  padding: 1.4em 1.2em;
  border-radius: 16px;
  text-align: center;
  background: var(--background-color-card);
}

.closing-cross {
  display: block;
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--breviarium-primary);
  margin-bottom: 0.2em;
}

.closing-title {
  margin: 0 0 0.5em;
}

.closing p {
  text-align: left;
}

@media (min-width: 480px) {
  .station-marker,
  .station-number {
    width: 48px;
  }

  .station-number {
    height: 48px;
  }

  .station-marker::after {
    top: 48px;
  }
}
</style>
