<script lang="ts" setup>
import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  useBackButton,
  useIonRouter
} from '@ionic/vue';
import {App} from '@capacitor/app';
import SaintBanner from "@/components/molecules/SaintBanner.vue";
import {currentLiturgyHour} from "@/constants/utils.ts";
import {bookOutline} from "ionicons/icons";
import DateAndCelebration from "@/components/molecules/DateAndCelebration.vue";


const ionRouter = useIonRouter();
useBackButton(-1, () => {
  if (!ionRouter.canGoBack()) {
    App.exitApp();
  }
});


</script>

<template>
  <ion-page>
    <ion-content>
      <div class="date-section ion-padding">
        <DateAndCelebration/>
        <SaintBanner/>
      </div>

      <div class="prayer-grid">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item class="prayer-item" router-link="/prayer/evangelium-and-lectiones">
                <ion-label>
                  <h2>{{ $t('breviarium.evangelium_lectiones') }}</h2>
                  <p>Mt 1, 2-5</p>
                </ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Laudes' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/laudes">
                <ion-label>
                  <h2>{{ $t('breviarium.laudes') }}</h2>
                  <p>Oración de la mañana</p>
                </ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Vesperae' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/vesperae">
                <ion-label>{{ $t('breviarium.vesperae') }}</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item class="prayer-item" router-link="/prayer/officium">
                <ion-label>{{ $t('breviarium.officium') }}</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Tercia' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/tertia">
                <ion-label>{{ $t('breviarium.tercia') }}</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Sexta' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/sexta">
                <ion-label>{{ $t('breviarium.sexta') }}</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Nona' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/nona">
                <ion-label>{{ $t('breviarium.nona') }}</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item :class="currentLiturgyHour() == 'Completorium' ? 'selected_hour' : ''" class="prayer-item"
                        router-link="/prayer/completorium">
                <ion-label>{{ $t('breviarium.completorium') }}</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item class="prayer-item" router-link="/bible">
                <ion-icon slot="start" :icon="bookOutline" style="color: var(--gold-color);"></ion-icon>
                <ion-label>
                  <h2>{{ $t('bibleOfJerusalem') }}</h2>
                  <p>{{ $t('bibleSubtitle') }}</p>
                </ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="ion-text-center color-danger-500">
              <ion-label>⚠️ Aplicación en desarrollo</ion-label>
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

.prayer-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --border-radius: 8px;
  --background: var(--background-color-card);
  border: 0 solid var(--border-color);
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