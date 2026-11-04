<template>
  <section>
    <h2 class="section-title">{{ t('account.details_title') }}</h2>
    <form class="account-form settings-group account-details-group" @submit.prevent="onSubmit">
      <div class="account-field">
        <label :for="nameId" class="account-field-label">{{ t('account.name') }}</label>
        <div class="account-input-wrap">
          <ion-input :id="nameId" v-model="name" autocomplete="name" class="account-input" :maxlength="200" required/>
        </div>
      </div>

      <div class="account-field">
        <label :for="countryId" class="account-field-label">
          {{ t('account.country') }} <span class="optional">({{ t('account.optional') }})</span>
        </label>
        <div class="account-input-wrap">
          <ion-input :id="countryId" v-model="country" autocomplete="country-name" class="account-input" :maxlength="100"/>
        </div>
      </div>

      <div class="account-field">
        <label :for="cityId" class="account-field-label">
          {{ t('account.city') }} <span class="optional">({{ t('account.optional') }})</span>
        </label>
        <div class="account-input-wrap">
          <ion-input :id="cityId" v-model="city" autocomplete="address-level2" class="account-input" :maxlength="100"/>
        </div>
        <p class="account-field-hint">{{ t('account.location_hint') }}</p>
      </div>

      <button :disabled="busy" class="account-button" type="submit">
        {{ busy ? t('account.saving') : t('account.save') }}
      </button>
      <p v-if="error" class="account-error" role="alert">{{ error }}</p>
      <p v-if="notice" class="account-notice" role="status">{{ notice }}</p>
    </form>
  </section>
</template>

<script lang="ts" setup>
import {ref, useId, watch} from 'vue';
import {IonInput} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import type {Account} from '@/modules/account/services/backendClient.ts';
import {useAccountStore} from '@/modules/account/stores/accountStore.ts';
import {useRequest} from '@/modules/account/composables/useRequest.ts';

const props = defineProps<{ account: Account }>();

const {t} = useI18n();
const accountStore = useAccountStore();

const nameId = useId();
const countryId = useId();
const cityId = useId();

const name = ref(props.account.name);
const country = ref(props.account.country ?? '');
const city = ref(props.account.city ?? '');
const notice = ref('');

watch(() => props.account, (account) => {
  name.value = account.name;
  country.value = account.country ?? '';
  city.value = account.city ?? '';
});

const {busy, error, run} = useRequest((status) => (status === 422 ? t('account.errors.invalid_details') : undefined));

const onSubmit = () => run(async () => {
  notice.value = '';
  if (!name.value.trim()) {
    error.value = t('account.errors.name_required');
    return;
  }
  await accountStore.updateAccount({name: name.value.trim(), country: country.value.trim(), city: city.value.trim()});
  notice.value = t('account.saved');
});
</script>

<style scoped>
.account-details-group {
  padding: 1.1rem 1rem;
}

.optional {
  font-weight: 400;
  opacity: 0.6;
}
</style>
