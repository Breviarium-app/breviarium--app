<template>
  <div>
    <p class="margin-y-md title-color ion-align-items-center ion-text-center">
      <CrossComponent/>
      <small>{{ formatText($t("signOfTheCrossProclaim")) }}</small>
    </p>
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
    <div v-else class="prayer-content">
      <p>
        Benedíctus Dóminus Deus Israël,<br>
        quia visitávit et fecit redemptiónem plebi suæ,<br>
        et eréxit cornu salútis nobis<br>
        in domo David púeri sui,<br>
        sicut locútus est per os sanctórum,<br>
        qui a sǽculo sunt, prophetárum eius,
      </p>
      <p>
        salútem ex inimícis nostris<br>
        et de manu ómnium qui odérunt nos;<br>
        ad faciéndam misericórdiam cum pátribus nostris,<br>
        et memorári testaménti sui sancti,<br>
        iusiurándum, quod iurávit ad Ábraham patrem nostrum,
      </p>
      <p>
        datúrum se nobis,<br>
        ut sine timóre, de manu inimicórum liberáti,<br>
        serviámus illi<br>
        in sanctitáte et iustítia coram ipso ómnibus diébus nostris.
      </p>
      <p>
        Et tu, puer, prophéta Altíssimi vocáberis:<br>
        praeíbis enim ante fáciem Dómini paráre vias eius,<br>
        ad dandam sciéntiam salútis plebi eius<br>
        in remissiónem peccatórum eórum,
      </p>
      <p>
        per víscera misericórdiæ Dei nostri,<br>
        in quibus visitábit nos óriens ex alto,<br>
        illumináre his, qui in ténebris et in umbra mortis sedent,<br>
        ad dirigéndos pedes nostros in viam pacis.
      </p>
      <p>
        Glória Patri, et Fílio, et Spirítui Sancto.<br>
        Sicut erat in princípio, et nunc, et semper,<br>
        et in sǽcula sæculórum. Amen.
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CrossComponent from "@/modules/app/components/molecules/prayers/CrossComponent.vue";
import {formatText} from "@/modules/app/constants/formatText.ts";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";

const settingsStore = useSettingsStore();
</script>
<style scoped>
.prayer-content {
  padding-top: 1em;
}
</style>