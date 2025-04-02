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
  --indicator-color: var(--reference-bible-color);
  min-width: auto;
}

ion-segment-button ion-label {
  text-transform: capitalize;
}

/* Material Design styles */
ion-segment-button.md {
  --color-checked: var(--reference-bible-color);
  --indicator-height: 4px;
}

/* iOS styles */
ion-segment-button.ios {
  --color: var(--reference-bible-color);
  --color-checked: #fff;
  --border-radius: 20px;
}
</style>
