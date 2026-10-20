<template>
  <div class="colab">
    <a class="chip" href="https://breviarium.es/?utm_source=app_config_page" rel="noopener" target="_blank">
      <ion-icon :icon="logoGithub" aria-hidden="true"/>
      <span>{{ $t('opensource') }}</span>
    </a>
    <a aria-label="Contacto" class="chip" href="mailto:info@breviarium.es">
      <ion-icon :icon="mailOutline" aria-hidden="true"/>
      <span>info@breviarium.es</span>
    </a>
  </div>
</template>
<script lang="ts" setup>
import {IonIcon} from "@ionic/vue";
import {logoGithub, mailOutline} from 'ionicons/icons';
</script>
<style scoped>
.colab {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: var(--background-color-card);
  color: var(--ion-color-primary);
  font-size: 0.8rem;
  font-weight: 400;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.2s ease;
}

.chip:active {
  opacity: 0.6;
}

.chip ion-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .chip {
    transition: none;
  }
}
</style>
