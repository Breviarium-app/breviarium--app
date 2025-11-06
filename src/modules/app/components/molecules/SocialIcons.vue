<script lang="ts" setup>
import {IonButton, IonIcon} from '@ionic/vue';
import {globeOutline, logoLinkedin, logoWhatsapp, logoX, paperPlane} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

const openWhatsAppChannel = () => {
  window.open('https://whatsapp.com/channel/0029VbBM3QuAInPuD8nIU436', '_blank');
};
const openTelegramChannel = () => {
  window.open('https://t.me/breviariumapp', '_blank');
};
const openLinkedIn = () => {
  window.open('https://www.linkedin.com/company/breviarium-project/', '_blank');
};
const openX = () => {
  window.open('https://x.com/BreviariumApp', '_blank');
};
</script>

<template>
  <div class="social-links-container">
    <div class="social-buttons">
      <ion-button
          class="social-button whatsapp-button"
          fill="outline"
          @click="openWhatsAppChannel"
      >
        <ion-icon :icon="logoWhatsapp"></ion-icon>
      </ion-button>

      <ion-button
          class="social-button telegram-button"
          fill="outline"
          @click="openTelegramChannel"
      >
        <ion-icon :icon="paperPlane"></ion-icon>
      </ion-button>
      <ion-button
          class="social-button linkedin-button"
          fill="outline"
          @click="openLinkedIn"
      >
        <ion-icon :icon="logoLinkedin"></ion-icon>
      </ion-button>
      <ion-button
          class="social-button telegram-button"
          fill="outline"
          @click="openX"
      >
        <ion-icon :icon="logoX"></ion-icon>
      </ion-button>
      <ion-button
          class="social-button web-button"
          fill="outline"
          @click="openWhatsAppChannel"
      >
        <ion-icon :icon="globeOutline"></ion-icon>
        <!--        WhatsApp-->
      </ion-button>
    </div>
    <p class="social-description">
      {{
        t('socialMediaDescription') || 'Únete para recibir actualizaciones'
      }}
    </p>
  </div>
</template>

<style scoped>
.social-links-container {
  padding: 1rem 0;
  margin: 1rem 0;
  border-radius: 12px;
  background-color: var(--background);
  text-align: center;
}

.social-buttons {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
  margin: 0.5rem 0;
}

.social-button {
  --border-radius: 8px;
  --padding-start: 14px;
  --padding-end: 14px;
}

.whatsapp-button {
  --color: #25D366;
  --border-color: var(--border-color-light);
  filter: saturate(0);

  &:hover {
    filter: saturate(1);
    --background: #25D366;
    --color: white;
  }

  &:active {
    --background: #25D366;
  }
}


.telegram-button, .linkedin-button, .web-button {
  --color: #0088cc;
  --border-color: var(--border-color-light);
  filter: saturate(0);

  &:hover {
    filter: saturate(1);
    --border-color: #0088cc;
    --background: #0088cc;
    --color: white;
  }

  &:active {
    --background: #0088cc;
  }
}

.linkedin-button:hover {
  --border-color: #063b78;
  --background: #063b78;
}

.web-button:hover {
  --border-color: #fa9898;
  --background: #be4747;
}

.social-description {
  font-size: 0.9rem;
  color: var(--ion-text-color);
  opacity: 0.7;
  margin-top: 0.5rem;
  line-height: 1.4;
}

</style>