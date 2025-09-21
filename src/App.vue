<script lang="ts" setup>
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {onMounted} from "vue";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";

const store = useSettingsStore();

onMounted(() => {
  store.loadSettings().then(() => {
    store.saveSettings();
    store.applyTheme(store.settings.theme);
    // document.documentElement.style.fontSize = `${store.settings.fontSize}px`;
  }).catch(error => {
    console.error(error);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (store.settings.theme === 'system') {
      store.applyTheme('system');
    }
  })

  useDateStore();
  useBreviariumStore();


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
