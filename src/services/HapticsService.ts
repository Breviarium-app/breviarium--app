import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {useSettingsStore} from "@/stores/settingsStore.ts";
import {NotificationType} from "@capacitor/haptics/dist/esm/definitions";
import {Capacitor} from "@capacitor/core";

class HapticsService {
    static light() {
        if (Capacitor.isNativePlatform() && useSettingsStore().settings.hapticsActive) {
            Haptics.impact({style: ImpactStyle.Light}).then();
        }
    }

    static medium() {
        if (Capacitor.isNativePlatform() && useSettingsStore().settings.hapticsActive) {
            Haptics.impact({style: ImpactStyle.Medium}).then();
        }
    }

    static heavy() {
        if (Capacitor.isNativePlatform() && useSettingsStore().settings.hapticsActive) {
            Haptics.impact({style: ImpactStyle.Heavy}).then();
        }
    }

    static notificationSuccess() {
        if (Capacitor.isNativePlatform() && useSettingsStore().settings.hapticsActive) {
            Haptics.notification({type: NotificationType.Success}).then();
        }
    }

    static notificationError() {
        if (Capacitor.isNativePlatform() && useSettingsStore().settings.hapticsActive) {
            Haptics.notification({type: NotificationType.Error}).then();
        }
    }

    static notificationWarning() {
        if (Capacitor.isNativePlatform() && useSettingsStore().settings.hapticsActive) {
            Haptics.notification({type: NotificationType.Warning}).then();
        }
    }
}

export default HapticsService;
