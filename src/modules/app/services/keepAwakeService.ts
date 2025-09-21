import {KeepAwake} from '@capacitor-community/keep-awake';

export class KeepAwakeService {
    /**
     * Keeps the screen awake, preventing it from dimming or locking.
     * @returns Promise<void>
     * @throws Error if the operation fails
     */
    static async keepAwake(): Promise<void> {
        try {
            await KeepAwake.keepAwake();
        } catch (error) {
            console.error('Error keeping screen awake:', error);
            throw error; // Re-throw to allow caller to handle
        }
    }

    /**
     * Allows the screen to sleep, restoring normal behavior.
     * @returns Promise<void>
     * @throws Error if the operation fails
     */
    static async allowSleep(): Promise<void> {
        try {
            await KeepAwake.allowSleep();
        } catch (error) {
            console.error('Error allowing screen sleep:', error);
            throw error;
        }
    }

    /**
     * Checks if the screen is currently kept awake.
     * @returns Promise<boolean> - True if the screen is kept awake, false otherwise
     * @throws Error if the operation fails
     */
    static async isKeptAwake(): Promise<boolean> {
        try {
            const result = await KeepAwake.isKeptAwake();
            return result.isKeptAwake;
        } catch (error) {
            console.error('Error checking awake status:', error);
            throw error;
        }
    }

    /**
     * Checks if the keep awake feature is supported on the device.
     * @returns Promise<boolean> - True if supported, false otherwise
     * @throws Error if the operation fails
     */
    static async isSupported(): Promise<boolean> {
        try {
            const result = await KeepAwake.isSupported();
            return result.isSupported;
        } catch (error) {
            console.error('Error checking support:', error);
            throw error;
        }
    }
}