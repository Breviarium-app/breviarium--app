<template>
  <div class="version">
    <p class="version-line">
      <a href="https://breviarium.es" rel="noopener" target="_blank">{{ $t('title') }}.es</a>
      <span aria-hidden="true" class="dot">·</span>
      <ReleaseNotesHistory>
        <template #default="{open}">
          <button aria-haspopup="dialog" class="version-pill" type="button" @click="open">
            {{ $t('version') }} {{ versionApp }}
            <ion-icon :icon="chevronForward" aria-hidden="true"/>
          </button>
        </template>
      </ReleaseNotesHistory>
    </p>
    <OpenSourceGitHubComponent v-if="!hideOpenSource"/>
  </div>
</template>
<script lang="ts" setup>
import {IonIcon} from "@ionic/vue";
import {chevronForward} from "ionicons/icons";
import {version} from "../../../../../package.json"
import OpenSourceGitHubComponent from "@/modules/app/components/molecules/OpenSourceGitHubComponent.vue";
import ReleaseNotesHistory from "@/modules/onboarding/ReleaseNotesHistory.vue";

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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0 1rem;
  color: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.6);
  text-align: center;
  font-size: 0.85rem;
}

.version-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
}

.version :deep(a) {
  color: var(--ion-color-primary);
  font-weight: 400;
  text-decoration: none;
}

.version-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.25rem 0.5rem 0.25rem 0.7rem;
  border: 0;
  border-radius: 999px;
  background: var(--background-color-card);
  color: inherit;
  font-family: inherit;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.2s ease;
}

.version-pill:active {
  opacity: 0.6;
}

.version-pill ion-icon {
  font-size: 0.8rem;
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .version-pill {
    transition: none;
  }
}

.dot {
  opacity: 0.5;
}
</style>
