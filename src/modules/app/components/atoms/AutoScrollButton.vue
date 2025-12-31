<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { playOutline, pauseOutline } from 'ionicons/icons';
import { useSettingsStore } from '@/modules/app/stores/settingsStore';

const settingsStore = useSettingsStore();

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
  if (props.scrollContainer) {
    scrollElement = document.querySelector(props.scrollContainer);
  } else {
    const ionContent = document.querySelector('ion-content');
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
  <ion-fab v-if="settingsStore.settings.showAutoScroll" vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button
      @click="toggleScroll"
      size="small"
      class="custom-fab-button"
    >
      <ion-icon
        :icon="isScrolling ? pauseOutline : playOutline"
        :class="{ 'play-icon': !isScrolling }"
      />
    </ion-fab-button>
  </ion-fab>
</template>

<style scoped>
ion-fab {
  margin: 16px;
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

.play-icon {
  transform: translateX(2px);
}

@media (min-width: 768px) {
  ion-fab {
    margin: 24px;
  }
}
</style>