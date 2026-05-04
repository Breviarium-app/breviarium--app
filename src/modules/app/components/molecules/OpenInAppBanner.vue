<template>
  <div v-if="showBanner" class="open-in-app-banner">
    <span class="banner-text">Abrir en la app de Breviarium</span>
    <a class="banner-open-btn" :href="deeplink" @click="openApp">Abrir</a>
    <button class="banner-close-btn" @click="dismiss" aria-label="Cerrar">&times;</button>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {Capacitor} from '@capacitor/core';

const route = useRoute();
const dismissed = ref(false);
const isMobileWeb = ref(false);

const DISMISS_KEY = 'breviarium-open-in-app-dismissed';

onMounted(() => {
  dismissed.value = localStorage.getItem(DISMISS_KEY) === 'true';
  isMobileWeb.value = !Capacitor.isNativePlatform() && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
});

const showBanner = computed(() => isMobileWeb.value && !dismissed.value);

const deeplink = computed(() => {
  const path = route.fullPath === '/' ? '' : route.fullPath;
  return 'breviarium:/' + path;
});

function openApp(e: Event) {
  e.preventDefault();
  const isAndroid = /Android/i.test(navigator.userAgent);
  const storeUrl = isAndroid
    ? 'https://play.google.com/store/apps/details?id=com.breviarium.app'
    : 'https://apps.apple.com/us/app/breviarium/id6745237300';
  const timeout = setTimeout(() => { window.location.href = storeUrl; }, 1500);
  window.addEventListener('blur', () => clearTimeout(timeout), {once: true});
  window.location.href = deeplink.value;
}

function dismiss() {
  dismissed.value = true;
  localStorage.setItem(DISMISS_KEY, 'true');
}
</script>

<style scoped>
.open-in-app-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--ion-color-primary, #3880ff);
  color: #fff;
  font-size: 14px;
  z-index: 99999;
}

.banner-text {
  flex: 1;
}

.banner-open-btn {
  padding: 4px 14px;
  border-radius: 16px;
  background: #fff;
  color: var(--ion-color-primary, #3880ff);
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
}

.banner-close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  line-height: 1;
  padding: 0 4px;
  cursor: pointer;
  opacity: 0.8;
}
</style>
