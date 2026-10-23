<template>
  <ion-modal :is-open="alertKey !== null" @didDismiss="emit('close')">
    <div v-if="alertKey" class="modal-content">
      <h2 class="modal-title">{{ t('alerts.modal_title', {prayer: prayerName}) }}</h2>
      <p class="modal-hint">{{ t('alerts.modal_hint') }}</p>
      <div v-if="alertsStore.permission === 'denied'" class="modal-hint">{{ t('alerts.permission_denied') }}</div>
      <div class="alert-card">
        <PrayerAlertRow :key="renderKey" :alert="alertsStore.alerts[alertKey]"
                        :hint="alertKey === 'angelus' ? t('alerts.hints.angelus') : undefined"
                        :label="t('alerts.daily_at')"
                        :name="prayerName"
                        @update:enabled="setEnabled(alertKey, $event)"
                        @update:time="setTime(alertKey, $event)"/>
      </div>
      <div class="modal-actions">
        <button class="secondary-button btn" @click="openSettings">{{ t('alerts.manage_all') }}</button>
        <button class="primary-button btn" @click="emit('close')">{{ t('alerts.done') }}</button>
      </div>
    </div>
  </ion-modal>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {IonModal} from '@ionic/vue';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import type {AlertKey} from '@/modules/app/constants/alerts.ts';
import {usePrayerAlerts} from '@/modules/app/composables/usePrayerAlerts.ts';
import PrayerAlertRow from '@/modules/app/components/molecules/settings/PrayerAlertRow.vue';

const props = defineProps<{
  alertKey: AlertKey | null;
}>();

const emit = defineEmits<{ close: [] }>();

const {t} = useI18n();
const router = useRouter();
const {alertsStore, renderKey, setEnabled, setTime} = usePrayerAlerts();

const prayerName = computed(() => props.alertKey ? t(`alerts.prayers.${props.alertKey}`) : '');

const openSettings = () => {
  emit('close');
  router.push('/settings/alerts');
};
</script>

<style scoped>
ion-modal {
  --height: auto;
  --width: 90%;
  --max-width: 460px;
  --border-radius: 20px;
  --background: var(--ion-background-color);
  margin: auto;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.25rem;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.modal-hint {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
  opacity: 0.7;
}

.alert-card {
  border-radius: 14px;
  overflow: hidden;
  background: var(--background-color-card);
}

button {
  font-family: inherit;
  font-weight: 400;
  color: inherit;
  border: 0;
  -webkit-tap-highlight-color: transparent;
}

.modal-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.35rem;
}

.secondary-button,
.primary-button {
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  font-size: 1rem;
  text-align: center;
}

.secondary-button {
  background: var(--background-color-card);
}

.primary-button {
  color: #fff;
  background: var(--ion-color-primary);
}
</style>
