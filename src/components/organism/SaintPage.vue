<script lang="ts" setup>
import {IonLabel} from '@ionic/vue';
import {useSanctusStore} from "@/stores/sanctus.ts";
import {MONTH_SPANISH} from "@/constants";
import {ref} from "vue";
import PrayerPage from "@/components/organism/PrayerPage.vue";

const {selectedSaint, saintsOfDay} = useSanctusStore();
let todaySaint = ref<any | undefined>(selectedSaint);
</script>
<template>
  <PrayerPage>
    <h2>{{ todaySaint?.name }}</h2>
    <p>
      <p v-if="todaySaint?.day">Festividad: {{ todaySaint?.day }} de {{
          MONTH_SPANISH[todaySaint?.month - 1]
        }}</p>
      <p v-if="todaySaint?.birth">Nacimiento: {{ todaySaint?.birth }}</p>
      <p v-if="todaySaint?.dead">Muerte: {{ todaySaint?.dead }}</p>
      <p v-if="todaySaint?.meaning">Significado: {{ todaySaint?.meaning }}</p>
      <p v-if="todaySaint?.description">Vida<br/>{{ todaySaint?.description }}</p>
    </p>

    <div v-if="saintsOfDay.length > 1">
      <h4>Más santos</h4>
      <p>En el día de hoy la Iglesia celebra a</p>
      <ul>
        <li v-for="(saint, index) in saintsOfDay.slice(1)" :key="index">{{ saint.name }}</li>
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