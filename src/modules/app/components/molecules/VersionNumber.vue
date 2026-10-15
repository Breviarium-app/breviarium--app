<template>
  <div class="version">
    <p>
      <a href="https://breviarium.es" target="_blank">{{ $t('title') }}.es</a> · {{ $t('version') }}
      {{ versionApp }}
    </p>
    <p v-if="!hideOpenSource">
      <OpenSourceGitHubComponent/>
    </p>
  </div>
</template>
<script lang="ts" setup>
import {version} from "../../../../../package.json"
import OpenSourceGitHubComponent from "@/modules/app/components/molecules/OpenSourceGitHubComponent.vue";

withDefaults(defineProps<{
  // Hides the "Proyecto open-source" link and contact email, for places that show that elsewhere
  hideOpenSource?: boolean;
}>(), {
  hideOpenSource: false,
});

const versionApp = version
</script>
<style scoped>
.version {
  color: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.6);
  text-align: center;
  font-size: 0.9rem;
  
}

.version :deep(a) {
  color: var(--ion-color-primary);
  font-weight: 400;
}

</style>