<template>
  <div class="colab">
    <a href="https://breviarium.es/?utm_source=app_config_page" target="_blank">
      <ion-icon :icon="logoGithub" class="icon-github"/>
      <br/>
      {{ $t('opensource') }}
    </a>
    <p>Contacto: <a class="ion-color-primary" href="mailto:info@breviarium.es" target="_blank">info@breviarium.es</a>
    </p>
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

a {
  color: var(--breviarium-primary)
}

.colab {
  margin-top: 1em;
}
</style>