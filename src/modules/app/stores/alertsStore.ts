import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {Preferences} from '@capacitor/preferences';
import type {PermissionState} from '@capacitor/core';
import {i18n} from '@/modules/app/i18n.ts';
import {
    ALERT_KEYS,
    alertNotificationId,
    alertRoute,
    type AlertKey,
    defaultAlerts,
    isValidAlertTime,
    parseAlertTime,
    type PrayerAlerts
} from '@/modules/app/constants/alerts.ts';
import {type DailyNotification, NotificationService} from '@/modules/app/services/NotificationService.ts';

const STORAGE_KEY = 'alerts';

export const useAlertsStore = defineStore('alerts', () => {
    const alerts = ref<PrayerAlerts>(defaultAlerts());
    const isLoaded = ref(false);
    const isSupported = NotificationService.isSupported();
    const permission = ref<PermissionState>('prompt');
    const exactAlarm = ref<PermissionState>('granted');

    const hasEnabled = computed(() => ALERT_KEYS.some((key) => alerts.value[key].enabled));

    const save = async () => {
        await Preferences.set({key: STORAGE_KEY, value: JSON.stringify(alerts.value)})
            .catch((error) => console.error('Error saving alerts:', error));
    };

    const buildNotifications = (): DailyNotification[] => {
        const {t} = i18n.global;
        return ALERT_KEYS.filter((key) => alerts.value[key].enabled).map((key) => ({
            id: alertNotificationId(key),
            title: t(`alerts.prayers.${key}`),
            body: t(`alerts.bodies.${key}`),
            ...parseAlertTime(alerts.value[key].time),
            // The Angelus page is picked when opened, as it becomes the Regina Coeli in Easter
            extra: {alert: key, route: key === 'angelus' ? null : alertRoute(key)},
        }));
    };

    // Chained so quick consecutive changes can't interleave their cancel/schedule calls
    let pending: Promise<void> = Promise.resolve();
    const reschedule = () => {
        if (!isSupported) return pending;
        pending = pending.then(async () => {
            const {t} = i18n.global;
            await NotificationService.scheduleDaily(buildNotifications(), {
                name: t('alerts.channel_name'),
                description: t('alerts.channel_description'),
            });
        }).catch((error) => console.error('Error scheduling alerts:', error));
        return pending;
    };

    const refreshPermissions = async () => {
        if (!isSupported) return;
        try {
            permission.value = await NotificationService.checkPermission();
            exactAlarm.value = await NotificationService.checkExactAlarm();
        } catch (error) {
            console.error('Error checking notification permissions:', error);
        }
    };

    const load = async () => {
        try {
            const {value} = await Preferences.get({key: STORAGE_KEY});
            const saved = value ? JSON.parse(value) : {};
            // Merged per prayer so new prayers or fields get their defaults
            for (const key of ALERT_KEYS) {
                const stored = saved[key] ?? {};
                alerts.value[key] = {
                    enabled: stored.enabled === true,
                    time: isValidAlertTime(stored.time) ? stored.time : alerts.value[key].time,
                };
            }
        } catch (error) {
            console.error('Error loading alerts:', error);
        }
        isLoaded.value = true;
        await refreshPermissions();
        // Re-registers the reminders in case the system dropped them or their texts changed
        if (hasEnabled.value && permission.value === 'granted') await reschedule();
    };

    // Returns false when the user didn't allow notifications, so the toggle can stay off
    const setEnabled = async (key: AlertKey, enabled: boolean): Promise<boolean> => {
        if (enabled) {
            permission.value = await NotificationService.requestPermission().catch(() => 'denied' as const);
            if (permission.value !== 'granted') return false;
        }
        alerts.value[key].enabled = enabled;
        await save();
        await reschedule();
        return true;
    };

    const setTime = async (key: AlertKey, time: string) => {
        if (!isValidAlertTime(time) || alerts.value[key].time === time) return;
        alerts.value[key].time = time;
        await save();
        if (alerts.value[key].enabled) await reschedule();
    };

    const requestExactAlarm = async () => {
        try {
            exactAlarm.value = await NotificationService.requestExactAlarm();
            // Alarms set before the permission was granted are still inexact
            if (exactAlarm.value === 'granted') await reschedule();
        } catch (error) {
            console.error('Error requesting exact alarms:', error);
        }
    };

    return {
        alerts,
        isLoaded,
        isSupported,
        permission,
        exactAlarm,
        hasEnabled,
        load,
        refreshPermissions,
        setEnabled,
        setTime,
        requestExactAlarm,
    };
});
