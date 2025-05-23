<script lang="ts" setup>
import {onMounted, ref} from "vue";
import Breviarium from "breviarium";
import {useDateStore} from "@/stores/useDateStore.ts";
import {buildLocalDate} from "@/constants/utils.ts";

const liturgyInfo = ref();
const date = ref(useDateStore().getCurrentDate);

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
  <p>{{ buildLocalDate(date) }} | Semana {{ liturgyInfo?.psaltery_week }} del salterio</p>
  <p class=""></p>
</template>

<style scoped>
</style>