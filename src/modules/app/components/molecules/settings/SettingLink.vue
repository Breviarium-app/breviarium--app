<template>
  <button class="setting-row btn" type="button" @click="emit('click')">
    <span class="setting-text">
      <span class="setting-label">{{ label }}</span>
      <span v-if="hint" class="setting-hint">{{ hint }}</span>
    </span>
    <span v-if="value" class="setting-value">{{ value }}</span>
    <ion-icon :icon="chevronForward" aria-hidden="true" class="chevron"/>
  </button>
</template>

<script lang="ts" setup>
import {IonIcon} from "@ionic/vue";
import {chevronForward} from "ionicons/icons";

defineProps<{
  label: string;
  hint?: string;
  // Current state shown before the chevron, e.g. "2 activos"
  value?: string;
}>();

const emit = defineEmits<{ click: [] }>();
</script>

<style scoped>
.setting-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.8rem 1rem;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.15s ease;
}

.setting-row:active {
  background: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.05);
}

.setting-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.setting-label {
  line-height: 1.35;
}

.setting-hint {
  font-size: 0.8rem;
  line-height: 1.4;
  opacity: 0.6;
}

.setting-value {
  flex-shrink: 0;
  font-size: 0.9rem;
  opacity: 0.6;
}

.chevron {
  flex-shrink: 0;
  font-size: 1.1rem;
  opacity: 0.4;
}

@media (prefers-reduced-motion: reduce) {
  .setting-row {
    transition: none;
  }
}
</style>
