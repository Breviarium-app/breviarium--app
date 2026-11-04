<template>
  <section>
    <h2 class="section-title">{{ t('account.newsletter_title') }}</h2>
    <div class="settings-group">
      <SettingToggle :disabled="subscribed === null || busy" :hint="t('account.newsletter_hint')"
                     :label="t('account.newsletter_label')" :model-value="subscribed === true"
                     @update:model-value="onToggle"/>
    </div>
    <p v-if="loadFailed" class="account-error" role="alert">{{ t('account.newsletter_load_failed') }}</p>
    <p v-else-if="error" class="account-error" role="alert">{{ error }}</p>
    <p v-if="notice" class="account-notice" role="status">{{ notice }}</p>
  </section>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useAccountStore} from '@/modules/account/stores/accountStore.ts';
import {useRequest} from '@/modules/account/composables/useRequest.ts';
import SettingToggle from '@/modules/app/components/molecules/settings/SettingToggle.vue';

const accountStore = useAccountStore();
const {t} = useI18n();

// null until known: showing "off" while it may be on would be wrong, and toggling it would act on a guess
const subscribed = ref<boolean | null>(null);
const loadFailed = ref(false);
const notice = ref('');

const {busy, error, run} = useRequest();

onMounted(async () => {
  try {
    subscribed.value = await accountStore.getNewsletterSubscription();
  } catch {
    loadFailed.value = true;
  }
});

const onToggle = (next: boolean) => {
  notice.value = '';
  void run(async () => {
    subscribed.value = await accountStore.setNewsletterSubscription(next);
    notice.value = subscribed.value ? t('account.newsletter_on') : t('account.newsletter_off');
  });
};
</script>
