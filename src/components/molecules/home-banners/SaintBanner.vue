<script lang="ts" setup>

import {computed} from "vue";
import {useSanctusStore} from "@/stores/sanctus.ts";

const saintOfDay = computed(() => useSanctusStore().selectedSaint?.name);

</script>
<template>
  <router-link to="/saint">
    <div class="saint-day">{{ saintOfDay }}</div>
  </router-link>

</template>
<style scoped>

.saint-day {
  color: var(--breviarium-primary);
  font-size: 0.9em;
  margin-top: 0.5rem;
}

</style>