<template>
  <div class="colab">
    <a href="https://breviarium--site.pages.dev/" target="_blank">
      <ion-icon :icon="logoGithub" class="icon-github"/>
      <br/>
      {{ $t('opensource_join_us') }}
    </a>
  </div>
</template>
<script lang="ts" setup>
import {IonIcon} from "@ionic/vue";
import {logoGithub} from 'ionicons/icons';
</script>
<style scoped>
.icon-github {
  width: 26px;
  height: 26px;
  vertical-align: -7px;
}

.colab {
  margin-top: 1em;
}
</style>