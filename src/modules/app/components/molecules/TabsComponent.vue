<template>
  <nav :class="['floating-tabbar', { hidden: !visible }]">
    <a
        v-for="tab in tabs"
        :key="tab.path"
        :class="{ active: isActive(tab.path) }"
        :href="tab.path"
        class="tab-item"
        @click.prevent="navigate(tab.path)"
    >
      <ion-icon :icon="tab.icon"/>
      <span class="tab-label">{{ tab.label }}</span>
    </a>
  </nav>
</template>
<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {IonIcon} from '@ionic/vue';
import {bonfireOutline, listOutline, settingsOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const {t} = useI18n();

const visible = ref(true);
let lastScrollTop = 0;
let currentScrollEl: HTMLElement | null = null;
let scrollListener: (() => void) | null = null;
const SCROLL_THRESHOLD = 10;

const tabs = computed(() => [
  {path: '/home', icon: bonfireOutline, label: t('home')},
  {path: '/prayer-intentions', icon: listOutline, label: t('prayer_intentions')},
  {path: '/settings', icon: settingsOutline, label: t('settings.title')},
]);

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const navigate = (path: string) => {
  router.push(path);
};

const onScroll = () => {
  if (!currentScrollEl) return;
  const scrollTop = currentScrollEl.scrollTop;
  const delta = scrollTop - lastScrollTop;

  if (Math.abs(delta) > SCROLL_THRESHOLD) {
    visible.value = delta < 0;
    lastScrollTop = scrollTop;
  }
};

let observer: MutationObserver | null = null;
let debounceTimer: number | null = null;

const findActiveContent = (): HTMLIonContentElement | null => {
  const pages = document.querySelectorAll('ion-router-outlet .ion-page:not(.ion-page-hidden)');
  if (!pages.length) return null;
  const topPage = pages[pages.length - 1];
  return topPage.querySelector('ion-content') as HTMLIonContentElement | null;
};

const attachScroll = async () => {
  detachScroll();

  const content = findActiveContent();
  if (!content) return;

  const scrollEl = await content.getScrollElement();
  if (!scrollEl) return;

  currentScrollEl = scrollEl;
  lastScrollTop = scrollEl.scrollTop;
  scrollListener = onScroll;
  scrollEl.addEventListener('scroll', scrollListener, {passive: true});
};

const detachScroll = () => {
  if (currentScrollEl && scrollListener) {
    currentScrollEl.removeEventListener('scroll', scrollListener);
  }
  currentScrollEl = null;
  scrollListener = null;
};

const scheduleAttach = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    visible.value = true;
    attachScroll();
  }, 400);
};

const startObserver = () => {
  const outlet = document.querySelector('ion-router-outlet');
  if (!outlet) return;

  observer = new MutationObserver(scheduleAttach);

  observer.observe(outlet, {
    childList: true,
    attributes: true,
    attributeFilter: ['class'],
  });
};

watch(() => route.path, () => {
  scheduleAttach();
});

onMounted(() => {
  startObserver();
  attachScroll();
});

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  detachScroll();
  observer?.disconnect();
  observer = null;
});
</script>
<style>
.floating-tabbar {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 9px);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 360px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 6px 8px;
  border-radius: 28px;
  background: var(--ion-tab-bar-background);
  backdrop-filter: blur(40px) saturate(1.8);
  -webkit-backdrop-filter: blur(40px) saturate(1.8);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08),
  0 0 0 0.5px rgba(255, 255, 255, 0.3) inset,
  0 1px 0 0.5px rgba(255, 255, 255, 0.2) inset;
  z-index: 999;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.floating-tabbar.hidden {
  transform: translateX(-50%) translateY(calc(100% + 20px));
  opacity: 0;
  pointer-events: none;
}

[data-theme="dark"] .floating-tabbar {
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.3),
  0 0 0 0.5px rgba(255, 255, 255, 0.08) inset,
  0 1px 0 0.5px rgba(255, 255, 255, 0.06) inset;
}

[data-theme="moon"] .floating-tabbar {
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.3),
  0 0 0 0.5px rgba(78, 130, 184, 0.15) inset,
  0 1px 0 0.5px rgba(78, 130, 184, 0.1) inset;
}

[data-theme="paper"] .floating-tabbar {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06),
  0 0 0 0.5px rgba(177, 119, 60, 0.15) inset,
  0 1px 0 0.5px rgba(255, 255, 255, 0.3) inset;
}

.floating-tabbar .tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  padding: 8px 4px;
  border-radius: 20px;
  color: var(--ion-tab-bar-color);
  text-decoration: none;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: color 0.2s ease, background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.floating-tabbar .tab-item ion-icon {
  font-size: 1.35rem;
}

.floating-tabbar .tab-item.active {
  color: var(--ion-tab-bar-color-selected, var(--ion-color-primary));
  background: rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.15);
}

.floating-tabbar .tab-label {
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}
</style>
