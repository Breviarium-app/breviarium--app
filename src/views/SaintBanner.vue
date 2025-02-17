<script lang="ts" setup>

import {ref} from "vue";

const saints = [
  'Saint Francis of Assisi',
  'Saint Teresa of Ávila',
  'Saint Augustine of Hippo',
  'Saint Thomas Aquinas',
  'Saint Catherine of Siena',
  'Saint Ignatius of Loyola',
  'Saint Benedict of Nursia',
  'Saint Thérèse of Lisieux',
  'Saint Patrick',
  'Saint Joan of Arc'
];

const saintOfDay = ref('');

const updateSaintOfDay: void = () => {
  const randomIndex = Math.floor(Math.random() * saints.length);
  saintOfDay.value = saints[randomIndex];
};

updateSaintOfDay();

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