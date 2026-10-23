<template>
  <div v-if="!alertsStore.isSupported" class="notice">{{ t('alerts.unsupported') }}</div>
  <template v-else>
    <div v-if="alertsStore.permission === 'denied'" class="notice">{{ t('alerts.permission_denied') }}</div>
    <PrayerAlertRow v-for="key in ALERT_KEYS" :key="`${key}-${renderKey}`"
                    :alert="alertsStore.alerts[key]"
                    :hint="key === 'angelus' ? t('alerts.hints.angelus') : undefined"
                    :label="t(`alerts.prayers.${key}`)"
                    @update:enabled="setEnabled(key, $event)"
                    @update:time="setTime(key, $event)"/>
    <div v-if="needsExactAlarm" class="notice exact-alarm">
      <span>{{ t('alerts.exact_alarm_hint') }}</span>
      <ion-button fill="outline" shape="round" size="small" @click="alertsStore.requestExactAlarm()">
        <ion-icon slot="start" :icon="alarmOutline" aria-hidden="true"></ion-icon>
        {{ t('alerts.exact_alarm_button') }}
      </ion-button>
    </div>
  </template>
</template>

<script lang="ts" setup>
import {computed, onMounted} from 'vue';
import {IonButton, IonIcon} from '@ionic/vue';
import {alarmOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {ALERT_KEYS} from '@/modules/app/constants/alerts.ts';
import {usePrayerAlerts} from '@/modules/app/composables/usePrayerAlerts.ts';
import PrayerAlertRow from '@/modules/app/components/molecules/settings/PrayerAlertRow.vue';

const {t} = useI18n();
const {alertsStore, renderKey, setEnabled, setTime} = usePrayerAlerts();

// Only relevant on Android 12+, where reminders may arrive some minutes late without it
const needsExactAlarm = computed(() =>
    alertsStore.hasEnabled && alertsStore.permission === 'granted' && alertsStore.exactAlarm !== 'granted');

// The user may have changed the permissions from the system settings since startup
onMounted(() => alertsStore.refreshPermissions());
</script>

<style scoped>
.notice {
  padding: 0.8rem 1rem;
  font-size: 0.8rem;
  line-height: 1.4;
  opacity: 0.7;
}

.exact-alarm {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  opacity: 1;
}

.exact-alarm span {
  opacity: 0.7;
}
</style>
