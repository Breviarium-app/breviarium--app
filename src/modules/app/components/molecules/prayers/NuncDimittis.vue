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
        Ahora, Señor, según tu promesa,<br/>
        puedes dejar a tu siervo irse en paz.
      </p>
      <p>
        Porque mis ojos han visto a tu Salvador,<br/>
        a quien has presentado ante todos los pueblos:
      </p>
      <p>
        Luz para alumbrar a las naciones<br/>
        y gloria de tu pueblo Israel.
      </p>
      <p>
        Gloria al Padre, y al Hijo, y al Espíritu Santo.<br/>
        Como era en el principio, ahora y siempre,<br/>
        por los siglos de los siglos. Amén.
      </p>
    </div>
    <div v-else class="prayer-content">
      <p>
        Nunc dimíttis servum tuum, Dómine,<br/>
        secúndum verbum tuum in pace:
      </p>
      <p>
        Quia vidérunt óculi mei salutáre tuum<br/>
        quod parásti ante fáciem ómnium populórum:
      </p>
      <p>
        Lumen ad revelatiónem géntium,<br/>
        et glóriam plebis tuæ Israël.
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
