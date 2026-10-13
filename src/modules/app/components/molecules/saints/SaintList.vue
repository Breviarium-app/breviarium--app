<template>
  <div class="saint-list">
    <ion-item v-for="saint in saints" :key="`${saint.month}-${saint.day}-${saint.name}`" :button="true" :detail="true"
              class="saint-row" @click="emit('select', saint)">
      <ion-label>
        <h2>{{ saint.name }}</h2>
        <p v-if="showDate">{{ formatFeastDay(saint.month, saint.day, locale) }}</p>
      </ion-label>
    </ion-item>
  </div>
</template>

<script lang="ts" setup>
import {IonItem, IonLabel} from "@ionic/vue";
import {SaintInfo} from "sanctus";
import {useI18n} from "vue-i18n";
import {formatFeastDay} from "@/modules/app/constants/saints.ts";

defineProps<{
  saints: SaintInfo[];
  showDate?: boolean;
}>();

const emit = defineEmits<{ select: [saint: SaintInfo] }>();

const {locale} = useI18n();
</script>

<style scoped>
.saint-list {
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-color-card);
}

.saint-row {
  --background: transparent;
  --padding-start: 16px;
  --inner-padding-top: 2px;
  --inner-padding-bottom: 2px;
}

.saint-row:not(:last-child) {
  --inner-border-width: 0 0 0.5px 0;
  --border-color: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
}
</style>
