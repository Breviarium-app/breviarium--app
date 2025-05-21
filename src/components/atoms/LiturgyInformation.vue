<script lang="ts" setup>
import {onMounted, ref} from "vue";
import Breviarium from "breviarium";
import {useDateStore} from "@/stores/useDateStore.ts";

const liturgyInfo = ref();

onMounted(async () => {
  const brev = new Breviarium(useDateStore().getCurrentDate);
  brev.getLiturgyInformation().then(data => {
    console.log("liturgyInfo", data)
    liturgyInfo.value = data
  });
})
</script>
<template>
  <!--  <p>{{ liturgyInfo }}</p>-->
  <p class="title-color">Semana {{ liturgyInfo?.psaltery_week }} del salterio</p>
</template>

<style scoped>
</style>