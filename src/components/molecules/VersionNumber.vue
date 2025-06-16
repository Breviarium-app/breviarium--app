<template>
  <div class="version">
    <p>
      <a class="title-color" href="https://breviarium.es" target="_blank">{{ $t('title') }}.es</a> · {{ $t('version') }}
      {{ versionApp }}
    </p>
    <p>
      <OpenSourceGitHubComponent/>
    </p>
  </div>
</template>
<script lang="ts" setup>
import {version} from "../../../package.json"
import OpenSourceGitHubComponent from "@/components/molecules/OpenSourceGitHubComponent.vue";

const versionApp = version
</script>
<style scoped>
.version {
  color: var(--ion-text-color);
  text-align: center;
  opacity: 0.6;
  padding: 2em 0;
}

</style>