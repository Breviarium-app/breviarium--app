<script lang="ts" setup>
import {IonIcon} from '@ionic/vue';
import {globeOutline, logoLinkedin, logoWhatsapp, logoX, paperPlane} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import HapticsService from "@/modules/app/services/HapticsService.ts";

const {t} = useI18n();

// Channels that deliver updates, shown as primary buttons
const channels = [
  {name: 'WhatsApp', icon: logoWhatsapp, color: '#25D366', url: 'https://whatsapp.com/channel/0029VbBM3QuAInPuD8nIU436'},
  {name: 'Telegram', icon: paperPlane, color: '#229ED9', url: 'https://t.me/breviariumapp'},
];

const profiles = [
  {name: 'X', icon: logoX, url: 'https://x.com/BreviariumApp'},
  {name: 'LinkedIn', icon: logoLinkedin, url: 'https://www.linkedin.com/company/breviarium-project/'},
  {name: 'breviarium.es', icon: globeOutline, url: 'https://breviarium.es'},
];

const open = (url: string) => {
  HapticsService.light();
  window.open(url, '_blank');
};
</script>

<template>
  <section class="community">
    <h2 class="community-title">{{ t('community.title') }}</h2>
    <p class="community-subtitle">{{ t('community.subtitle') }}</p>

    <div class="channels">
      <button v-for="channel in channels" :key="channel.name" class="channel btn" @click="open(channel.url)">
        <ion-icon :icon="channel.icon" :style="{color: channel.color}" aria-hidden="true"/>
        {{ channel.name }}
      </button>
    </div>

    <div class="profiles">
      <button v-for="profile in profiles" :key="profile.name" :aria-label="t('community.follow', {network: profile.name})"
              class="profile btn" @click="open(profile.url)">
        <ion-icon :icon="profile.icon" aria-hidden="true"/>
      </button>
    </div>
  </section>
</template>

<style scoped>
.community {
  margin: 2rem auto 1rem;
  padding: 0 1rem;
  max-width: 420px;
  text-align: center;
}

.community-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 400;
}

.community-subtitle {
  margin: 0.25rem 0 1rem;
  font-size: 0.85rem;
  line-height: 1.4;
  opacity: 0.65;
}

button {
  font-family: inherit;
  font-weight: 400;
  color: inherit;
  border: 0;
  -webkit-tap-highlight-color: transparent;
}

.channels {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
}

.channel {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.15rem 0.6rem 0.95rem;
  border-radius: 999px;
  font-size: 0.95rem;
  background: var(--background-color-card);
}

.channel ion-icon {
  font-size: 1.25rem;
}

.profiles {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 0.6rem;
}

.profile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  opacity: 0.55;
  transition: opacity 0.15s ease, background 0.15s ease;
}

.profile:hover,
.profile:focus-visible {
  opacity: 1;
  background: var(--background-color-card);
}

.profile ion-icon {
  font-size: 1.2rem;
}
</style>
