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
import {currentLiturgyHour} from "@/modules/app/constants/utils.ts";
import DateAndCelebration from "@/modules/app/components/molecules/home-banners/DateAndCelebration.vue";
import router from "@/modules/app/router";
import {useI18n} from 'vue-i18n'
import SaintBannerComponent from "@/modules/app/components/molecules/home-banners/SaintBannerComponent.vue";
import PopularPrayers from "@/modules/app/components/molecules/home-banners/PopularPrayers.vue";
import JerusalemBibleBanner from "@/modules/app/views/JerusalemBibleBanner.vue";
import EvangeliumBanner from "@/modules/app/views/EvangeliumBanner.vue";
import AnimatedComponent from "@/modules/app/components/molecules/AnimatedComponent.vue";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";

const {t} = useI18n()

const ionRouter = useIonRouter();
useBackButton(-1, () => {
  if (!ionRouter.canGoBack()) {
    App.exitApp();
  }
});

const baseDelay = 250;
const delayIncrement = 50;

// Use a function to calculate the delay for each component
const getDelay = (index: number) => baseDelay + (index * delayIncrement);

useDateStore().updateDateParams()
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
              <AnimatedComponent :delay="getDelay(1)">
                <EvangeliumBanner/>
              </AnimatedComponent>
            </ion-col>
            <ion-col>
              <AnimatedComponent :delay="getDelay(2)">
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
              <AnimatedComponent :delay="getDelay(3)">
                <ion-item class="prayer-item" @click="router.push('/prayer/officium')">
                  <ion-label>{{ t('breviarium.officium') }}</ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
            <ion-col>
              <AnimatedComponent :delay="getDelay(4)">
                <ion-item :class="currentLiturgyHour() == 'Tercia' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/tertia')">
                  <ion-label>{{ t('breviarium.tercia') }}</ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col>
              <AnimatedComponent :delay="getDelay(5)">
                <ion-item :class="currentLiturgyHour() == 'Sexta' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/sexta')">
                  <ion-label>{{ t('breviarium.sexta') }}</ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
            <ion-col>
              <AnimatedComponent :delay="getDelay(6)">
                <ion-item :class="currentLiturgyHour() == 'Nona' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/nona')">
                  <ion-label>{{ t('breviarium.nona') }}</ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <AnimatedComponent :delay="getDelay(7)">
                <ion-item :class="currentLiturgyHour() == 'Vesperae' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/vesperae')">
                  <ion-label>{{ t('breviarium.vesperae') }}</ion-label>
                </ion-item>
              </AnimatedComponent>
            </ion-col>
            <ion-col>
              <AnimatedComponent :delay="getDelay(8)">
                <ion-item :class="currentLiturgyHour() == 'Completorium' ? 'selected_hour' : ''" class="prayer-item"
                          @click="router.push('/prayer/completorium')">
                  <ion-label>{{ t('breviarium.completorium') }}</ion-label>
                </ion-item>
              </AnimatedComponent>

            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <AnimatedComponent :delay="getDelay(9)">
                <JerusalemBibleBanner/>
              </AnimatedComponent>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <AnimatedComponent :delay="getDelay(10)">
                <SaintBannerComponent/>
              </AnimatedComponent>
            </ion-col>
            <ion-col>
              <AnimatedComponent :delay="getDelay(11)">
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