<template>
  <ion-item class="prayer-item" @click="router.push('/saint')">
    <ion-label>
      <h2>Santoral</h2>
      <p>{{ todaySaint?.name }} y {{ saintsOfDayPrint }} más</p>
    </ion-label>
  </ion-item>
</template>
<script lang="ts" setup>
import {useSanctusStore} from "@/stores/sanctus.ts";
import {onMounted, ref, watch} from "vue";
import router from "@/router";
import {IonItem, IonLabel} from "@ionic/vue";
import {useDateStore} from "@/stores/useDateStore.ts";

const todaySaint = ref();
const saintsOfDayPrint = ref();

const updateSaintData = async () => {
  const {selectedSaint, saintsOfDay} = useSanctusStore();
  todaySaint.value = selectedSaint;
  if (saintsOfDay) {
    saintsOfDayPrint.value = saintsOfDay?.length - 1;
  }
};

watch(
    () => useDateStore().getCurrentDate,
    () => updateSaintData()
);

onMounted(async () => {
  await updateSaintData();
});
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