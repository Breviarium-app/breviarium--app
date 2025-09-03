<script lang="ts" setup>
import {onMounted, ref} from 'vue'

const props = defineProps<{
  delay?: number
}>()

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, props.delay || 0)
})
</script>

<template>
  <div :class="[
    'animated-element',
    isVisible ? 'visible' : ''
  ]">
    <slot></slot>
  </div>
</template>

<style scoped>
.animated-element {
  transition: all 0.2s ease-out;
  transform: translateY(15px);
  opacity: 0;
}

.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>