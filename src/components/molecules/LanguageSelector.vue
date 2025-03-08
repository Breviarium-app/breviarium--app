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

const {locale, availableLocales} = useI18n();
console.log(availableLocales)
const currentLocale = computed({
  get: () => locale.value,
  set: (val) => {
    locale.value = val;
  },
});
</script>