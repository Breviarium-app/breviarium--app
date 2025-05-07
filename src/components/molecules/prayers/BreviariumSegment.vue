<template>
  <ion-segment :value="value" @ionChange="handleSegmentChange">
    <slot/>
  </ion-segment>
</template>

<script lang="ts" setup>
import {IonSegment} from "@ionic/vue";

defineProps({
  value: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(["update:value"]);

function handleSegmentChange(event: CustomEvent) {
  emit("update:value", event.detail.value);
}
</script>

<style scoped>
ion-segment {
  justify-content: space-between;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  ion-segment-button.segment-button {
    flex: 1 0 100px;
  }
}
</style>
