<template>
  <ion-col>
    <div class="version">
      <p>
        {{ $t('title') }} · Version {{ versionApp }}
      </p>
      <p>
        <OpenSourceGitHubComponent/>
      </p>
    </div>
  </ion-col>
</template>
<script lang="ts" setup>
import {version} from "../../../package.json"
import {IonCol} from "@ionic/vue";
import OpenSourceGitHubComponent from "@/components/molecules/OpenSourceGitHubComponent.vue";

const versionApp = version
</script>
<style scoped>
.version {
  color: var(--ion-text-color);
  text-align: center;
  opacity: 0.6;
}

</style>