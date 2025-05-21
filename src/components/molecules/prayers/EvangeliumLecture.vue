<template>
  <h4 class="gospel-header">
    {{ t("gospel") }}
  </h4>
  <!--  <p v-html="formatText(gospel?.texto)"></p>-->
  <div v-if="!gospel?.texto">
    <p v-html="t('gospelInLaudesNotFound')"></p>
  </div>
  <div v-else>
    <h4 class="title-color" v-html="formatText(gospel?.ref)"></h4>
    <p v-html="formatText(gospel?.texto)"></p>
    <p class="right">{{ t("theGospelOfTheLord") }}</p>
  </div>
</template>
<script lang="ts" setup>
import {formatText} from "@/constants/formatText.ts";
import {onMounted, ref} from "vue";
import Breviarium from "breviarium";
import {useI18n} from 'vue-i18n'
import {useDateStore} from "@/stores/useDateStore.ts";

const {t} = useI18n()

onMounted(async () => {
  const brev = new Breviarium(useDateStore().getCurrentDate);
  await brev.getEvangelium().then((data) => {

    if (data && data.evangelium_lectiones.length > 0) {
      gospel.value = data.evangelium_lectiones[0]
    }
  });
});

let gospel = ref()

</script>
<style scoped>
.gospel-header {
  font-size: 1.7rem;
  margin-top: 1em;
}
</style>