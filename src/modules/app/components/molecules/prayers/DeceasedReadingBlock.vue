<template>
  <div>
    <h5 class="title-color reading-title">{{ title }}</h5>
    <p class="cita"><i>{{ subtitle }}</i></p>
    <p class="reference-bible cita">{{ reference }}</p>
    <div v-html="body"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  subtitle: string;
  reference: string;
  body: string;
}>();
</script>

<style scoped>
.cita {
  text-align: center;
}

.reference-bible {
  text-align: right;
}

.reading-title {
  margin-top: 1rem;
}
</style>
