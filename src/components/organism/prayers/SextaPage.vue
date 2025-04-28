<template>
  <IntermediumPage :prayer-lib="brev.getSexta" prayer-title="Sexta"></IntermediumPage>
</template>
<script lang="ts" setup>

import IntermediumPage from "@/components/organism/prayers/IntermediumPage.vue";
import Breviarium from "breviarium";

const brev = new Breviarium();

</script>
<style lang="css" scoped>
</style>