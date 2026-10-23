<template>
  <div :class="{ disabled, off: !alert.enabled }" class="setting-row">
    <div class="setting-text">
      <span class="setting-label">{{ label }}</span>
      <span v-if="hint" class="setting-hint">{{ hint }}</span>
    </div>
    <!-- Native time input: opens the system time picker and follows the device 12/24h format -->
    <input :aria-label="t('alerts.time_of', {prayer: name ?? label})" :disabled="disabled" :value="alert.time"
           class="time-input" required type="time" @change="onTimeChange"/>
    <ion-toggle :aria-label="name ?? label" :checked="alert.enabled" :disabled="disabled"
                @ionChange="emit('update:enabled', $event.detail.checked)"/>
  </div>
</template>

<script lang="ts" setup>
import {IonToggle} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import type {PrayerAlert} from "@/modules/app/constants/alerts.ts";

defineProps<{
  label: string;
  // Prayer name for screen readers, when the label doesn't say it
  name?: string;
  hint?: string;
  alert: PrayerAlert;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:enabled': [value: boolean];
  'update:time': [value: string];
}>();

const {t} = useI18n();

const onTimeChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  // Some pickers can clear the field; the store ignores anything that isn't "HH:mm"
  if (value) emit('update:time', value.slice(0, 5));
};
</script>

<style scoped>
.setting-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

.time-input {
  flex-shrink: 0;
  -webkit-appearance: none;
  appearance: none;
  min-width: 4.5rem;
  min-height: 2rem;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 8px;
  background: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.07);
  color: inherit;
  font: inherit;
  /* 16px keeps iOS from zooming in when the picker opens */
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  text-align: center;
  transition: opacity 0.2s ease;
}

.time-input:focus {
  outline: none;
}

.time-input:focus-visible {
  box-shadow: inset 0 0 0 1.5px var(--ion-color-primary);
}

.time-input::-webkit-date-and-time-value {
  text-align: center;
}

.off .time-input {
  opacity: 0.5;
}

.disabled .setting-text,
.disabled .time-input {
  opacity: 0.4;
}

ion-toggle {
  flex-shrink: 0;
}
</style>
