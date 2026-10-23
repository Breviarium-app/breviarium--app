import {ref} from 'vue';
import {toastController} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import {useAlertsStore} from '@/modules/app/stores/alertsStore.ts';
import type {AlertKey} from '@/modules/app/constants/alerts.ts';
import HapticsService from '@/modules/app/services/HapticsService.ts';

// Shared by the settings card and the prayer page sheet
export function usePrayerAlerts() {
    const {t} = useI18n();
    const alertsStore = useAlertsStore();
    // Bumped to re-render the toggles when a change is refused, as their value prop didn't change
    const renderKey = ref(0);

    const setEnabled = async (key: AlertKey, enabled: boolean) => {
        HapticsService.light();
        const applied = await alertsStore.setEnabled(key, enabled);
        if (applied) return;

        renderKey.value++;
        const toast = await toastController.create({message: t('alerts.permission_denied'), duration: 3000, position: 'top'});
        await toast.present();
    };

    const setTime = async (key: AlertKey, time: string) => {
        HapticsService.light();
        await alertsStore.setTime(key, time);
    };

    return {alertsStore, renderKey, setEnabled, setTime};
}
