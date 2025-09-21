<template>
  <p class="current-date margin-bottom-small">
    <template v-if="showCycle">
      {{ dateStore.dateString }} - {{ yearCalendar }}
    </template>
    <template v-else>
      {{ dateStore.dateString }}
    </template>
  </p>

  <p class="current-date opacity-80 margin-bottom-small no-margin-top">
    <span v-html="timeWithRankString"></span>
    <CircleLiturgicalColor :liturgical-color-var="liturgicalColor" class="circle-liturgical-color"/>
  </p>

  <p v-if="showWeek" class="current-date opacity-80 no-margin-top">
    {{ psalteryWeek }} del salterio</p>
</template>

<script setup>
import "@/theme/general.css";
import "@/theme/offices.css";
import CircleLiturgicalColor from "@/modules/app/components/home/header/CircleLiturgicalColor.vue";
import { useDateStore } from "@/store/stores/date/dateStore";
import { getCycleYearWeek, getSalteryWeek } from "@/utils";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const dateStore = useDateStore();
const { timeWithRankString, liturgicalColor, romcalDay } = storeToRefs(dateStore);
const yearCalendar = computed(() => "Ciclo " + getCycleYearWeek(romcalDay?.value?.cycles?.sundayCycle))
const psalteryWeek = computed(() => "Semana " + getSalteryWeek(romcalDay?.value?.cycles?.psalterWeek))
defineProps({
  showWeek: {
    type: Boolean,
    default: false,
    required: false
  },
  showCycle: {
    type: Boolean,
    default: true,
    required: false
  },
})

</script>
<style scoped>
.no-margin-top {
  margin-top: 0;
}

.margin-bottom-small {
  margin-bottom: 0.1rem;
}

.circle-liturgical-color {
  margin-left: 5px;
}
</style>
