<template>
  <div class="account-banner">
    <p class="account-banner-title">{{ t('account.verify_title') }}</p>
    <p class="account-field-hint">{{ t('account.verify_intro') }} <strong>{{ email }}</strong>.</p>

    <form class="account-form" @submit.prevent="onSubmit">
      <div class="account-field">
        <label :for="codeId" class="account-field-label">{{ t('account.code') }}</label>
        <div class="account-input-wrap">
          <ion-input :id="codeId" v-model="code" class="account-input account-code-input" inputmode="numeric"
                     :maxlength="8" required/>
        </div>
      </div>
      <button :disabled="busy" class="account-button" type="submit">
        {{ busy ? t('account.verifying') : t('account.verify') }}
      </button>
      <p v-if="error" class="account-error" role="alert">{{ error }}</p>
      <p v-if="notice" class="account-notice" role="status">{{ notice }}</p>
      <button :disabled="busy" class="account-button secondary" type="button" @click="resend">
        {{ t('account.resend_code') }}
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import {ref, useId} from 'vue';
import {IonInput} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import {useAccountStore} from '@/modules/account/stores/accountStore.ts';
import {useRequest} from '@/modules/account/composables/useRequest.ts';

defineProps<{ email: string }>();
const emit = defineEmits<{ verified: [] }>();

const {t} = useI18n();
const accountStore = useAccountStore();
const codeId = useId();
const code = ref('');
const notice = ref('');

const {busy, error, run} = useRequest((status) => (status === 400 ? t('account.errors.code_invalid') : undefined));

const onSubmit = () => run(async () => {
  await accountStore.verifyEmail(code.value.trim());
  emit('verified');
});

const resend = () => run(async () => {
  notice.value = '';
  await accountStore.resendVerificationCode();
  notice.value = t('account.resent');
});
</script>
