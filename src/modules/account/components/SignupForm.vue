<template>
  <!-- The email already has a Google account: the password above is added to it once this code confirms it -->
  <form v-if="addingPassword" class="account-form" @submit.prevent="onAddPasswordSubmit">
    <p class="account-field-hint">
      {{ t('account.add_password_intro') }} <strong>{{ email.trim() }}</strong>. {{ t('account.add_password_keeps') }}
    </p>
    <div class="account-field">
      <label :for="codeId" class="account-field-label">{{ t('account.code') }}</label>
      <div class="account-input-wrap">
        <ion-input :id="codeId" v-model="code" class="account-input account-code-input" inputmode="numeric"
                   :maxlength="8" required/>
      </div>
    </div>
    <button :disabled="busy" class="account-button" type="submit">
      {{ busy ? t('account.add_password_submitting') : t('account.add_password_submit') }}
    </button>
    <p v-if="error" class="account-error" role="alert">{{ error }}</p>
    <p v-if="notice" class="account-notice" role="status">{{ notice }}</p>
    <p class="account-link-row">
      <button type="button" @click="resend">{{ t('account.resend_code') }}</button>
      ·
      <button type="button" @click="addingPassword = false">{{ t('account.back') }}</button>
    </p>
  </form>

  <form v-else class="account-form" @submit.prevent="onSubmit">
    <GoogleSignInButton :busy="busy" mode="signup" @error="error = $event"/>
    <div v-if="googleSignInEnabled" class="account-divider">{{ t('account.or') }}</div>

    <div class="account-field">
      <label :for="nameId" class="account-field-label">{{ t('account.name') }}</label>
      <div class="account-input-wrap">
        <ion-input :id="nameId" v-model="name" autocomplete="name" class="account-input" :maxlength="200" required/>
      </div>
    </div>

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
                   autocomplete="new-password" class="account-input" :maxlength="256" :minlength="8" required/>
        <button :aria-label="visible ? t('account.hide_password') : t('account.show_password')"
                class="account-password-toggle" type="button" @click="visible = !visible">
          <ion-icon :icon="visible ? eyeOffOutline : eyeOutline" aria-hidden="true"/>
        </button>
      </div>
      <p class="account-field-hint">{{ t('account.password_hint') }}</p>
    </div>

    <SettingToggle v-model="newsletterOptIn" :hint="t('account.newsletter_hint')" :label="t('account.newsletter_label')"/>

    <button :disabled="busy" class="account-button" type="submit">
      {{ busy ? t('account.signup_submitting') : t('account.signup_submit') }}
    </button>
    <p v-if="error" class="account-error" role="alert">{{ error }}</p>

    <p class="account-link-row">
      {{ t('account.has_account') }}
      <button type="button" @click="emit('switch-to-login')">{{ t('account.login_tab') }}</button>
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
import SettingToggle from '@/modules/app/components/molecules/settings/SettingToggle.vue';

const emit = defineEmits<{ 'switch-to-login': []; registered: [newsletterOptIn: boolean] }>();

const {t, locale} = useI18n();
const accountStore = useAccountStore();

const nameId = useId();
const emailId = useId();
const passwordId = useId();
const codeId = useId();

const name = ref('');
const email = ref('');
const password = ref('');
const visible = ref(false);
const newsletterOptIn = ref(true);
const addingPassword = ref(false);
const code = ref('');
const notice = ref('');

const {busy, error, run} = useRequest((status) => {
  if (status === 409) return t('account.errors.email_taken');
  if (status === 422) return t('account.errors.invalid_input');
  return undefined;
});

const register = () => accountStore.register({
  name: name.value.trim(),
  email: email.value.trim(),
  password: password.value,
  locale: locale.value,
});

const onSubmit = () => run(async () => {
  try {
    await register();
  } catch (e) {
    if (!accountStore.isGoogleAccountCodeSent(e)) throw e;
    addingPassword.value = true;
    return;
  }
  emit('registered', newsletterOptIn.value);
});

const onAddPasswordSubmit = () => run(async () => {
  await accountStore.completeGoogleAddPassword({email: email.value.trim(), code: code.value.trim(), new_password: password.value});
  emit('registered', newsletterOptIn.value);
});

const resend = () => run(async () => {
  notice.value = '';
  try {
    await register();
  } catch (e) {
    if (!accountStore.isGoogleAccountCodeSent(e)) throw e;
  }
  notice.value = t('account.resent');
});
</script>
