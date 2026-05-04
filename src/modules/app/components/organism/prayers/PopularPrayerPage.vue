<template>
  <PrayerPage :title="prayerTitle">
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

const route = useRoute();

const prayers: Record<string, { title: string; component: any }> = {
  rosary: {title: "Rosario", component: RosariumComponent},
  angelus: {title: "Ángelus", component: AngelusComponent},
  "regina-coeli": {title: "Regina Coeli", component: ReginaCoeliComponent},
  "chaplet-divine-mercy": {title: "Coronilla de la Divina Misericordia", component: ChapletDivineMercyComponent},
  "litanies-humility": {title: "Letanías de la Humildad", component: LitaniesHumilityComponent},
};

const prayerKey = computed(() => route.params.prayer as string);
const prayerTitle = computed(() => prayers[prayerKey.value]?.title || "Oración");
const prayerComponent = computed(() => prayers[prayerKey.value]?.component);
</script>
