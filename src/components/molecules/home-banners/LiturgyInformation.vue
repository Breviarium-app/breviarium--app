<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useBreviariumStore} from "@/stores/breviarium.ts";

const liturgyInfo = ref();

onMounted(async () => {
  await useBreviariumStore().getLiturgyInformation().then(data => {
    console.log("liturgyInfo", data)
    liturgyInfo.value = data
  });
})
</script>
<template>
  <!--  <p>{{ liturgyInfo }}</p>-->
  <p>{{ liturgyInfo?.celebration }}</p>
  <p>Semana {{ liturgyInfo?.psaltery_week }} del salterio</p>
</template>

<style scoped>
</style>