<script lang="ts" setup>

import {ref} from "vue";
import {SaintInfo, Sanctus} from "sanctus";

let sanctus = new Sanctus();
const saint: SaintInfo | undefined = sanctus.getSaint(new Date(2025, 5, 1));

const saintOfDay = ref('');
if (saint != undefined) {
  saintOfDay.value = saint?.name;
}


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