<template>
  <div class="timer-meditation">
    <div v-if="!timerRunning" class="timer-selector">
      <div class="preset-buttons">
        <ion-button
            v-for="preset in presets"
            :key="preset"
            :color="selectedMinutes === preset ? 'primary' : 'medium'"
            :fill="selectedMinutes === preset ? 'solid' : 'outline'"
            class="preset-btn"
            shape="round"
            @click="selectPreset(preset)"
        >
          <ion-icon slot="start" :icon="timeOutline"></ion-icon>
          {{ preset }}m
        </ion-button>
        <ion-button
            :color="isCustomTime ? 'primary' : 'medium'"
            :fill="isCustomTime ? 'solid' : 'outline'"
            class="preset-btn"
            shape="round"
            @click="openCustomTimeModal"
        >
          <ion-icon slot="start" :icon="addCircleOutline"></ion-icon>
          {{ isCustomTime && customMinutes ? customMinutes + 'm' : $t('custom') }}
        </ion-button>
      </div>

      <ion-button
          :disabled="!selectedMinutes || selectedMinutes <= 0"
          class="start-button"
          expand="block"
          shape="round"
          size="large"
          @click="startTimer"
      >
        <ion-icon slot="start" :icon="playCircleOutline"></ion-icon>
        {{ $t('startTimer') }}
      </ion-button>
    </div>

    <div v-else class="timer-display">
      <div class="timer-circle-container">
        <div class="timer-circle">
          <svg class="progress-ring" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" style="stop-color:var(--ion-color-primary);stop-opacity:1"/>
                <stop offset="100%" style="stop-color:var(--ion-color-primary-shade);stop-opacity:1"/>
              </linearGradient>
            </defs>
            <circle
                class="progress-ring__background"
                cx="60"
                cy="60"
                r="54"
            />
            <circle
                :style="{ strokeDashoffset: progressOffset }"
                class="progress-ring__circle"
                cx="60"
                cy="60"
                r="54"
            />
          </svg>
          <div class="timer-text">
            <div class="time-display">{{ formattedTime }}</div>
            <div class="timer-label">{{ isPaused ? $t('paused') : $t('remaining') }}</div>
          </div>
        </div>
      </div>

      <div class="timer-controls">
        <ion-button
            v-if="!isPaused"
            color="warning"
            fill="solid"
            shape="round"
            size="large"
            @click="pauseTimer"
        >
          <ion-icon slot="start" :icon="pauseCircleOutline"></ion-icon>
          {{ $t('pause') }}
        </ion-button>
        <ion-button
            v-else
            color="success"
            fill="solid"
            shape="round"
            size="large"
            @click="resumeTimer"
        >
          <ion-icon slot="start" :icon="playCircleOutline"></ion-icon>
          {{ $t('resume') }}
        </ion-button>
        <ion-button
            color="danger"
            fill="outline"
            shape="round"
            size="large"
            @click="stopTimer"
        >
          <ion-icon slot="start" :icon="stopCircleOutline"></ion-icon>
          {{ $t('stop') }}
        </ion-button>
      </div>
    </div>

    <!-- Custom Time Modal -->
    <ion-modal :is-open="isModalOpen" @didDismiss="closeCustomTimeModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ $t('customTime') }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeCustomTimeModal">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="custom-time-modal">
          <div class="time-input-section">
            <h3 class="title-color">{{ $t('selectCustomDuration') }}</h3>

            <div class="time-pickers">
              <div class="time-picker">
                <ion-label>{{ $t('minutes') }}</ion-label>
                <ion-input
                    v-model.number="modalMinutes"
                    :placeholder="'0'"
                    class="time-input"
                    inputmode="numeric"
                    max="120"
                    min="0"
                    type="number"
                ></ion-input>
              </div>
              <div class="separator">:</div>
              <div class="time-picker">
                <ion-label>{{ $t('seconds') }}</ion-label>
                <ion-input
                    v-model.number="modalSeconds"
                    :placeholder="'0'"
                    class="time-input"
                    inputmode="numeric"
                    max="59"
                    min="0"
                    type="number"
                ></ion-input>
              </div>
            </div>

            <div class="quick-add-buttons">
              <ion-chip color="secondary" outline @click="addMinutes(1)">
                <ion-icon :icon="addOutline"></ion-icon>
                <ion-label>1m</ion-label>
              </ion-chip>
              <ion-chip color="secondary" outline @click="addMinutes(5)">
                <ion-icon :icon="addOutline"></ion-icon>
                <ion-label>5m</ion-label>
              </ion-chip>
              <ion-chip color="secondary" outline @click="addMinutes(10)">
                <ion-icon :icon="addOutline"></ion-icon>
                <ion-label>10m</ion-label>
              </ion-chip>
              <ion-chip color="danger" outline @click="resetCustomTime">
                <ion-icon :icon="refreshOutline"></ion-icon>
                <ion-label>{{ $t('reset') }}</ion-label>
              </ion-chip>
            </div>

            <div class="total-time">
              <p class="title-color">
                {{ $t('totalTime') }}: <strong>{{ totalCustomTime }}</strong>
              </p>
            </div>
          </div>

          <ion-button
              :disabled="!isValidCustomTime"
              expand="block"
              shape="round"
              size="large"
              @click="confirmCustomTime"
          >
            <ion-icon slot="start" :icon="checkmarkCircleOutline"></ion-icon>
            {{ $t('confirm') }}
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {
  addCircleOutline,
  addOutline,
  checkmarkCircleOutline,
  closeOutline,
  pauseCircleOutline,
  playCircleOutline,
  refreshOutline,
  stopCircleOutline,
  timeOutline
} from 'ionicons/icons';
import {App} from '@capacitor/app';
import {Preferences} from '@capacitor/preferences';
import {Haptics, ImpactStyle, NotificationType} from '@capacitor/haptics';

const presets = [5, 10, 15];
const selectedMinutes = ref<number>(0);
const customMinutes = ref<number | null>(null);
const isCustomTime = ref(false);
const timerRunning = ref(false);
const isPaused = ref(false);
const remainingSeconds = ref(0);
const totalSeconds = ref(0);
let intervalId: number | null = null;
let backgroundStartTime: number | null = null;
const audio = ref<HTMLAudioElement | null>(null);

// Modal state
const isModalOpen = ref(false);
const modalMinutes = ref<number>(0);
const modalSeconds = ref<number>(0);

const TIMER_STORAGE_KEY = 'meditation_timer_state';

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60);
  const seconds = remainingSeconds.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const progressOffset = computed(() => {
  const circumference = 2 * Math.PI * 54;
  const progress = remainingSeconds.value / totalSeconds.value;
  return circumference * (1 - progress);
});

const totalCustomTime = computed(() => {
  const mins = modalMinutes.value || 0;
  const secs = modalSeconds.value || 0;
  if (mins === 0 && secs === 0) return '0m';
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
});

const isValidCustomTime = computed(() => {
  return (modalMinutes.value || 0) > 0 || (modalSeconds.value || 0) > 0;
});

const selectPreset = (minutes: number) => {
  selectedMinutes.value = minutes;
  customMinutes.value = null;
  isCustomTime.value = false;
};

const openCustomTimeModal = () => {
  modalMinutes.value = customMinutes.value || 0;
  modalSeconds.value = 0;
  isModalOpen.value = true;
};

const closeCustomTimeModal = () => {
  isModalOpen.value = false;
};

const addMinutes = (mins: number) => {
  modalMinutes.value = (modalMinutes.value || 0) + mins;
  if (modalMinutes.value > 120) modalMinutes.value = 120;
};

const resetCustomTime = () => {
  modalMinutes.value = 0;
  modalSeconds.value = 0;
};

const confirmCustomTime = () => {
  const totalMinutes = (modalMinutes.value || 0) + (modalSeconds.value || 0) / 60;
  if (totalMinutes > 0) {
    const totalSecs = (modalMinutes.value || 0) * 60 + (modalSeconds.value || 0);
    selectedMinutes.value = totalSecs / 60;
    customMinutes.value = Math.floor(totalSecs / 60);
    isCustomTime.value = true;
    closeCustomTimeModal();
  }
};

const startTimer = async () => {
  if (selectedMinutes.value <= 0) return;

  totalSeconds.value = Math.round(selectedMinutes.value * 60);
  remainingSeconds.value = totalSeconds.value;
  timerRunning.value = true;
  isPaused.value = false;
  backgroundStartTime = Date.now();

  await saveTimerState();
  runTimer();

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

  await App.addListener('appStateChange', async ({isActive}) => {
    if (isActive) {
      await restoreTimerState();
    } else {
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

  await App.removeAllListeners();
});
</script>

<style scoped>
.timer-meditation {
  margin: 20px 0;
  padding: 24px;
  border-radius: 20px;
  background: var(--ion-card-background, var(--ion-background-color));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.timer-selector {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.preset-btn {
  --padding-start: 16px;
  --padding-end: 16px;
  font-weight: 600;
  font-size: 1rem;
}

.start-button {
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 8px;
}

.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.timer-circle-container {
  position: relative;
}

.timer-circle {
  position: relative;
  width: 240px;
  height: 240px;
  margin: 0 auto;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  filter: drop-shadow(0 4px 12px rgba(var(--ion-color-primary-rgb), 0.3));
}

.progress-ring__background {
  fill: none;
  stroke: var(--ion-color-light);
  stroke-width: 10;
}

.progress-ring__circle {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 339.292;
  transition: stroke-dashoffset 1s linear;
}

.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.time-display {
  font-size: 3rem;
  font-weight: 700;
  color: var(--ion-color-primary);
  line-height: 1;
  margin-bottom: 8px;
  font-variant-numeric: tabular-nums;
}

.timer-label {
  font-size: 0.875rem;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
}

.timer-controls ion-button {
  flex: 1;
  min-width: 120px;
  --padding-start: 20px;
  --padding-end: 20px;
  font-weight: 600;
}

/* Custom Time Modal */
.custom-time-modal {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
}

.time-input-section {
  flex: 1;
}

.time-input-section h3 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.25rem;
}

.time-pickers {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.time-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.time-picker ion-label {
  font-size: 0.875rem;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  font-weight: 600;
}

.time-input {
  --background: var(--background-accent);
  --padding-start: 16px;
  --padding-end: 16px;
  --border-radius: 12px;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  width: 100px;
  height: 80px;

}

.separator {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--ion-color-primary);
  margin-top: 24px;
}

.quick-add-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.quick-add-buttons ion-chip {
  cursor: pointer;
  font-weight: 600;
}

.total-time {
  text-align: center;
  font-size: 1.125rem;
  margin-bottom: 20px;
}

.total-time strong {
  color: var(--ion-color-primary);
  font-size: 1.5rem;
}
</style>
