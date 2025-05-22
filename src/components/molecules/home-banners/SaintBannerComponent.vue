<template>
  <ion-item class="prayer-item" @click="router.push('/saint')">
    <ion-label>
      <h2>Santoral</h2>
      <p>{{ todaySaint?.name }} y {{ saintsOfDay.length - 1 }} más</p>
    </ion-label>
  </ion-item>
</template>
<script lang="ts" setup>
import {useSanctusStore} from "@/stores/sanctus.ts";
import {ref} from "vue";
import router from "@/router";
import {IonItem, IonLabel} from "@ionic/vue";

const {selectedSaint, saintsOfDay} = useSanctusStore();
let todaySaint = ref<any | undefined>(selectedSaint);
</script>
<style scoped>

.prayer-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --border-radius: 8px;
  --background: var(--background-color-card);
  border: 0 solid var(--border-color);
}

</style>