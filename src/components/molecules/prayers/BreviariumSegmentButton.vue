<template>
  <ion-segment-button
      :value="value"
      @click="handleClick"
  >
    <slot/>
  </ion-segment-button>
</template>

<script lang="ts" setup>
import {IonSegmentButton} from "@ionic/vue";
import HapticsService from "@/services/HapticsService.ts";

defineProps({
  value: {
    type: String,
    required: true,
  }
});

function handleClick() {
  HapticsService.light();
}

</script>

<style scoped>
ion-segment-button {
  --indicator-color: var(--ion-color-primary);
  min-width: auto;
}

ion-segment-button ion-label {
  text-transform: capitalize;
}

/* Material Design styles */
ion-segment-button.md {
  --color-checked: var(--ion-color-primary);
  --indicator-height: 4px;
}

/* iOS styles */
ion-segment-button.ios {
  --color: var(--ion-color-primary);
  --color-checked: #fff;
  --border-radius: 20px;
}
</style>
