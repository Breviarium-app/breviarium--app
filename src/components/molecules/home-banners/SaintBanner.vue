<script lang="ts" setup>

import {ref} from "vue";
import {Sanctus} from "sanctus";

const saintOfDay = ref('');

let sanctus = new Sanctus();
const saint: any = sanctus.getSaint();
const name = saint ? saint.name : '';
saintOfDay.value = name;
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