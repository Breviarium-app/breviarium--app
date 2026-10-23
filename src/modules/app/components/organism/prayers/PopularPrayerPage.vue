<template>
  <PrayerPage :alert="prayerAlert" :title="prayerTitle">
    <component :is="prayerComponent"/>
  </PrayerPage>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {useRoute} from "vue-router";
import PrayerPage from "@/modules/app/components/organism/PrayerPage.vue";
import RosariumComponent from "@/modules/app/components/molecules/prayers/RosariumComponent.vue";
import AngelusComponent from "@/modules/app/components/molecules/prayers/AngelusComponent.vue";
import ReginaCoeliComponent from "@/modules/app/components/molecules/prayers/ReginaCoeliComponent.vue";
import ChapletDivineMercyComponent from "@/modules/app/components/molecules/prayers/ChapletDivineMercyComponent.vue";
import LitaniesHumilityComponent from "@/modules/app/components/molecules/prayers/LitaniesHumilityComponent.vue";
import SanMiguelComponent from "@/modules/app/components/molecules/prayers/SanMiguelComponent.vue";
import LitaniesSaintJosephComponent from "@/modules/app/components/molecules/prayers/LitaniesSaintJosephComponent.vue";
import PrayerSaintJosephComponent from "@/modules/app/components/molecules/prayers/PrayerSaintJosephComponent.vue";
import ActoContricionComponent from "@/modules/app/components/molecules/prayers/ActoContricionComponent.vue";
import CredoComponent from "@/modules/app/components/molecules/prayers/CredoComponent.vue";
import AlmaDeCristoComponent from "@/modules/app/components/molecules/prayers/AlmaDeCristoComponent.vue";
import ComunionEspiritualComponent from "@/modules/app/components/molecules/prayers/ComunionEspiritualComponent.vue";
import SagradaFamiliaComponent from "@/modules/app/components/molecules/prayers/SagradaFamiliaComponent.vue";
import AcordaosComponent from "@/modules/app/components/molecules/prayers/AcordaosComponent.vue";

const route = useRoute();

const prayers: Record<string, { title: string; component: any }> = {
  rosary: {title: "Rosario", component: RosariumComponent},
  angelus: {title: "Ángelus", component: AngelusComponent},
  "regina-coeli": {title: "Regina Coeli", component: ReginaCoeliComponent},
  "acordaos": {title: "Acordaos", component: AcordaosComponent},
  "chaplet-divine-mercy": {title: "Coronilla de la Divina Misericordia", component: ChapletDivineMercyComponent},
  "litanies-humility": {title: "Letanías de la Humildad", component: LitaniesHumilityComponent},
  "san-miguel": {title: "San Miguel Arcángel", component: SanMiguelComponent},
  "litanies-saint-joseph": {title: "Letanías de San José", component: LitaniesSaintJosephComponent},
  "prayer-saint-joseph": {title: "Oración a San José", component: PrayerSaintJosephComponent},
  "acto-contricion": {title: "Acto de contrición", component: ActoContricionComponent},
  "credo": {title: "Credo", component: CredoComponent},
  "alma-de-cristo": {title: "Alma de Cristo", component: AlmaDeCristoComponent},
  "comunion-espiritual": {title: "Comunión espiritual", component: ComunionEspiritualComponent},
  "sagrada-familia": {title: "Oración a la Sagrada Familia", component: SagradaFamiliaComponent},
};

const prayerKey = computed(() => route.params.prayer as string);
const prayerTitle = computed(() => prayers[prayerKey.value]?.title || "Oración");
const prayerComponent = computed(() => prayers[prayerKey.value]?.component);
// The Regina Coeli replaces the Angelus in Easter, so both offer the noon reminder
const prayerAlert = computed(() => ['angelus', 'regina-coeli'].includes(prayerKey.value) ? 'angelus' as const : undefined);
</script>
