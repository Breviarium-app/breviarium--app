<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, getCurrentInstance, watch } from 'vue';
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { arrowDownOutline, pauseOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { useSettingsStore } from '@/modules/app/stores/settingsStore';
import { useTabbarVisibility } from '@/modules/app/composables/useTabbarVisibility';
import { useTextToSpeechActive } from '@/modules/app/composables/useTextToSpeechActive';

const settingsStore = useSettingsStore();
const tabbarVisible = useTabbarVisibility();
// The text-to-speech reader follows the text itself and puts its settings button here
const textToSpeechActive = useTextToSpeechActive();
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

watch(textToSpeechActive, (active) => {
  if (active) stopScroll();
});

onUnmounted(() => {
  stopScroll();
});
</script>

<template>
  <Transition name="fab-swap">
  <ion-fab
      v-if="settingsStore.settings.showAutoScroll && !textToSpeechActive"
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
  </Transition>
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

.fab-swap-enter-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1), bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease, bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-swap-enter-from,
.fab-swap-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

@media (prefers-reduced-motion: reduce) {
  ion-fab,
  .fab-swap-enter-active,
  .fab-swap-leave-active {
    transition: none;
  }
}

.custom-fab-button {
  --box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  --background: var(--ion-color-primary);
  --background-hover: white;
  --background-focused: var(--ion-color-primary);
  --background-activated: white;
  --color: white;
  --color-hover: #ff4444;
  --color-focused: white;
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
