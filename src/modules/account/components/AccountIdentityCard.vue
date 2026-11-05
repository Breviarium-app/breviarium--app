<template>
  <section>
    <div class="settings-group account-identity-card">
      <span class="account-identity-avatar">
        <img v-if="pictureUrl" :src="pictureUrl" alt="" referrerpolicy="no-referrer"/>
        <ion-icon v-else :icon="personCircleOutline" aria-hidden="true"/>
      </span>
      <div class="account-identity-text">
        <p class="account-identity-name">{{ account.name }}</p>
        <p class="account-identity-email">{{ account.email }}</p>
        <p class="account-identity-method">{{ signInMethodHint }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {IonIcon} from '@ionic/vue';
import {useI18n} from 'vue-i18n';
import {personCircleOutline} from 'ionicons/icons';
import type {Account} from '@/modules/account/services/backendClient.ts';
import {useAccountStore} from '@/modules/account/stores/accountStore.ts';

const props = defineProps<{ account: Account }>();

const {t} = useI18n();
const {pictureUrl} = storeToRefs(useAccountStore());

const signInMethodHint = computed(() => {
  if (props.account.has_google && props.account.has_password) return t('account.sign_in_with_both');
  return props.account.has_google ? t('account.sign_in_with_google') : t('account.sign_in_with_password');
});
</script>

<style scoped>
.account-identity-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem;
}

.account-identity-avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--background);
  font-size: 2.6rem;
}

/* The opacity is only meant to mute the placeholder icon, not a real photo */
.account-identity-avatar ion-icon {
  opacity: 0.6;
}

.account-identity-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.account-identity-text {
  min-width: 0;
}

.account-identity-name {
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
}

.account-identity-email {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  line-height: 1.4;
  opacity: 0.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-identity-method {
  margin: 0.3rem 0 0;
  font-size: 0.8rem;
  line-height: 1.4;
  opacity: 0.45;
}
</style>
