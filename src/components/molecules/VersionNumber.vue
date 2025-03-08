<template>
  <ion-col>
    <p class="version">{{ $t('title') }} · Version {{ versionApp }}</p>
  </ion-col>
</template>
<script lang="ts" setup>
import {version} from "../../../package.json"

const versionApp = version
</script>
<style scoped>
.version {
  color: var(--ion-text-color);
  text-align: center;
  opacity: 0.6;
}

</style>