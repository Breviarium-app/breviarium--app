<template>
  <div class="timer-meditation">
    <div v-if="!timerRunning" class="timer-selector">
      <h5 class="title-color">{{ $t('selectDuration') }}</h5>
      <div class="preset-buttons">
        <ion-button
            v-for="preset in presets"
            :key="preset"
            :color="selectedMinutes === preset ? 'primary' : 'medium'"
            fill="outline"
            @click="selectPreset(preset)"
        >
          {{ preset }} min
        </ion-button>
      </div>

      <div class="custom-time-section">
        <ion-item lines="none">
          <ion-label>{{ $t('customTime') }}:</ion-label>
          <ion-input
              v-model.number="customMinutes"
              :placeholder="$t('minutes')"
              max="120"
              min="1"
              type="number"
              @ionChange="selectCustomTime"
          ></ion-input>
        </ion-item>
      </div>

      <ion-button
          :disabled="!selectedMinutes || selectedMinutes <= 0"
          class="start-button"
          expand="block"
          @click="startTimer"
      >
        {{ $t('startTimer') }}
      </ion-button>
    </div>

    <div v-else class="timer-display">
      <div class="timer-circle">
        <svg class="progress-ring" viewBox="0 0 100 100">
          <circle
              class="progress-ring__background"
              cx="50"
              cy="50"
              r="45"
          />
          <circle
              :style="{ strokeDashoffset: progressOffset }"
              class="progress-ring__circle"
              cx="50"
              cy="50"
              r="45"
          />
        </svg>
        <div class="timer-text">
          <h2 class="title-color">{{ formattedTime }}</h2>
        </div>
      </div>

      <div class="timer-controls">
        <ion-button
            v-if="!isPaused"
            color="warning"
            fill="outline"
            @click="pauseTimer"
        >
          {{ $t('pause') }}
        </ion-button>
        <ion-button
            v-else
            color="success"
            fill="outline"
            @click="resumeTimer"
        >
          {{ $t('resume') }}
        </ion-button>
        <ion-button
            color="danger"
            fill="outline"
            @click="stopTimer"
        >
          {{ $t('stop') }}
        </ion-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {IonButton, IonInput, IonItem, IonLabel} from '@ionic/vue';
import {App} from '@capacitor/app';
import {Preferences} from '@capacitor/preferences';
import {Haptics, ImpactStyle, NotificationType} from '@capacitor/haptics';

const presets = [5, 10, 15];
const selectedMinutes = ref<number>(0);
const customMinutes = ref<number | null>(null);
const timerRunning = ref(false);
const isPaused = ref(false);
const remainingSeconds = ref(0);
const totalSeconds = ref(0);
let intervalId: number | null = null;
let backgroundStartTime: number | null = null;
const audio = ref<HTMLAudioElement | null>(null);

const TIMER_STORAGE_KEY = 'meditation_timer_state';

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60);
  const seconds = remainingSeconds.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const progressOffset = computed(() => {
  const circumference = 2 * Math.PI * 45;
  const progress = remainingSeconds.value / totalSeconds.value;
  return circumference * (1 - progress);
});

const selectPreset = (minutes: number) => {
  selectedMinutes.value = minutes;
  customMinutes.value = null;
};

const selectCustomTime = () => {
  if (customMinutes.value && customMinutes.value > 0) {
    selectedMinutes.value = customMinutes.value;
  }
};

const startTimer = async () => {
  if (selectedMinutes.value <= 0) return;

  totalSeconds.value = selectedMinutes.value * 60;
  remainingSeconds.value = totalSeconds.value;
  timerRunning.value = true;
  isPaused.value = false;
  backgroundStartTime = Date.now();

  await saveTimerState();
  runTimer();

  // Haptic feedback
  try {
    await Haptics.impact({style: ImpactStyle.Medium});
  } catch (e) {
    console.log('Haptics not available');
  }
};

const runTimer = () => {
  intervalId = window.setInterval(async () => {
    if (!isPaused.value) {
      remainingSeconds.value--;

      if (remainingSeconds.value <= 0) {
        await timerComplete();
      } else {
        await saveTimerState();
      }
    }
  }, 1000);
};

const pauseTimer = async () => {
  isPaused.value = true;
  await saveTimerState();

  try {
    await Haptics.impact({style: ImpactStyle.Light});
  } catch (e) {
    console.log('Haptics not available');
  }
};

const resumeTimer = async () => {
  isPaused.value = false;
  backgroundStartTime = Date.now();
  await saveTimerState();

  try {
    await Haptics.impact({style: ImpactStyle.Light});
  } catch (e) {
    console.log('Haptics not available');
  }
};

const stopTimer = async () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }

  timerRunning.value = false;
  isPaused.value = false;
  remainingSeconds.value = 0;
  backgroundStartTime = null;

  await clearTimerState();

  try {
    await Haptics.impact({style: ImpactStyle.Light});
  } catch (e) {
    console.log('Haptics not available');
  }
};

const timerComplete = async () => {
  await stopTimer();
  await playCompletionSound();

  try {
    await Haptics.notification({type: NotificationType.Success});
  } catch (e) {
    console.log('Haptics not available');
  }
};

const playCompletionSound = async () => {
  try {
    audio.value = new Audio('/meditation-bell.mp3');
    await audio.value.play();
  } catch (error) {
    console.error('Error playing completion sound:', error);
  }
};

const saveTimerState = async () => {
  const state = {
    running: timerRunning.value,
    paused: isPaused.value,
    remainingSeconds: remainingSeconds.value,
    totalSeconds: totalSeconds.value,
    backgroundStartTime: backgroundStartTime,
    timestamp: Date.now()
  };

  await Preferences.set({
    key: TIMER_STORAGE_KEY,
    value: JSON.stringify(state)
  });
};

const clearTimerState = async () => {
  await Preferences.remove({key: TIMER_STORAGE_KEY});
};

const restoreTimerState = async () => {
  try {
    const {value} = await Preferences.get({key: TIMER_STORAGE_KEY});

    if (value) {
      const state = JSON.parse(value);

      if (state.running) {
        // Calculate elapsed time since app went to background
        const elapsed = Math.floor((Date.now() - state.timestamp) / 1000);

        timerRunning.value = true;
        isPaused.value = state.paused;
        totalSeconds.value = state.totalSeconds;

        if (!state.paused) {
          remainingSeconds.value = Math.max(0, state.remainingSeconds - elapsed);

          if (remainingSeconds.value <= 0) {
            await timerComplete();
          } else {
            backgroundStartTime = Date.now();
            runTimer();
          }
        } else {
          remainingSeconds.value = state.remainingSeconds;
        }
      }
    }
  } catch (error) {
    console.error('Error restoring timer state:', error);
  }
};

onMounted(async () => {
  await restoreTimerState();

  // Listen for app state changes
  App.addListener('appStateChange', async ({isActive}) => {
    if (isActive) {
      // App came to foreground
      await restoreTimerState();
    } else {
      // App went to background
      await saveTimerState();
    }
  });
});

onUnmounted(async () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  if (timerRunning.value) {
    await saveTimerState();
  }

  App.removeAllListeners();
});
</script>

<style scoped>
.timer-meditation {
  margin: 20px 0;
  padding: 20px;
  border-radius: 12px;
  background: var(--ion-background-color);
}

.timer-selector {
  text-align: center;
}

.preset-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.custom-time-section {
  margin: 20px 0;
}

.start-button {
  margin-top: 15px;
}

.timer-display {
  text-align: center;
}

.timer-circle {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 20px auto;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring__background {
  fill: none;
  stroke: var(--ion-color-light);
  stroke-width: 8;
}

.progress-ring__circle {
  fill: none;
  stroke: var(--ion-color-primary);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 283;
  transition: stroke-dashoffset 0.5s ease;
}

.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.timer-text h2 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}
</style>
