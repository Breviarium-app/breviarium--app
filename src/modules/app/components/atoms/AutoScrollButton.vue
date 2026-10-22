<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, getCurrentInstance } from 'vue';
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { arrowDownOutline, pauseOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { useSettingsStore } from '@/modules/app/stores/settingsStore';
import { useTabbarVisibility } from '@/modules/app/composables/useTabbarVisibility';

const settingsStore = useSettingsStore();
const tabbarVisible = useTabbarVisibility();
const isNative = Capacitor.isNativePlatform();

const props = defineProps({
  scrollContainer: {
    type: String,
    default: null,
  }
});

const isScrolling = ref(false);
let animationId: number | null = null;
let scrollElement: HTMLElement | null = null;
let scrollAccumulator = 0;

const toggleScroll = () => {
  if (isScrolling.value) {
    stopScroll();
  } else {
    startScroll();
  }
};

const scrollSpeed = computed(() => settingsStore.settings.autoScrollSpeed);

const startScroll = () => {
  isScrolling.value = true;
  scrollAccumulator = 0;

  const scroll = () => {
    if (!scrollElement) return;

    const pixelsPerFrame = (scrollSpeed.value / 33);

    scrollAccumulator += pixelsPerFrame;

    if (scrollAccumulator >= 1) {
      const pixelsToScroll = Math.floor(scrollAccumulator);
      scrollElement.scrollTop += pixelsToScroll;
      scrollAccumulator -= pixelsToScroll;
    }

    if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 10) {
      stopScroll();
      return;
    }

    animationId = requestAnimationFrame(scroll);
  };

  animationId = requestAnimationFrame(scroll);
};

const stopScroll = () => {
  isScrolling.value = false;
  scrollAccumulator = 0;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

onMounted(() => {
  const instance = getCurrentInstance();
  const componentEl = instance?.proxy?.$el;

  if (props.scrollContainer) {
    scrollElement = document.querySelector(props.scrollContainer);
  } else {
    const ionContent = componentEl?.closest?.('ion-content') as HTMLIonContentElement | null;
    if (ionContent) {
      ionContent.getScrollElement().then((element) => {
        scrollElement = element;
      });
    }
  }
});

onUnmounted(() => {
  stopScroll();
});
</script>

<template>
  <ion-fab
      v-if="settingsStore.settings.showAutoScroll"
      :class="{ 'tabbar-hidden': !tabbarVisible, 'tabbar-gone': !tabbarVisible && isNative }"
      vertical="bottom"
      horizontal="end"
      slot="fixed"
  >
    <ion-fab-button
      @click="toggleScroll"
      size="small"
      class="custom-fab-button"
    >
      <ion-icon :icon="isScrolling ? pauseOutline : arrowDownOutline"/>
    </ion-fab-button>
  </ion-fab>
</template>

<style scoped>
/* The fab sits just above the tabbar: tabbar top = safe area + 9px offset + ~60px bar height.
   When hidden, web leaves a 10px peek strip; native hides it completely. */
ion-fab {
  --tabbar-top: calc(var(--ion-safe-area-bottom, 0px) + 69px);
  margin: 16px;
  bottom: var(--tabbar-top) !important;
  transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

ion-fab.tabbar-hidden {
  --tabbar-top: calc(var(--ion-safe-area-bottom, 0px) + 19px);
}

ion-fab.tabbar-gone {
  --tabbar-top: var(--ion-safe-area-bottom, 0px);
}

@media (prefers-reduced-motion: reduce) {
  ion-fab {
    transition: none;
  }
}

.custom-fab-button {
  --box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  --background: var(--ion-color-primary);
  --background-hover: white;
  --background-focused: white;
  --background-activated: white;
  --color: white;
  --color-hover: #ff4444;
  --color-focused: #ff4444;
  --color-activated: #ff4444;
  position: relative;
}

.custom-fab-button::part(native) {
  transition: background-color 0.15s ease, color 0.15s ease;
}

.custom-fab-button:hover {
  --background: white;
}

.custom-fab-button:hover::part(native) {
  background-color: white !important;
}

.custom-fab-button:hover ion-icon {
  color: #ff4444 !important;
}

@media (min-width: 768px) {
  ion-fab {
    margin: 24px;
  }
}
</style>
