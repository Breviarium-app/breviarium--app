<template>
  <ion-item class="prayer-item" @click="router.push('/prayer/evangelium')">
    <ion-label>
      <h2>{{ $t('breviarium.evangelium_lectiones') }}</h2>
      <p>{{ gospelQuote }}</p>
    </ion-label>
  </ion-item>
</template>

<script lang="ts" setup>
import router from "@/router/index.js";
import {IonItem, IonLabel} from "@ionic/vue";
import {onMounted, ref, watch} from "vue";
import {useBreviariumStore} from "@/stores/breviarium.ts";
import {useDateStore} from "@/stores/useDateStore.ts";

const gospelQuote = ref('');
const breviariumStore = useBreviariumStore();

const updateGospelQuote = async () => {
  breviariumStore.getEvangelium().then((data) => {
    if (data.evangelium_lectiones.length > 0) {
      gospelQuote.value = data.evangelium_lectiones[0]?.ref.split(':')[0];
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