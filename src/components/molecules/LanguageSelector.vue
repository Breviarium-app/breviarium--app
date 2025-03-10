<template>
  <ion-select v-model="currentLocale" :label="$t('settings.language')" interface="action-sheet">
    <ion-select-option v-for="locale in availableLocales" :key="locale" :value="locale">
      {{ $t('common.languages.' + locale) }}
    </ion-select-option>
  </ion-select>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {IonSelect, IonSelectOption} from "@ionic/vue";
import HapticsService from "@/services/HapticsService.ts";

const {locale, availableLocales} = useI18n();
const currentLocale = computed({
  get: () => locale.value,
  set: (val) => {
    locale.value = val;
    HapticsService.light();
  },
});
</script>