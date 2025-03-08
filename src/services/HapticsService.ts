import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {useSettingsStore} from "@/stores/settingsStore.ts";
import {NotificationType} from "@capacitor/haptics/dist/esm/definitions";

class HapticsService {
    static light() {
        if (useSettingsStore().settings.hapticsActive) {
            Haptics.impact({style: ImpactStyle.Light}).then();
        }
    }

    static medium() {
        if (useSettingsStore().settings.hapticsActive) {
            Haptics.impact({style: ImpactStyle.Medium}).then();
        }
    }

    static heavy() {
        if (useSettingsStore().settings.hapticsActive) {
            Haptics.impact({style: ImpactStyle.Heavy}).then();
        }
    }

    static notificationSuccess() {
        if (useSettingsStore().settings.hapticsActive) {
            Haptics.notification({type: NotificationType.Success}).then();
        }
    }

    static notificationError() {
        if (useSettingsStore().settings.hapticsActive) {
            Haptics.notification({type: NotificationType.Error}).then();
        }
    }

    static notificationWarning() {
        if (useSettingsStore().settings.hapticsActive) {
            Haptics.notification({type: NotificationType.Warning}).then();
        }
    }
}

export default HapticsService;
