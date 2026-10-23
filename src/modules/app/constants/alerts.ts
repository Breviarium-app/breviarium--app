// Daily reminders for the liturgical hours and the Angelus, in the order they are prayed
export const ALERT_KEYS = ['officium', 'laudes', 'tertia', 'angelus', 'sexta', 'nona', 'vesperae', 'completorium'] as const;

export type AlertKey = typeof ALERT_KEYS[number];

export interface PrayerAlert {
    enabled: boolean;
    // Local time, "HH:mm"
    time: string;
}

export type PrayerAlerts = Record<AlertKey, PrayerAlert>;

// Traditional hour of each prayer; the Angelus is always at noon
const DEFAULT_TIMES: Record<AlertKey, string> = {
    officium: '07:00',
    laudes: '07:30',
    tertia: '09:00',
    angelus: '12:00',
    sexta: '12:00',
    nona: '15:00',
    vesperae: '19:00',
    completorium: '22:00',
};

export const defaultAlerts = (): PrayerAlerts =>
    Object.fromEntries(ALERT_KEYS.map((key) => [key, {enabled: false, time: DEFAULT_TIMES[key]}])) as PrayerAlerts;

export const isAlertKey = (value: unknown): value is AlertKey =>
    ALERT_KEYS.includes(value as AlertKey);

// Stable notification id per prayer, so rescheduling replaces instead of duplicating
export const alertNotificationId = (key: AlertKey) => 1000 + ALERT_KEYS.indexOf(key);

export const ALERT_NOTIFICATION_IDS = ALERT_KEYS.map(alertNotificationId);

// Page opened when tapping the notification; the Angelus is resolved at tap time (Regina Coeli in Easter)
export const alertRoute = (key: Exclude<AlertKey, 'angelus'>) => `/prayer/${key}`;

export const parseAlertTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    return {hour, minute};
};

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const isValidAlertTime = (time: unknown): time is string =>
    typeof time === 'string' && TIME_PATTERN.test(time);
