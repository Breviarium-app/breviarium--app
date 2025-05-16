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
        <span v-if="todaySaint?.day">• Festividad: {{ todaySaint?.day }} de {{
            MONTH_SPANISH[todaySaint?.month - 1]
          }}</span>
      <span v-if="todaySaint?.birth"><br/>• Nacimiento: {{ todaySaint?.birth }}</span>
      <span v-if="todaySaint?.dead"><br/>• Muerte: {{ todaySaint?.dead }}</span>
      <span v-if="todaySaint?.meaning"><br/>• Significado: {{ todaySaint?.meaning }}</span>
      <span v-if="todaySaint?.description"><br/>📜 {{ todaySaint?.description }}</span>
    </p>

    <div v-if="saintsOfDay.length > 1">
      <h4>Más santos</h4>
      <p>En el día de hoy la Iglesia celebra también:</p>
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