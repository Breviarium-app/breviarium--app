<template>
  <button v-if="googleSignInEnabled" :disabled="busy" class="account-button secondary account-google-button"
          type="button" @click="onClick">
    <ion-icon :icon="logoGoogle" aria-hidden="true"/>
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
import {IonIcon} from '@ionic/vue';
import {logoGoogle} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {useAccountStore} from '@/modules/account/stores/accountStore.ts';
import {googleSignInEnabled} from '@/modules/account/services/googleSignIn.ts';

const props = defineProps<{
  mode: 'login' | 'signup';
  busy: boolean;
}>();

const emit = defineEmits<{ error: [message: string] }>();

const {t, locale} = useI18n();
const accountStore = useAccountStore();

const label = props.mode === 'signup' ? t('account.google_signup') : t('account.google_login');

const onClick = async () => {
  try {
    await accountStore.signInWithGoogleAndContinue(locale.value);
  } catch {
    emit('error', t('account.errors.generic'));
  }
};
</script>
