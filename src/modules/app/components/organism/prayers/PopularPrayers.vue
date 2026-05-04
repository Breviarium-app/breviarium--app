<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="Atrás"></ion-back-button>
        </ion-buttons>
        <ion-title>Oraciones Populares</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="prayers-grid">
        <button
            v-for="prayer in prayers"
            :key="prayer.route"
            class="prayer-card"
            @click="router.push(`/popular-prayers/${prayer.route}`)"
        >
          <span class="prayer-icon">{{ prayer.icon }}</span>
          <span class="prayer-name">{{ prayer.name }}</span>
        </button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import router from "@/modules/app/router";

const prayers = [
  {name: "Rosario", route: "rosary", icon: "📿"},
  {name: "Ángelus", route: "angelus", icon: "🔔"},
  {name: "Regina Coeli", route: "regina-coeli", icon: "👑"},
  {name: "Coronilla de la Divina Misericordia", route: "chaplet-divine-mercy", icon: "✝️"},
  {name: "Letanías de la Humildad", route: "litanies-humility", icon: "🙏"},
];
</script>

<style scoped>
.prayers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px 0;
}

.prayer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
  border-radius: 12px;
  background: var(--ion-color-light);
  border: none;
  cursor: pointer;
  min-height: 120px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.prayer-card:active {
  transform: scale(0.96);
}

.prayer-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.prayer-name {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  color: var(--ion-color-primary);
  line-height: 1.3;
}
</style>