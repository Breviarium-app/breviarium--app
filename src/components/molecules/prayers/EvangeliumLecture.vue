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
import {LecturesSchemaOutput} from "breviarium/dist/prayer-manager-interface";
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

onMounted(async () => {
  const brev = new Breviarium();
  await brev.getLectures().then((data) => {
    console.log("lectures data", data);
    getGospel(data);
  });
});

let gospel = ref()

function getGospel(items: LecturesSchemaOutput[] | undefined): void {
  if (items != undefined && items?.length > 0) {
    const prayer = items[0];
    for (let lectura of prayer.lecturas) {
      if (lectura.type == "GOSPEL") {
        gospel.value = lectura;
        console.log("gospel", gospel);
        break;
      }
    }
  }
}

</script>
<style scoped>
.gospel-header {
  font-size: 1.7rem;
  margin-top: 1em;
}
</style>