<script lang="ts" setup>

import {ref} from "vue";
import {Sanctus} from "sanctus";

const saintOfDay = ref('');

let sanctus = new Sanctus();
const saint: any = sanctus.getSaint();
const name = saint ? saint.name : '';
console.log(name);
saintOfDay.value = name;

console.log("17", sanctus.getSaint(new Date(2025, 1, 17)));

</script>
<template>
  <router-link to="/saint">
    <div class="saint-day">{{ saintOfDay }}</div>
  </router-link>

</template>
<style scoped>

.saint-day {
  color: var(--ion-color-primary);
  font-size: 0.9em;
  margin-top: 0.5rem;
}

</style>