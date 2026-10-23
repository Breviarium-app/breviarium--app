import {Capacitor, type PermissionState} from '@capacitor/core';
import {LocalNotifications} from '@capacitor/local-notifications';
import {ALERT_NOTIFICATION_IDS} from '@/modules/app/constants/alerts.ts';

const CHANNEL_ID = 'prayer-alerts';

export interface DailyNotification {
    id: number;
    title: string;
    body: string;
    hour: number;
    minute: number;
    extra?: Record<string, unknown>;
}

const isAndroid = Capacitor.getPlatform() === 'android';

let channelCreated = false;

// Own channel so the user can tune prayer reminders from the Android system settings
const ensureChannel = async (name: string, description: string) => {
    if (!isAndroid || channelCreated) return;
    await LocalNotifications.createChannel({id: CHANNEL_ID, name, description, importance: 4, visibility: 1});
    channelCreated = true;
};

export const NotificationService = {
    // Web notifications only fire while the page is open, so reminders are native only
    isSupported: () => Capacitor.isNativePlatform(),

    async checkPermission(): Promise<PermissionState> {
        const {display} = await LocalNotifications.checkPermissions();
        return display;
    },

    async requestPermission(): Promise<PermissionState> {
        const current = await this.checkPermission();
        if (current === 'granted' || current === 'denied') return current;
        const {display} = await LocalNotifications.requestPermissions();
        return display;
    },

    // Android 12+ fires reminders late (minutes) unless the user allows exact alarms
    async checkExactAlarm(): Promise<PermissionState> {
        if (!isAndroid) return 'granted';
        const {exact_alarm} = await LocalNotifications.checkExactNotificationSetting();
        return exact_alarm;
    },

    async requestExactAlarm(): Promise<PermissionState> {
        if (!isAndroid) return 'granted';
        const {exact_alarm} = await LocalNotifications.changeExactNotificationSetting();
        return exact_alarm;
    },

    // Replaces every prayer reminder with the given ones, each repeating daily at its time
    async scheduleDaily(notifications: DailyNotification[], channel: { name: string; description: string }) {
        await LocalNotifications.cancel({notifications: ALERT_NOTIFICATION_IDS.map((id) => ({id}))});
        if (!notifications.length) return;

        await ensureChannel(channel.name, channel.description);
        // Asking for exact alarms here would open the system settings on every change, so it's
        // only requested from the settings card; without it Android falls back to inexact alarms.
        const exact = await this.checkExactAlarm() === 'granted';

        await LocalNotifications.schedule({
            notifications: notifications.map(({id, title, body, hour, minute, extra}) => ({
                id,
                title,
                body,
                extra,
                channelId: CHANNEL_ID,
                // Monochrome logo for the status bar and the full color logo beside the text (Android;
                // iOS always shows the app icon)
                smallIcon: 'ic_stat_breviarium',
                largeIcon: 'ic_notification_logo',
                isExactNotification: exact,
                schedule: {on: {hour, minute, second: 0}, allowWhileIdle: true},
            })),
        });
    },

    onOpened(callback: (extra: Record<string, unknown> | undefined) => void) {
        return LocalNotifications.addListener('localNotificationActionPerformed', ({notification}) => {
            callback(notification.extra);
        });
    },
};
