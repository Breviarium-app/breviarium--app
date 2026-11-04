<script lang="ts" setup>
const petitions: string[] = [
  "Te lo pido por la bondad divina que movió al Verbo Eterno a encarnarse y nacer en la pobre naturaleza humana, Dios Hombre, el Señor Jesús.",
  "Te lo pido por la prontitud con la que respondiste al llamado de ser Padre adoptivo del Señor Jesús y Casto esposo y custodio de nuestra Santa Madre.",
  "Te lo pido por tu fortaleza discreta y silenciosa con la que buscaste un establo para cuna de Dios, nacido entre los hombres, que le obligan a nacer entre animales.",
  "Te lo imploro por la pronta obediencia con la que impusiste al Reconciliador el Santo Nombre de Jesús, por disposición del Eterno para consuelo, amor y esperanza nuestra.",
  "Te lo suplico por el dolor heroicamente aceptado al oír del Ángel la muerte decretada contra tu Hijo Dios, y por tu valerosa huida a Egipto, por los sufrimientos del camino, por la pobreza del destierro, y por las inseguridades del retorno a Nazaret.",
  "Te lo pido por tu aflicción dolorosa de tres días al perder a tu Hijo, y por tu alegría intensa y discreta al encontrarle en el templo; por el gozo inefable de los treinta años que viviste en Nazaret con Jesús y María sujetos a tu autoridad y providencia.",
  "Te lo ruego por el heroico sacrificio con que aceptaste la misión del Señor Jesús: la cruz y la muerte por nuestra reconciliación.",
  "Te lo imploro por el heroico desprendimiento con el que todos los días contemplabas aquellas manos infantiles que serían taladradas un día en la Cruz; aquella cabeza que se reclinaba sobre tu pecho que sería coronada de espinas; aquel cuerpo divino que estrechabas contra tu corazón, que sería extendido en la Cruz.",
  "Te lo pido por tu tránsito de esta vida y tu entrada al Cielo, donde tienes tu trono de poder.",
  "Te lo suplico por tu gozo cuando contemplaste la Resurrección del Señor Jesús, su ascenso a los Cielos y su trono de Rey inmortal por los siglos.",
  "Te lo pido por la dicha con la que contemplaste ser ascendida a los Cielos por los ángeles a tu santísima Esposa y coronada por el Eterno como Reina y Señora de todo lo creado.",
  "Te lo ruego y espero confiadamente por tus trabajos, dolores y sacrificios en la tierra, y por tus triunfos y tu bienaventuranza en el Cielo con tu Hijo Jesús y con Santa María.",
];
</script>

<template>
  <h4 class="title title-color">
    Treintena a San José
  </h4>
  <p class="subtitle"><i>Versión moderna · Treinta días de confianza en San José</i></p>

  <p>
    ¡Amado San José! Desde mi pequeñez y dolor y ansiedad, te contemplo con emoción y
    alegría en el cielo, donde resides con los Bienaventurados, pero también como padre
    de los huérfanos en la tierra, alegría de los tristes, amparo de los desvalidos,
    gozo y amor de tus devotos ante el trono de Dios.
  </p>

  <p>
    Por eso yo, pobre, desvalido, frágil y necesitado, te dirijo hoy y siempre mis
    tristezas y alegrías, mis ruegos y súplicas, mis arrepentimientos y mis esperanzas;
    y hoy especialmente traigo ante tu imagen un sufrimiento que consolar, un mal que
    remediar, una desgracia que impedir, una necesidad que resolver, una gracia que
    obtener para mí y para mis seres queridos.
  </p>

  <p>
    Y para animarte aún más a oírme y obtenérmelo, te lo pediré durante estos treinta
    días, urgente y confiadamente, recordando los hitos que en tu vida marcaron tu
    fidelidad a toda prueba, y que son los motivos que tengo para esperar que no demores
    en responder a nuestra necesidad.
  </p>

  <ol class="petitions">
    <li v-for="(petition, index) in petitions" :key="index">{{ petition }}</li>
  </ol>

  <div class="closing">
    <span class="closing-cross" aria-hidden="true">†</span>

    <p>
      ¡Oh mi buen San José! Yo, inspirado en la fe de la Santa Iglesia y en comunión con
      el sentir universal del pueblo cristiano, siento en mí la confiada fuerza, que me
      alienta a pedirte, suplicarte y esperar me obtengas de Dios la gracia que voy a
      poner ante esta imagen en la tierra y ante tu trono en el Cielo: la espero, Santo
      Patriarca.
    </p>

    <p data-tts-skip class="petition-note">
      Aquí, levantado el corazón a lo alto, se pide al Santo la gracia que se desea.
    </p>
  </div>
</template>

<style scoped>
.subtitle {
  margin-bottom: 1em;
}

.petitions {
  margin: 1.4em 0 0;
  padding-inline-start: 1.5em;
}

.petitions li {
  margin-bottom: 0.75em;
  padding-inline-start: 0.25em;
}

.petitions li::marker {
  color: var(--breviarium-primary);
  font-weight: 600;
}

.closing {
  margin-top: 2.2em;
  padding: 1.4em 1.2em;
  border-radius: 16px;
  background: var(--background-color-card);
}

.closing-cross {
  display: block;
  font-size: 1.6rem;
  font-weight: bold;
  text-align: center;
  color: var(--breviarium-primary);
  margin-bottom: 0.4em;
}

.petition-note {
  margin-top: 1em;
  padding-top: 0.8em;
  border-top: 1px solid var(--border-color-light);
  font-size: 0.9rem;
  font-style: italic;
  opacity: 0.75;
}
</style>
