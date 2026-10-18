<template>
  <ion-button :aria-label="t('share_link')" fill="clear" @click="share">
    <ion-icon slot="icon-only" :icon="shareOutline"/>
  </ion-button>
</template>

<script lang="ts" setup>
import {Capacitor} from "@capacitor/core";
import {Share} from "@capacitor/share";
import {IonButton, IonIcon, toastController} from "@ionic/vue";
import {shareOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import {datedShareUrl} from "@/modules/app/constants/share.ts";
import HapticsService from "@/modules/app/services/HapticsService.ts";

// Page segment appended after the date, e.g. "evangelium"
const props = defineProps<{
  page: string;
}>();

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

const share = async () => {
  HapticsService.light();
  const url = datedShareUrl(dateStore.currentDate, props.page);

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
</script>
