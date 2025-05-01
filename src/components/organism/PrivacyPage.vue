<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <h2>Política de privacidad</h2>
        <p>Esta Pol&iacute;tica de Privacidad describe c&oacute;mo se recopila, utiliza y comparte la informaci&oacute;n
          cuando usted utiliza nuestra aplicaci&oacute;n Breviarium, desarrollada por Miguel Martínez,
          que incluye Google Analytics para an&aacute;lisis de navegaci&oacute;n. Su privacidad es importante para
          nosotros, y nos comprometemos a proteger la informaci&oacute;n que usted nos proporciona.</p>
        <p><b>Recopilaci&oacute;n y Uso de la Informaci&oacute;n</b></p>
        <p>Cuando utiliza nuestra aplicaci&oacute;n web y m&oacute;vil, recopilamos informaci&oacute;n de navegaci&oacute;n
          de forma an&oacute;nima utilizando Google Analytics. Esta informaci&oacute;n puede incluir datos como su
          ubicaci&oacute;n aproximada, tipo de dispositivo, sistema operativo, navegador utilizado, p&aacute;ginas
          visitadas, duraci&oacute;n de la visita y otros datos de uso. Esta informaci&oacute;n se utiliza
          exclusivamente para analizar y mejorar el rendimiento y la experiencia de usuario de nuestra aplicaci&oacute;n.</p>
        <p>No recopilamos ni almacenamos informaci&oacute;n personal identificable (PII) como nombres, direcciones de
          correo electr&oacute;nico, n&uacute;meros de tel&eacute;fono u otra informaci&oacute;n personal a menos que
          usted nos la proporcione expl&iacute;citamente a trav&eacute;s de funciones de contacto o registros espec&iacute;ficos
          en nuestra aplicaci&oacute;n.</p>
        <p><b>Uso de Google Analytics</b></p>
        <p>Utilizamos Google Analytics para recopilar datos sobre el comportamiento de navegaci&oacute;n de los usuarios
          en nuestra aplicaci&oacute;n con el prop&oacute;sito de entender mejor c&oacute;mo se utiliza la aplicaci&oacute;n,
          identificar &aacute;reas de mejora y optimizar la experiencia del usuario. Google Analytics utiliza cookies y
          tecnolog&iacute;as similares para recopilar informaci&oacute;n sobre el uso de nuestra aplicaci&oacute;n. La
          informaci&oacute;n recopilada por Google Analytics se rige por las pol&iacute;ticas de privacidad de Google.
          Para obtener m&aacute;s informaci&oacute;n sobre c&oacute;mo Google utiliza y protege los datos recopilados,
          consulte la Pol&iacute;tica de Privacidad de Google Analytics.</p>
        <p><b>Compartir Informaci&oacute;n</b></p>
        <p>No compartimos informaci&oacute;n de identificaci&oacute;n personal con terceros sin su consentimiento expl&iacute;cito,
          excepto cuando sea necesario para cumplir con la ley u otros requisitos legales.</p>
        <p><b>Seguridad de la Informaci&oacute;n</b></p>

        <p>Implementamos medidas de seguridad razonables para proteger la informaci&oacute;n recopilada contra accesos
          no autorizados, alteraciones, divulgaciones o destrucciones no autorizadas.</p>

        <p><b>Cambios en la Pol&iacute;tica de Privacidad</b></p>

        <p>Podemos actualizar esta Pol&iacute;tica de Privacidad de vez en cuando. Le notificaremos cualquier cambio
          publicando la nueva Pol&iacute;tica de Privacidad en esta p&aacute;gina.</p>

        <p><b>Consentimiento</b></p>
        <p>Al utilizar nuestra aplicaci&oacute;n web y m&oacute;vil, usted acepta los t&eacute;rminos de esta Pol&iacute;tica
          de Privacidad.</p>
        <p>Si tiene alguna pregunta sobre esta Pol&iacute;tica de Privacidad, cont&aacute;ctenos a trav&eacute;s de:
          miguel@miguelms.es</p>
        <p>&Uacute;ltima actualizaci&oacute;n: 2024</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {IonContent, IonPage} from '@ionic/vue';
</script>

<style scoped>
#container {
  text-align: left;
  padding: 1em 2em;
  position: relative;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: var(--ion-color-dark);
  margin: 0 0 10px 0;
}

#container a {
  text-decoration: none;
}

.quote {
  background-color: #f1f1f1;
  color: var(--ion-color-neocat);
  padding: 5px 5px;
  border-radius: 4px;
}

.quote-wrapper {
  min-width: 88px;
}
</style>
