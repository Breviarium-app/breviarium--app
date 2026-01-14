<script lang="ts" setup>
import {onMounted, ref} from 'vue'

const props = defineProps<{
  delay?: number,
  animationType?: 'slide-up' | 'slide-in-right' | 'fade-in' | 'scale-in'
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
    animationType || 'slide-up',
    isVisible ? 'visible' : ''
  ]">
    <slot></slot>
  </div>
</template>

<style scoped>
.animated-element {
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

.slide-up {
  transform: translateY(20px);
}

.slide-in-right {
  transform: translateX(20px);
}

.fade-in {
  transform: none;
}

.scale-in {
  transform: scale(0.95);
}

.visible {
  opacity: 1;
  transform: translate(0, 0) scale(1);
}
</style>