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
import {useAlertsStore} from "@/modules/app/stores/alertsStore.ts";
import {NotificationService} from "@/modules/app/services/NotificationService.ts";
import {isEaster} from "@/modules/app/constants/utils.ts";

const store = useSettingsStore();
const router = useRouter();
const alertsStore = useAlertsStore();

// Tapping a reminder opens today's prayer, even if another day was being browsed
const openAlert = async (extra: Record<string, unknown> | undefined) => {
  useDateStore().setDate(new Date());
  let route = extra?.route;
  if (extra?.alert === 'angelus') {
    const easter = await isEaster().catch(() => false);
    route = easter ? '/popular-prayers/regina-coeli' : '/popular-prayers/angelus';
  }
  if (typeof route === 'string') router.push(route);
};

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

  if (alertsStore.isSupported) {
    alertsStore.load();
    NotificationService.onOpened(openAlert);
    // Notification permissions may have changed in the system settings meanwhile
    CapacitorApp.addListener('resume', () => alertsStore.refreshPermissions());
  }

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
