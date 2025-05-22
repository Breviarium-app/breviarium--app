<script lang="ts" setup>
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useBackButton,
  useIonRouter
} from '@ionic/vue';
import {App} from '@capacitor/app';
import SaintBanner from "@/components/molecules/home-banners/SaintBanner.vue";
import {currentLiturgyHour} from "@/constants/utils.ts";
import DateAndCelebration from "@/components/molecules/home-banners/DateAndCelebration.vue";
import router from "@/router";
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from "vue";
import Breviarium from "breviarium";
import LiturgyInformation from "@/components/molecules/home-banners/LiturgyInformation.vue";
import {useDateStore} from "@/stores/useDateStore.ts";
import SaintBannerComponent from "@/components/molecules/home-banners/SaintBannerComponent.vue";
import PopularPrayers from "@/components/molecules/home-banners/PopularPrayers.vue";
import JerusalemBibleBanner from "@/views/JerusalemBibleBanner.vue";

const {t} = useI18n()

const ionRouter = useIonRouter();
useBackButton(-1, () => {
  if (!ionRouter.canGoBack()) {
    App.exitApp();
  }
});

const gospelQuote = ref('')

onMounted(async () => {
  const brev = new Breviarium(useDateStore().getCurrentDate);
  brev.getEvangelium().then(data => {
    if (data && data.evangelium_lectiones.length > 0) {
      gospelQuote.value = data?.evangelium_lectiones[0]?.ref.split(':')[0];
    }
  });
})


</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Breviarium</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="date-section ion-padding">
        <DateAndCelebration/>
        <SaintBanner/>
        <LiturgyInformation/>
      </div>

      <div class="prayer-grid">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item class="prayer-item" @click="router.push('/prayer/evangelium')">
                <ion-label>
                  <h2>{{ t('breviarium.evangelium_lectiones') }}</h2>
                  <p>{{ gospelQuote }}</p>
                </ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Laudes' ? 'selected_hour' : ''" class="prayer-item"
                        @click="router.push('/prayer/laudes')">
                <ion-label>
                  <h2>{{ t('breviarium.laudes') }}</h2>
                  <p>Oración de la mañana</p>
                </ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item class="prayer-item" @click="router.push('/prayer/officium')">
                <ion-label>{{ t('breviarium.officium') }}</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Tercia' ? 'selected_hour' : ''" class="prayer-item"
                        @click="router.push('/prayer/tertia')">
                <ion-label>{{ t('breviarium.tercia') }}</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Sexta' ? 'selected_hour' : ''" class="prayer-item"
                        @click="router.push('/prayer/sexta')">
                <ion-label>{{ t('breviarium.sexta') }}</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Nona' ? 'selected_hour' : ''" class="prayer-item"
                        @click="router.push('/prayer/nona')">
                <ion-label>{{ t('breviarium.nona') }}</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Vesperae' ? 'selected_hour' : ''" class="prayer-item"
                        @click="router.push('/prayer/vesperae')">
                <ion-label>{{ t('breviarium.vesperae') }}</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Completorium' ? 'selected_hour' : ''" class="prayer-item"
                        @click="router.push('/prayer/completorium')">
                <ion-label>{{ t('breviarium.completorium') }}</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <JerusalemBibleBanner/>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <SaintBannerComponent/>
            </ion-col>
            <ion-col>
              <PopularPrayers/>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped>
.date-section {
  text-align: center;
  margin-bottom: 1rem;
}

.prayer-grid {
  padding: 6px;
}

.selected_hour {
  font-weight: bold;
  box-shadow: 1px 1px 5px var(--background-card-shadow);
  border-radius: 7px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>