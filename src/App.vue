<script lang="ts" setup>
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {onMounted} from "vue";
import {useSettingsStore} from "@/stores/settingsStore.ts";

onMounted(() => {
  useSettingsStore().loadSettings();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useSettingsStore().settings.theme === 'system') {
      useSettingsStore().applyTheme('system');
    }
  })

});
</script>

<template>
  <ion-app>
    <div class="safe-area">
      <ion-router-outlet/>
    </div>
  </ion-app>
</template>
<style>
.safe-area {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
</style>
