<template>
  <div aria-hidden="true" class="safe-area-fade"/>
  <nav :aria-label="t('navigation')" :class="['floating-tabbar', { hidden: !visible, native: isNative }]" :style="{ '--tab-count': tabs.length }"
       @click="reveal" @focusin="reveal">
    <span :style="{ transform: `translateX(${activeIndex * 100}%)` }" aria-hidden="true" class="tab-indicator"/>
    <a
        v-for="tab in tabs"
        :key="tab.path"
        :aria-current="tab.path === activeTab ? 'page' : undefined"
        :class="{ active: tab.path === activeTab }"
        :href="tab.path"
        class="tab-item"
        @click.prevent="navigate(tab.path)"
    >
      <ion-icon :icon="tab.path === activeTab ? tab.activeIcon : tab.icon" aria-hidden="true"/>
      <span class="tab-label">{{ tab.label }}</span>
    </a>
  </nav>
</template>
<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {IonIcon} from '@ionic/vue';
import {bonfire, bonfireOutline, journal, journalOutline, list, listOutline, settings, settingsOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {Capacitor} from '@capacitor/core';
import HapticsService from "@/modules/app/services/HapticsService.ts";

const route = useRoute();
const router = useRouter();
const {t} = useI18n();

const visible = ref(true);
// Native apps hide the tabbar completely on scroll down; web keeps a peek strip that can be tapped to bring it back
const isNative = Capacitor.isNativePlatform();
let lastScrollTop = 0;
let currentScrollEl: HTMLElement | null = null;
let scrollListener: (() => void) | null = null;
const SCROLL_THRESHOLD = 10;

const HOME_PATH = '/home';
const MAIN_PATHS = [HOME_PATH, '/prayer-intentions', '/diary', '/settings'];

// On the 4 principal screens the tabbar stays put; it only hides on scroll for secondary/reading screens
const isMainScreen = computed(() => MAIN_PATHS.includes(route.path));

const tabs = computed(() => [
  {path: HOME_PATH, icon: bonfireOutline, activeIcon: bonfire, label: t('home')},
  {path: '/prayer-intentions', icon: listOutline, activeIcon: list, label: t('prayer_intentions')},
  {path: '/diary', icon: journalOutline, activeIcon: journal, label: t('diary.tab')},
  {path: '/settings', icon: settingsOutline, activeIcon: settings, label: t('settings.title')},
]);

// Prayers, Bible and saints are opened from Home, so Home stays active for any route outside the other tabs
const activeTab = computed(() => {
  const match = tabs.value.find((tab) => tab.path !== HOME_PATH
      && (route.path === tab.path || route.path.startsWith(tab.path + '/')));
  return match?.path ?? HOME_PATH;
});

const activeIndex = computed(() => tabs.value.findIndex((tab) => tab.path === activeTab.value));

const reveal = () => {
  visible.value = true;
};

const navigate = (path: string) => {
  HapticsService.light();
  // Tapping the tab of the page already on screen scrolls it back to the top
  if (route.path === path) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    findActiveContent()?.scrollToTop(reduceMotion ? 0 : 300);
    return;
  }
  router.push(path);
};

const onScroll = () => {
  if (!currentScrollEl) return;
  if (isMainScreen.value) {
    visible.value = true;
    return;
  }
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
/* Themed gradient + progressive blur over the bottom safe area, so content fades out behind the system navigation bar */
.safe-area-fade {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--ion-safe-area-bottom, 0px) + 56px);
  pointer-events: none;
  z-index: 998;
  background: linear-gradient(to top, var(--background), transparent);
  background: linear-gradient(to top, var(--background) 0%, color-mix(in srgb, var(--background) 75%, transparent) 45%, transparent 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -webkit-mask-image: linear-gradient(to top, #000 35%, transparent 100%);
  mask-image: linear-gradient(to top, #000 35%, transparent 100%);
}

.floating-tabbar {
  --tabbar-offset: 9px;
  --tabbar-peek: 10px;
  position: fixed;
  bottom: calc(var(--ion-safe-area-bottom, 0px) + var(--tabbar-offset));
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 360px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 6px;
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

/* Leaves a strip of the bar visible above the safe area; tapping it brings the bar back. */
.floating-tabbar.hidden {
  transform: translateX(-50%) translateY(calc(100% + var(--tabbar-offset) - var(--tabbar-peek)));
  cursor: pointer;
}

.floating-tabbar.hidden .tab-item {
  pointer-events: none;
}

/* Enlarges the touch target of the visible strip to 24px. */
.floating-tabbar.hidden::before {
  content: '';
  position: absolute;
  top: -14px;
  left: 0;
  right: 0;
  height: 24px;
}

/* Native: slide fully off screen; scrolling up reveals it again. */
.floating-tabbar.hidden.native {
  transform: translateX(-50%) translateY(calc(100% + var(--tabbar-offset) + var(--ion-safe-area-bottom, 0px)));
  opacity: 0;
  pointer-events: none;
  cursor: default;
}

.floating-tabbar.hidden.native::before {
  display: none;
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

/* Tinted pill behind the active tab; one tab wide, slid into place by translateX(index * 100%) */
.floating-tabbar .tab-indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 6px;
  width: calc((100% - 12px) / var(--tab-count));
  border-radius: 22px;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.floating-tabbar .tab-indicator::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--ion-color-primary);
  opacity: 0.12;
}

[data-theme="dark"] .floating-tabbar .tab-indicator::before,
[data-theme="moon"] .floating-tabbar .tab-indicator::before {
  opacity: 0.22;
}

.floating-tabbar .tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex: 1;
  min-width: 0;
  padding: 7px 4px 6px;
  border-radius: 22px;
  color: var(--ion-tab-bar-color);
  text-decoration: none;
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  transition: color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.floating-tabbar .tab-item ion-icon {
  font-size: 1.3rem;
  transition: transform 0.2s ease;
}

.floating-tabbar .tab-item:active ion-icon {
  transform: scale(0.9);
}

.floating-tabbar .tab-item.active {
  color: var(--ion-color-primary);
}

@media (prefers-reduced-motion: reduce) {
  .floating-tabbar,
  .floating-tabbar .tab-indicator,
  .floating-tabbar .tab-item ion-icon {
    transition: none;
  }
}

.floating-tabbar .tab-label {
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}
</style>
