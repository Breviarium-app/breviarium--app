<script lang="ts" setup>
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";

type Salutation = {
  choir: string;
  prayer: string;
};

const salutations: Salutation[] = [
  {
    choir: "Serafines",
    prayer: "Por intercesión del glorioso arcángel San Miguel y del celeste coro de Serafines, suplicamos al Señor nos haga dignos de una llama de perfecta caridad. Amén.",
  },
  {
    choir: "Querubines",
    prayer: "Por intercesión del glorioso arcángel San Miguel y del coro celeste de Querubines, quiera el Señor concedernos la gracia de abandonar el camino del pecado, y de correr por el de la perfección cristiana. Amén.",
  },
  {
    choir: "Tronos",
    prayer: "Por intercesión del glorioso arcángel San Miguel y del sagrado coro de los Tronos, infunda el Señor en nuestros corazones un espíritu de verdadera y sincera humildad. Amén.",
  },
  {
    choir: "Dominaciones",
    prayer: "Por intercesión del glorioso arcángel San Miguel y del coro celeste de las Dominaciones, quiera el Señor concedernos la gracia de poder dominar nuestros sentidos y corregir las pasiones depravadas. Amén.",
  },
  {
    choir: "Potestades",
    prayer: "Por intercesión del glorioso arcángel San Miguel y del celeste coro de las Potestades, dígnese el Señor librar nuestras almas de las asechanzas y tentaciones del demonio. Amén.",
  },
  {
    choir: "Virtudes",
    prayer: "Por intercesión del glorioso arcángel San Miguel y del coro de las admirables Virtudes celestiales, no permita el Señor que caigamos en las tentaciones, sino que nos libre de todo mal. Amén.",
  },
  {
    choir: "Principados",
    prayer: "Por intercesión del glorioso arcángel San Miguel y del coro celeste de los Principados, dígnese Dios llenar nuestras almas del espíritu de verdadera y sincera obediencia. Amén.",
  },
  {
    choir: "Arcángeles",
    prayer: "Por intercesión del glorioso arcángel San Miguel y del coro celeste de los Arcángeles, quiera el Señor concedernos el don de la perseverancia en la fe y en las obras buenas, para que podamos conseguir la gloria del paraíso. Amén.",
  },
  {
    choir: "Ángeles",
    prayer: "Por intercesión del glorioso arcángel San Miguel y del coro celeste de todos los Ángeles, dígnese el Señor concedernos que nos guarden en la presente vida mortal, y después nos conduzcan a la gloria eterna de los cielos. Amén.",
  },
];
</script>

<template>
  <h4 class="title title-color">
    Coronilla a San Miguel Arcángel
  </h4>
  <p class="subtitle"><i>En honor de los nueve coros de los ángeles</i></p>

  <p class="ion-text-center text-red" data-tts-skip>
    <CrossComponent/>
    <small>En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.</small>
  </p>

  <p>
    Se reza con un rosario normal, si es posible ante una imagen de San Miguel.
    Después de cada una de las nueve salutaciones se reza un Padrenuestro y tres Avemarías.
  </p>

  <aside class="versicle-box">
    <p class="versicle-label">Oración de apertura</p>
    <p class="versicle-text">
      <span class="text-red">℣.</span> Dios mío, ven en mi auxilio.<br/>
      <span class="text-red">℟.</span> Señor, date prisa en socorrerme.<br/>
      Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio,
      ahora y siempre, por los siglos de los siglos. Amén.
    </p>
  </aside>

  <h3 class="section-title title-color">Los nueve coros de los ángeles</h3>

  <ol class="salutations">
    <li v-for="(salutation, index) in salutations" :key="salutation.choir" class="salutation">
      <div aria-hidden="true" class="salutation-marker">{{ index + 1 }}</div>
      <div class="salutation-body">
        <h4 class="salutation-title">{{ salutation.choir }}</h4>
        <p>{{ salutation.prayer }}</p>
        <p class="salutation-repeat">1 Padrenuestro · 3 Avemarías</p>
      </div>
    </li>
  </ol>

  <aside class="versicle-box four-fathers">
    <p class="versicle-label">Al terminar</p>
    <p class="versicle-text">
      Se rezan cuatro Padrenuestros: el primero a San Miguel, el segundo a San Gabriel,
      el tercero a San Rafael y el cuarto a nuestro Ángel Custodio.
    </p>
  </aside>

  <div class="closing">
    <span aria-hidden="true" class="closing-cross">†</span>
    <h3 class="closing-title title-color">Antífona y oración final</h3>

    <p>
      Gloriosísimo príncipe San Miguel arcángel, cabeza y jefe de los ejércitos celestiales,
      depositario de las almas, vencedor de los espíritus rebeldes, doméstico en la real
      morada de Dios, nuestra guía admirable después de Jesucristo, y de excelencia y virtud
      sobrehumanas, dignaos librar de todo mal a todos los que acudimos a Vos con confianza,
      y haced por medio de vuestra protección incomparable que adelantemos cada día en servir
      fielmente a nuestro Dios.
    </p>
    <p>
      <span class="text-red">℣.</span> Rogad por nosotros, oh gloriosísimo San Miguel arcángel,
      príncipe de la Iglesia de Jesucristo.<br/>
      <span class="text-red">℟.</span> Para que seamos dignos de alcanzar sus promesas.
    </p>
    <p>
      <span class="text-red">Oremos:</span> Omnipotente y sempiterno Dios, que con un prodigio
      de bondad y misericordia para la salvación de todos los hombres elegisteis por príncipe
      de vuestra Iglesia al gloriosísimo San Miguel arcángel; os suplicamos nos hagáis dignos
      de que con su benéfica protección nos libre de todos nuestros enemigos, para que ninguno
      de ellos nos moleste en la hora de nuestra muerte, sino que seamos conducidos por él a
      la presencia de vuestra divina Majestad. Por los méritos de Nuestro Señor Jesucristo.
      Amén.
    </p>
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

.four-fathers {
  margin-top: 1.6em;
}

.section-title {
  margin: 1.8em 0 1em;
  font-size: 1.15rem;
}

.salutations {
  list-style: none;
  margin: 0;
  padding: 0;
}

.salutation {
  display: flex;
  gap: 1rem;
  position: relative;
  padding-bottom: 1.6rem;
}

.salutation:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 34px;
  bottom: 0;
  left: 16px;
  width: 2px;
  background: var(--border-color-light);
}

.salutation:last-child {
  padding-bottom: 0;
}

.salutation-marker {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid var(--breviarium-primary);
  background: var(--background-color-card);
  color: var(--breviarium-primary);
  font-size: 0.8rem;
  font-weight: 700;
}

.salutation-body {
  padding-top: 0.15rem;
}

.salutation-title {
  margin: 0 0 0.3rem;
  font-size: 1.05rem;
  line-height: 1.3;
}

.salutation-repeat {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  font-style: italic;
  opacity: 0.7;
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
</style>
