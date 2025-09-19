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
import {currentLiturgyHour} from "@/constants/utils.ts";
import DateAndCelebration from "@/components/molecules/home-banners/DateAndCelebration.vue";
import router from "@/router";
import {useI18n} from 'vue-i18n'
import SaintBannerComponent from "@/components/molecules/home-banners/SaintBannerComponent.vue";
import PopularPrayers from "@/components/molecules/home-banners/PopularPrayers.vue";
import JerusalemBibleBanner from "@/views/JerusalemBibleBanner.vue";
import EvangeliumBanner from "@/views/EvangeliumBanner.vue";
import AnimatedComponent from "@/components/molecules/AnimatedComponent.vue";
import { useDateStore } from '@/stores/useDateStore';

const {t} = useI18n()
const dateStore = useDateStore()

dateStore.setup();

const ionRouter = useIonRouter();
useBackButton(-1, () => {
  if (!ionRouter.canGoBack()) {
    App.exitApp();
  }
});

</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="date-section">
        <DateAndCelebration/>
      </div>

      <div class="prayer-grid">
        <ion-grid>
          <ion-row>
            <ion-col>
              <AnimatedComponent :delay="300">
                <EvangeliumBanner/>
              </AnimatedComponent>
            </ion-col>
            <ion-col>
              <AnimatedComponent :delay="400">
                <ion-item :class="currentLiturgyHour() == 'Laudes' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/laudes')">
                  <ion-label>
                    <h2>{{ t('breviarium.laudes') }}</h2>
                    <p>Oración de la mañana</p>
                  </ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col>
              <AnimatedComponent :delay="500">
                <ion-item class="prayer-item" @click="router.push('/prayer/officium')">
                  <ion-label>{{ t('breviarium.officium') }}</ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
            <ion-col>
              <AnimatedComponent :delay="600">
                <ion-item :class="currentLiturgyHour() == 'Tercia' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/tertia')">
                  <ion-label>{{ t('breviarium.tercia') }}</ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col>
              <AnimatedComponent :delay="700">
                <ion-item :class="currentLiturgyHour() == 'Sexta' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/sexta')">
                  <ion-label>{{ t('breviarium.sexta') }}</ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
            <ion-col>
              <AnimatedComponent :delay="800">
                <ion-item :class="currentLiturgyHour() == 'Nona' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/nona')">
                  <ion-label>{{ t('breviarium.nona') }}</ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <AnimatedComponent :delay="900">
                <ion-item :class="currentLiturgyHour() == 'Vesperae' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/vesperae')">
                  <ion-label>{{ t('breviarium.vesperae') }}</ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
            <ion-col>
              <AnimatedComponent :delay="1000">
                <ion-item :class="currentLiturgyHour() == 'Completorium' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/completorium')">
                  <ion-label>{{ t('breviarium.completorium') }}</ion-label>
                </ion-item>
              </AnimatedComponent>

            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <AnimatedComponent :delay="1100">
                <JerusalemBibleBanner/>
              </AnimatedComponent>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <AnimatedComponent :delay="1200">
                <SaintBannerComponent/>
              </AnimatedComponent>
            </ion-col>
            <ion-col>
              <AnimatedComponent :delay="1300">
                <PopularPrayers/>
              </AnimatedComponent>
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
  padding: 1rem 0.4rem 0;
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