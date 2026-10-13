<template>
  <ion-item :detail="true" class="prayer-item" @click="router.push('/prayer/evangelium')">
    <ion-icon slot="start" :icon="readerOutline"></ion-icon>
    <ion-label>
      <h2>{{ $t('breviarium.evangelium_lectiones') }}</h2>
      <p>{{ gospelQuote }}</p>
    </ion-label>
  </ion-item>
</template>

<script lang="ts" setup>
import router from "@/modules/app/router";
import {IonIcon, IonItem, IonLabel} from "@ionic/vue";
import {readerOutline} from "ionicons/icons";
import {computed, onMounted, ref, watch} from "vue";
import {useBreviariumStore} from "@/modules/app/stores/breviarium.ts";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";

const gospelData = ref('');
const gospelQuote = computed(() => gospelData.value);
const breviariumStore = useBreviariumStore();

const updateGospelQuote = async () => {
  await breviariumStore.getEvangelium().then((data) => {
    if (data?.evangelium_lectiones) {
      if (data?.evangelium_lectiones?.length > 0) {
        gospelData.value = data?.evangelium_lectiones[0]?.ref.split(':')[0];
      }
    }
  });

};

watch(
    () => useDateStore().getCurrentDate,
    () => updateGospelQuote()
);

onMounted(async () => {
  await updateGospelQuote();
});
</script>