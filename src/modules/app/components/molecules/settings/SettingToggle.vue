<template>
  <div :class="{ disabled }" class="setting-row">
    <div class="setting-text">
      <span class="setting-label">{{ label }}</span>
      <span v-if="hint" class="setting-hint">{{ hint }}</span>
    </div>
    <ion-toggle :aria-label="label" :checked="modelValue" :disabled="disabled"
                @ionChange="emit('update:modelValue', $event.detail.checked)"/>
  </div>
</template>

<script lang="ts" setup>
import {IonToggle} from "@ionic/vue";

defineProps<{
  label: string;
  hint?: string;
  modelValue: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<style scoped>
.setting-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
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

.disabled .setting-text {
  opacity: 0.5;
}

ion-toggle {
  flex-shrink: 0;
}
</style>
