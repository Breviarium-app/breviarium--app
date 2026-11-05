<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('account.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="account-page">
        <template v-if="!accountStore.isReady">
          <div class="account-loading">
            <ion-spinner name="crescent"/>
          </div>
        </template>

        <template v-else-if="!accountStore.signedIn">
          <div class="account-segment">
            <button :class="{active: mode === 'login'}" type="button" @click="mode = 'login'">
              {{ t('account.login_tab') }}
            </button>
            <button :class="{active: mode === 'signup'}" type="button" @click="mode = 'signup'">
              {{ t('account.signup_tab') }}
            </button>
          </div>
          <LoginForm v-if="mode === 'login'" @switch-to-signup="mode = 'signup'"/>
          <SignupForm v-else @registered="onRegistered" @switch-to-login="mode = 'login'"/>
        </template>

        <template v-else-if="account">
          <AccountIdentityCard :account="account"/>
          <VerifyEmailStep v-if="SHOW_EMAIL_VERIFICATION && !account.email_verified" :email="account.email" @verified="onVerified"/>
          <AccountDetails :account="account"/>
          <NewsletterToggle v-if="account.email_verified"/>
          <ChangePasswordForm v-if="account.has_password"/>

          <button class="account-button secondary account-logout-button" type="button" @click="logOut">
            {{ t('account.logout') }}
          </button>
        </template>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {storeToRefs} from 'pinia';
import {IonContent, IonHeader, IonPage, IonSpinner, IonTitle, IonToolbar} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import {useAccountStore} from '@/modules/account/stores/accountStore.ts';
import LoginForm from '@/modules/account/components/LoginForm.vue';
import SignupForm from '@/modules/account/components/SignupForm.vue';
import AccountIdentityCard from '@/modules/account/components/AccountIdentityCard.vue';
import VerifyEmailStep from '@/modules/account/components/VerifyEmailStep.vue';
import AccountDetails from '@/modules/account/components/AccountDetails.vue';
import NewsletterToggle from '@/modules/account/components/NewsletterToggle.vue';
import ChangePasswordForm from '@/modules/account/components/ChangePasswordForm.vue';
import HapticsService from '@/modules/app/services/HapticsService.ts';

const {t} = useI18n();
const accountStore = useAccountStore();
const {account} = storeToRefs(accountStore);

// TEMPORARY: set to true to restore the email confirmation step.
const SHOW_EMAIL_VERIFICATION = false as boolean;

const mode = ref<'login' | 'signup'>('login');
// The newsletter opt-in chosen at signup; applied once the emailed code verifies, since
// /me/newsletter needs a verified email and signup doesn't have one yet.
const pendingNewsletterOptIn = ref<boolean | null>(null);

const onRegistered = (newsletterOptIn: boolean) => {
  pendingNewsletterOptIn.value = newsletterOptIn;
};

const onVerified = () => {
  if (pendingNewsletterOptIn.value) {
    accountStore.setNewsletterSubscription(true).catch((error) => console.error('Error applying newsletter opt-in:', error));
  }
  pendingNewsletterOptIn.value = null;
};

const logOut = async () => {
  HapticsService.light();
  await accountStore.logOut();
  mode.value = 'login';
};
</script>

<style scoped>
.account-loading {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.account-logout-button {
  margin-top: 0.5rem;
  color: var(--ion-color-danger);
}
</style>
