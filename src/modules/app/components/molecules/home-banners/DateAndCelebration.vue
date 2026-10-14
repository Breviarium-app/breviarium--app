<template>
  <div ref="cardRef" :style="{ '--liturgical-color': color }" class="date-navigation">
    <ion-button aria-label="Día anterior" class="nav-button" fill="clear" @click="slideToDay(-1)">
      <ion-icon :icon="chevronBackOutline"></ion-icon>
    </ion-button>

    <div ref="contentRef" class="date-button" @click="onDateClick">
      <small class="date-label title-color">{{ buildLocalDate(printableDate) }}</small>
      <span class="celebration">{{ liturgyInformationData?.celebration }}</span>
      <small v-if="rank" class="rank">
        <CircleLiturgicalColor :liturgical-color-var="color"/>
        {{ rank }}
      </small>
    </div>

    <ion-button aria-label="Día siguiente" class="nav-button" fill="clear" @click="slideToDay(1)">
      <ion-icon :icon="chevronForwardOutline"></ion-icon>
    </ion-button>
  </div>

  <Teleport to="body">
    <ion-modal ref="modal" :is-open="isOpen" @didDismiss="setOpen(false)">
      <ion-header>
        <ion-toolbar>
          <ion-button slot="start" fill="clear" @click="setOpen(false)">Cerrar</ion-button>
          <ion-button slot="end" fill="clear" @click="goToday()">Hoy</ion-button>
        </ion-toolbar>
      </ion-header>

      <div class="modal-wrapper">
        <ion-datetime
            ref="datetimeRef"
            v-model="datetimeModel"
            :first-day-of-week="1"
            :prefer-wheel="false"
            :show-adjacent-days="true"
            locale="es-ES"
            max="2100-12-31"
            min="1990-01-01"
            presentation="date"
            size="cover"
            @ionChange="onDateChange($event)"
        >
        </ion-datetime>
      </div>
    </ion-modal>
  </Teleport>
</template>

<script lang="ts" setup>
import {buildLocalDate, rankTranslate} from "@/modules/app/constants/utils.ts";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {createGesture, type Gesture, IonButton, IonDatetime, IonHeader, IonIcon, IonModal, IonToolbar} from "@ionic/vue";
import CircleLiturgicalColor from "@/modules/app/components/atoms/CircleLiturgicalColor.vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";
import {chevronBackOutline, chevronForwardOutline} from "ionicons/icons";

const pad = (n: number) => String(n).padStart(2, "0");
const toIsoDateString = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseIsoDateString = (s: string) => {
  const datePart = s.split("T")[0];
  const [y, m, d] = datePart.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
};

const dateStore = useDateStore();
const breviariumStore = useBreviariumStore();

const isOpen = ref(false);
const datetimeModel = ref<string>(
    toIsoDateString(dateStore.getCurrentDate || new Date())
);
const datetimeRef = ref();
const printableDate = computed(() => parseIsoDateString(datetimeModel.value));

const liturgyInformationData = ref();
const color = ref();
const rank = ref();

async function onDateChange(event: any) {

  try {
    // Ensure the internal value of ion-datetime is committed
    datetimeRef.value?.$el?.confirm?.();
  } catch (e) {
  }

  console.log(event.detail.value);
  const newDate = event.detail.value;
  console.log("new date", newDate)
  datetimeModel.value = newDate;
  const selectedDate = parseIsoDateString(newDate);
  await updateLiturgy(selectedDate);
  HapticsService.light();

  isOpen.value = false;
}

/* Calendar funtions */
const setOpen = (open: boolean) => {
  HapticsService.light();
  isOpen.value = open;
};

const updateLiturgy = async (newDate: Date) => {
  dateStore.setDate(newDate);
  const data = await breviariumStore.getLiturgyInformation();
  liturgyInformationData.value = data;
  color.value = data?.color;
  if (data?.rank) {
    rank.value = await rankTranslate(data?.rank);
  }
};

const goToday = async () => {
  const today = new Date();
  datetimeModel.value = toIsoDateString(today);
  await updateLiturgy(today);
  setOpen(false);
  HapticsService.light();
};

const changeDate = (days: number) => {
  const current = parseIsoDateString(datetimeModel.value);
  current.setDate(current.getDate() + days);
  datetimeModel.value = toIsoDateString(current);
  updateLiturgy(current);
  HapticsService.light();
};

/* Swipe between days */
const SWIPE_DISTANCE = 60; // px dragged to change day
const SWIPE_VELOCITY = 0.3; // px/ms, so a quick flick also counts
const SLIDE_OFFSET = 80; // px the text travels when leaving or entering
const EASE_OUT = 'cubic-bezier(0.32, 0.72, 0, 1)';

const cardRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();
let gesture: Gesture | undefined;
let isSliding = false;
// A drag ends with a click on desktop; this keeps it from opening the calendar
let suppressClick = false;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setContentPosition = (x: number, opacity: number, transition = 'none') => {
  const el = contentRef.value;
  if (!el) return;
  el.style.transition = transition;
  el.style.transform = x ? `translateX(${x}px)` : '';
  el.style.opacity = opacity === 1 ? '' : String(opacity);
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Slides the current day out and the new one in from the opposite side
const slideToDay = async (days: number) => {
  if (isSliding) return;
  if (prefersReducedMotion()) {
    changeDate(days);
    return;
  }
  isSliding = true;
  const direction = days > 0 ? -1 : 1;
  setContentPosition(direction * SLIDE_OFFSET, 0, 'transform 0.15s ease-in, opacity 0.15s ease-in');
  await wait(150);
  changeDate(days);
  setContentPosition(-direction * SLIDE_OFFSET, 0);
  contentRef.value?.getBoundingClientRect(); // commit the start position before animating
  setContentPosition(0, 1, `transform 0.3s ${EASE_OUT}, opacity 0.3s ease-out`);
  await wait(300);
  isSliding = false;
};

const onDateClick = () => {
  if (!suppressClick) setOpen(true);
};

onMounted(async () => {
  if (cardRef.value) {
    gesture = createGesture({
      el: cardRef.value,
      gestureName: 'date-swipe',
      direction: 'x',
      threshold: 10,
      canStart: () => !isSliding,
      onMove: (detail) => {
        // Follows the finger with resistance and fades as it moves away
        const x = detail.deltaX * 0.6;
        setContentPosition(x, 1 - Math.min(Math.abs(x) / 200, 0.5));
      },
      onEnd: (detail) => {
        suppressClick = true;
        setTimeout(() => suppressClick = false, 50);
        const committed = Math.abs(detail.deltaX) > SWIPE_DISTANCE || Math.abs(detail.velocityX) > SWIPE_VELOCITY;
        if (!committed) {
          setContentPosition(0, 1, `transform 0.3s ${EASE_OUT}, opacity 0.3s ease-out`);
          return;
        }
        // Swiping left shows the next day, like turning a page
        const towardsLeft = (detail.deltaX || detail.velocityX) < 0;
        slideToDay(towardsLeft ? 1 : -1);
      },
    });
    gesture.enable();
  }

  const start = parseIsoDateString(datetimeModel.value);
  await updateLiturgy(start);
});

onBeforeUnmount(() => gesture?.destroy());

watch(datetimeModel, async (newDate) => {
  console.log("datetimeModel", newDate);
});
</script>

<style scoped>
.date-navigation {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 0.5rem 0.25rem;
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-color-card);
  /* Horizontal drags belong to the swipe gesture; vertical ones still scroll the page */
  touch-action: pan-y pinch-zoom;
  user-select: none;
  -webkit-user-select: none;
}

/* Liturgical color of the day as an accent bar along the top edge */
.date-navigation::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  background: var(--liturgical-color, transparent);
}

.nav-button {
  --padding-start: 8px;
  --padding-end: 8px;
  height: 100%;
}

.date-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 8px;
  cursor: pointer;
  flex: 1;
  text-align: center;
  will-change: transform;
}

.date-label {
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}

.celebration {
  font-size: 1.15rem;
  line-height: 1.3;
}

.rank {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  opacity: 0.7;
}


ion-modal {
  --height: auto;
  --width: 90%;
  --max-width: 400px;
  --border-radius: 16px;
  --background: var(--ion-background-color);
  margin: auto;
}

.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 16px;
}

ion-datetime {
  --background: var(--ion-background-color);
  color: var(--ion-text-color);
  border-radius: 12px;
  box-shadow: 0 0 10px var(--ion-color-step-100);
  --wheel-highlight-background: var(--ion-background-color);
  --wheel-fade-background-rgb: var(--ion-background-color);
}

ion-datetime::part(wheel-item active) {
  color: var(--ion-tab-bar-color);
}

</style>
