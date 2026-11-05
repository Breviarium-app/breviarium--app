<template>
  <form class="account-form" @submit.prevent="onSubmit">
    <GoogleSignInButton :busy="busy" mode="login" @error="error = $event"/>
    <div v-if="googleSignInEnabled" class="account-divider">{{ t('account.or') }}</div>

    <div class="account-field">
      <label :for="emailId" class="account-field-label">{{ t('account.email') }}</label>
      <div class="account-input-wrap">
        <ion-input :id="emailId" v-model="email" autocapitalize="off" autocomplete="email"
                   class="account-input" inputmode="email" required type="email"/>
      </div>
    </div>

    <div class="account-field">
      <label :for="passwordId" class="account-field-label">{{ t('account.password') }}</label>
      <div class="account-input-wrap with-toggle">
        <ion-input :id="passwordId" v-model="password" :type="visible ? 'text' : 'password'"
                   autocomplete="current-password" class="account-input" required/>
        <button :aria-label="visible ? t('account.hide_password') : t('account.show_password')"
                class="account-password-toggle" type="button" @click="visible = !visible">
          <ion-icon :icon="visible ? eyeOffOutline : eyeOutline" aria-hidden="true"/>
        </button>
      </div>
    </div>

    <button :disabled="busy" class="account-button" type="submit">
      {{ busy ? t('account.login_submitting') : t('account.login_submit') }}
    </button>
    <p v-if="error" class="account-error" role="alert">{{ error }}</p>

    <p class="account-link-row">
      {{ t('account.no_account') }}
      <button type="button" @click="emit('switch-to-signup')">{{ t('account.signup_tab') }}</button>
    </p>
  </form>
</template>

<script lang="ts" setup>
import {ref, useId} from 'vue';
import {IonIcon, IonInput} from '@ionic/vue';
import {eyeOffOutline, eyeOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {useAccountStore} from '@/modules/account/stores/accountStore.ts';
import {useRequest} from '@/modules/account/composables/useRequest.ts';
import {googleSignInEnabled} from '@/modules/account/services/googleSignIn.ts';
import GoogleSignInButton from '@/modules/account/components/GoogleSignInButton.vue';

const emit = defineEmits<{ 'switch-to-signup': [] }>();

const {t} = useI18n();
const accountStore = useAccountStore();

const emailId = useId();
const passwordId = useId();
const email = ref('');
const password = ref('');
const visible = ref(false);

const {busy, error, run} = useRequest((status) => (status === 401 ? t('account.errors.invalid_credentials') : undefined));

const onSubmit = () => run(async () => {
  await accountStore.logIn({email: email.value.trim(), password: password.value});
});
</script>
