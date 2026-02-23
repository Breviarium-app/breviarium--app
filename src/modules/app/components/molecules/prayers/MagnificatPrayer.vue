<template>
  <div>
    <ion-segment v-model="settingsStore.settings.latinPrayers" @ionChange="settingsStore.saveSettings()">
      <ion-segment-button value="es">
        <ion-label>Español</ion-label>
      </ion-segment-button>
      <ion-segment-button value="la">
        <ion-label>Latin</ion-label>
      </ion-segment-button>
    </ion-segment>
    <div v-if="settingsStore.settings.latinPrayers === 'es'" class="prayer-content">
      <p>
        Proclama mi alma la grandeza del Señor,<br/>
        se alegra mi espíritu en Dios, mi salvador;<br/>
        porque ha mirado la humillación de su esclava.
      </p>
      <p>
        Desde ahora me felicitarán todas las generaciones,<br/>
        porque el Poderoso ha hecho obras grandes por mí:<br/>
        su nombre es santo,<br/>
        y su misericordia llega a sus fieles<br/>
        de generación en generación.
      </p>
      <p>
        Él hace proezas con su brazo:<br/>
        dispersa a los soberbios de corazón,<br/>
        derriba del trono a los poderosos<br/>
        y enaltece a los humildes,<br/>
        a los hambrientos los colma de bienes<br/>
        y a los ricos los despide vacíos.
      </p>
      <p>
        Auxilia a Israel, su siervo,<br/>
        acordándose de la misericordia<br/>
        -como lo había prometido a nuestros padres-<br/>
        en favor de Abrahán y su descendencia por siempre.
      </p>
      <p>
        Gloria al Padre, y al Hijo, y al Espíritu Santo.<br/>
        Como era en el principio, ahora y siempre,<br/>
        por los siglos de los siglos. Amén.
      </p>
    </div>
    <div v-else class="prayer-content">
      <p>
        Magníficat ánima mea Dóminum,<br/>
        et exsultávit spíritus meus in Deo salvatóre meo,<br/>
        quia respéxit humilitátem ancíllæ suæ.
      </p>
      <p>
        Ecce enim ex hoc beátam me dicent omnes generatiónes,<br/>
        quia fecit mihi magna, qui potens est,<br/>
        et sanctum nomen eius,<br/>
        et misericórdia eius in progénies et progénies<br/>
        timéntibus eum.
      </p>
      <p>
        Fecit poténtiam in brácchio suo,<br/>
        dispérsit supérbos mente cordis sui;<br/>
        depósuit poténtes de sede<br/>
        et exaltávit húmiles;
      </p>
      <p>
        esuriéntes implévit bonis<br/>
        et dívites dimísit inánes.
      </p>
      <p>
        Suscépit Israël púerum suum,<br/>
        recordátus misericórdiæ suæ,<br/>
        sicut locútus est ad patres nostros,<br/>
        Ábraham et sémini eius in sǽcula.
      </p>
      <p>
        Glória Patri, et Fílio, et Spirítui Sancto.<br/>
        Sicut erat in princípio, et nunc, et semper,<br/>
        et in sǽcula sæculórum. Amen.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";

const settingsStore = useSettingsStore();
</script>
<style scoped>
.prayer-content {
  padding-top: 1em;
}
</style>