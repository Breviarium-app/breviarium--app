<template>
  <div class="version">
    <p>
      <a href="https://breviarium.es" target="_blank">{{ $t('title') }}.es</a> · {{ $t('version') }}
      {{ versionApp }}
    </p>
    <p>
      <OpenSourceGitHubComponent/>
    </p>
  </div>
</template>
<script lang="ts" setup>
import {version} from "../../../../../package.json"
import OpenSourceGitHubComponent from "@/modules/app/components/molecules/OpenSourceGitHubComponent.vue";

const versionApp = version
</script>
<style scoped>
.version {
  color: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.6);
  text-align: center;
  font-size: 0.9rem;
  padding: 1em 0 0 0;
}

.version :deep(a) {
  color: var(--ion-color-primary);
  font-weight: 400;
}

</style>