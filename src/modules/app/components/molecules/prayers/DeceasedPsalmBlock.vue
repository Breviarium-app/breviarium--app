<template>
  <div>
    <div v-if="ant" v-html="ant"></div>
    <p v-if="title" class="title-color cita">{{ title }}</p>
    <p v-if="subtitle" class="title-color cita"><i>{{ subtitle }}</i></p>
    <div v-html="body"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string;
  subtitle?: string;
  ant?: string;
  body: string;
}>();
</script>

<style scoped>
.cita {
  text-align: center;
}
</style>
