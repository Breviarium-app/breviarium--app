<script lang="ts" setup>
import {watch} from 'vue';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {Capacitor} from '@capacitor/core';
import {useI18n} from 'vue-i18n';
import {useSettingsStore} from '@/modules/app/stores/settingsStore.ts';
import VersionNumber from "@/modules/app/components/molecules/VersionNumber.vue";
import SelectorTheme from "@/modules/app/components/molecules/SelectorTheme.vue";
import HapticsService from "@/modules/app/services/HapticsService.ts";
import FontSizeSelector from "@/modules/app/components/molecules/FontSizeSelector.vue";
import AutoScrollSpeedSelector from "@/modules/app/components/molecules/AutoScrollSpeedSelector.vue";
import TextToSpeechSettings from "@/modules/app/components/molecules/TextToSpeechSettings.vue";
import SocialIcons from "@/modules/app/components/molecules/SocialIcons.vue";
import SettingToggle from "@/modules/app/components/molecules/settings/SettingToggle.vue";

const {t} = useI18n();
const settingsStore = useSettingsStore();

type ToggleKey = 'laudesEvangelium' | 'laudesOfficium' | 'vesperaeOfficium' | 'hideInvitatorium'
    | 'bienalOfficiumDefault' | 'deceased' | 'keepAwake' | 'hapticsActive';

// Label keys live under settings.*, hints under settings.hints.*
const prayerToggles: { key: ToggleKey; i18n: string; disabled?: boolean }[] = [
  {key: 'laudesEvangelium', i18n: 'laudes_and_evangelium'},
  {key: 'laudesOfficium', i18n: 'laudes_and_office'},
  {key: 'vesperaeOfficium', i18n: 'vesperae_and_office'},
  {key: 'hideInvitatorium', i18n: 'hide_invitatorium'},
  {key: 'bienalOfficiumDefault', i18n: 'bienal_office_by_default'},
  // Not implemented yet: shown disabled as a preview
  {key: 'deceased', i18n: 'office_deceased', disabled: true},
];

// Vibration only exists in the native app
const isNative = Capacitor.isNativePlatform();

watch(() => settingsStore.settings.theme, (newTheme) => {
  settingsStore.applyTheme(newTheme);
  settingsStore.saveSettings();
});

const updateToggle = async (key: ToggleKey, value: boolean) => {
  settingsStore.settings[key] = value;
  await settingsStore.saveSettings();
  HapticsService.light();

  // The store only applies this on startup, so apply it here to take effect immediately
  if (key === 'keepAwake') {
    await settingsStore.applyKeepAwake(value);
  }
};

// Same value the language selectors inside each prayer read and write
const updateLatinPrayers = async (value: boolean) => {
  settingsStore.settings.latinPrayers = value ? 'la' : 'es';
  await settingsStore.saveSettings();
  HapticsService.light();
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('settings.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="settingsStore.isLoaded" class="settings">
        <section>
          <h2 class="section-title">{{ t('settings.sections.prayer') }}</h2>
          <div class="settings-group">
            <SettingToggle v-for="toggle in prayerToggles" :key="toggle.key"
                           :disabled="toggle.disabled"
                           :hint="t(`settings.hints.${toggle.i18n}`)"
                           :label="t(`settings.${toggle.i18n}`)"
                           :model-value="settingsStore.settings[toggle.key]"
                           @update:model-value="updateToggle(toggle.key, $event)"/>
            <SettingToggle :hint="t('settings.hints.prefer_latin_prayers')"
                           :label="t('settings.prefer_latin_prayers')"
                           :model-value="settingsStore.settings.latinPrayers === 'la'"
                           @update:model-value="updateLatinPrayers"/>
          </div>
        </section>

        <section>
          <h2 class="section-title">{{ t('settings.sections.reading') }}</h2>
          <div class="settings-group">
            <FontSizeSelector/>
            <AutoScrollSpeedSelector/>
            <TextToSpeechSettings/>
            <SettingToggle :hint="t('settings.hints.keepAwake')"
                           :label="t('settings.keepAwake')"
                           :model-value="settingsStore.settings.keepAwake"
                           @update:model-value="updateToggle('keepAwake', $event)"/>
          </div>
        </section>

        <section>
          <h2 class="section-title">{{ t('settings.sections.appearance') }}</h2>
          <div class="settings-group">
            <SelectorTheme/>
          </div>
        </section>

        <section v-if="isNative">
          <h2 class="section-title">{{ t('settings.sections.general') }}</h2>
          <div class="settings-group">
            <SettingToggle :hint="t('settings.hints.haptics_active')"
                           :label="t('settings.haptics_active')"
                           :model-value="settingsStore.settings.hapticsActive"
                           @update:model-value="updateToggle('hapticsActive', $event)"/>
          </div>
        </section>

        <VersionNumber/>
        <SocialIcons/>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.settings {
  max-width: 560px;
  margin: 0 auto;
  /* Bottom padding keeps the last section clear of the floating tab bar */
  padding: 1rem 1rem 96px;
}

section {
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}

.settings-group {
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-color-card);
}

.settings-group > * + * {
  border-top: 0.5px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
}
</style>
