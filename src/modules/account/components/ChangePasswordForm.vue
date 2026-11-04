<template>
  <section>
    <h2 class="section-title">{{ t('account.password_title') }}</h2>
    <form class="account-form settings-group account-details-group" @submit.prevent="onSubmit">
      <div class="account-field">
        <label :for="currentId" class="account-field-label">{{ t('account.current_password') }}</label>
        <div class="account-input-wrap">
          <ion-input :id="currentId" v-model="current" autocomplete="current-password" class="account-input"
                     required type="password"/>
        </div>
      </div>

      <div class="account-field">
        <label :for="nextId" class="account-field-label">{{ t('account.new_password') }}</label>
        <div class="account-input-wrap">
          <ion-input :id="nextId" v-model="next" autocomplete="new-password" class="account-input" :maxlength="256"
                     :minlength="8" required type="password"/>
        </div>
        <p class="account-field-hint">{{ t('account.password_hint') }}</p>
      </div>

      <button :disabled="busy" class="account-button" type="submit">
        {{ busy ? t('account.password_submitting') : t('account.password_submit') }}
      </button>
      <p v-if="error" class="account-error" role="alert">{{ error }}</p>
      <p v-if="notice" class="account-notice" role="status">{{ notice }}</p>
    </form>
  </section>
</template>

<script lang="ts" setup>
import {ref, useId} from 'vue';
import {IonInput} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import {useAccountStore} from '@/modules/account/stores/accountStore.ts';
import {useRequest} from '@/modules/account/composables/useRequest.ts';

const {t} = useI18n();
const accountStore = useAccountStore();

const currentId = useId();
const nextId = useId();
const current = ref('');
const next = ref('');
const notice = ref('');

const {busy, error, run} = useRequest((status) => {
  if (status === 400) return t('account.errors.wrong_password');
  if (status === 422) return t('account.password_hint');
  return undefined;
});

const onSubmit = () => run(async () => {
  notice.value = '';
  await accountStore.changePassword({current_password: current.value, new_password: next.value});
  current.value = '';
  next.value = '';
  notice.value = t('account.password_changed');
});
</script>

<style scoped>
.account-details-group {
  padding: 1.1rem 1rem;
}
</style>
