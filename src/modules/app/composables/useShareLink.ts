import {Capacitor} from '@capacitor/core';
import {Share} from '@capacitor/share';
import {toastController} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import {useDateStore} from '@/modules/app/stores/useDateStore.ts';
import {datedShareUrl} from '@/modules/app/constants/share.ts';
import HapticsService from '@/modules/app/services/HapticsService.ts';

// Shares the public link of a page for the selected day: native share sheet in the app, clipboard on the web
export function useShareLink() {
    const {t} = useI18n();
    const dateStore = useDateStore();

    const copyLink = async (url: string) => {
        let message = t('link_copied');
        try {
            await navigator.clipboard.writeText(url);
        } catch (err) {
            console.error('Failed to copy: ', err);
            message = t('link_copy_failed');
        }
        const toast = await toastController.create({message, duration: 1500, position: 'top'});
        await toast.present();
    };

    // page: segment appended after the date, e.g. "evangelium"
    const share = async (page: string) => {
        HapticsService.light();
        const url = datedShareUrl(dateStore.currentDate, page);

        if (Capacitor.isNativePlatform()) {
            try {
                await Share.share({text: url});
            } catch (err) {
                // Dismissing the native share sheet rejects the promise too; only log genuine failures
                console.error('Native share failed:', err);
            }
            return;
        }

        await copyLink(url);
    };

    return {share};
}
