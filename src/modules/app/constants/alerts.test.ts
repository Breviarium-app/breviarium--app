import {describe, expect, it} from 'vitest';
import {ALERT_KEYS, ALERT_NOTIFICATION_IDS, defaultAlerts, isAlertKey, isValidAlertTime, parseAlertTime} from './alerts.ts';

describe('alerts', () => {
    it('defaults every prayer to off at a valid time, with the Angelus at noon', () => {
        const alerts = defaultAlerts();
        for (const key of ALERT_KEYS) {
            expect(alerts[key].enabled).toBe(false);
            expect(isValidAlertTime(alerts[key].time)).toBe(true);
        }
        expect(alerts.angelus.time).toBe('12:00');
    });

    it('gives each prayer its own notification id', () => {
        expect(new Set(ALERT_NOTIFICATION_IDS).size).toBe(ALERT_KEYS.length);
    });

    it('only accepts 24h "HH:mm" times', () => {
        expect(isValidAlertTime('07:30')).toBe(true);
        expect(isValidAlertTime('23:59')).toBe(true);
        expect(isValidAlertTime('24:00')).toBe(false);
        expect(isValidAlertTime('7:30')).toBe(false);
        expect(isValidAlertTime('')).toBe(false);
        expect(isValidAlertTime(undefined)).toBe(false);
    });

    it('parses the hour and minute', () => {
        expect(parseAlertTime('19:05')).toEqual({hour: 19, minute: 5});
    });

    it('recognises alert keys', () => {
        expect(isAlertKey('laudes')).toBe(true);
        expect(isAlertKey('evangelium')).toBe(false);
        expect(isAlertKey(undefined)).toBe(false);
    });
});
