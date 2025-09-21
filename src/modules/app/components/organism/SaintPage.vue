<script lang="ts" setup>
import {IonLabel} from '@ionic/vue';
import {useSanctusStore} from "@/modules/app/stores/sanctus.ts";
import {MONTH_SPANISH} from "@/modules/app/constants";
import {ref} from "vue";
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";

const {selectedSaint, saintsOfDay} = useSanctusStore();
let todaySaint = ref<any | undefined>(selectedSaint);
</script>
<template>
  <PrayerPage :title="todaySaint?.name">
    <div>
      <b>VIDA</b>
      <p v-if="todaySaint?.day">Festividad: {{ todaySaint?.day }} de {{
          MONTH_SPANISH[todaySaint?.month - 1]
        }}</p>
      <p v-if="todaySaint?.birth">Nacimiento: {{ todaySaint?.birth }}</p>
      <p v-if="todaySaint?.dead">Muerte: {{ todaySaint?.dead }}</p>
      <p v-if="todaySaint?.meaning">Significado: {{ todaySaint?.meaning }}</p>
      <p v-if="todaySaint?.description"><b>HISTORIA</b><br/>{{ todaySaint?.description }}</p>
    </div>

    <div v-if="saintsOfDay && saintsOfDay?.length > 1">
      <h4>Más santos</h4>
      <p>En el día de hoy se celebra:</p>
      <ul>
        <li v-for="(saint, index) in saintsOfDay?.slice(1)" :key="index">{{ saint.name }}</li>
      </ul>
    </div>

    <ion-label>
      <p class="footer">
        <a href="https://breviarium.es/" target="_blank">Breviarium Project</a> • <a
          href="https://breviarium.es/sanctus/" target="_blank">Sanctus</a>
      </p>
    </ion-label>
  </PrayerPage>
</template>
<style scoped>
p {
  text-align: left;
}

h2 {
  color: var(--breviarium-primary);
}

.footer {
  text-align: center;
  padding: 1.5em 0;
}
</style>