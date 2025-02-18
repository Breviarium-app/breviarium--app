<script lang="ts" setup>

import {ref} from "vue";
import {Sanctus} from "sanctus";

const saintOfDay = ref('');

let sanctus = new Sanctus();
const saint: any = sanctus.getSaint();
const name = saint ? saint.name : '';
console.log(name);
saintOfDay.value = name;

</script>
<template>
  <div class="saint-day">{{ saintOfDay }}</div>
</template>
<style scoped>

.saint-day {
  color: var(--ion-color-danger);
  font-size: 0.9em;
  margin-top: 0.5rem;
}

</style>