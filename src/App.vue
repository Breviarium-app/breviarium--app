<script lang="ts" setup>
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {onMounted} from "vue";
import {useSettingsStore} from "@/modules/app/stores/settingsStore.ts";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import {App as CapacitorApp} from '@capacitor/app';
import {useRouter} from 'vue-router';
import OpenInAppBanner from '@/modules/app/components/molecules/OpenInAppBanner.vue';
import WhatsNewModal from '@/modules/onboarding/WhatsNewModal.vue';

const store = useSettingsStore();
const router = useRouter();

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

  CapacitorApp.addListener('appUrlOpen', (event) => {
    const url = new URL(event.url);
    const path = url.host ? '/' + url.host + url.pathname : url.pathname;
    if (path && path !== '/') {
      router.push(path);
    }
  });
});
</script>

<template>
  <ion-app>
    <OpenInAppBanner/>
    <div class="safe-area">
      <ion-router-outlet/>
    </div>
    <WhatsNewModal/>
  </ion-app>
</template>
<style>
.safe-area {
  /* --ion-safe-area-* resolves to Capacitor's injected inset values on Android (older WebViews
     don't report env(safe-area-inset-*) correctly) and falls back to env() elsewhere */
  padding: var(--ion-safe-area-top) var(--ion-safe-area-right) var(--ion-safe-area-bottom) var(--ion-safe-area-left);
}
</style>
