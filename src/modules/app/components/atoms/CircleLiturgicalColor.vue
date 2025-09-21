<template>
  <span :style="'background-color:' + liturgicalColorVar" class="liturgical-color"></span>
</template>
<script lang="ts" setup>

import {LiturgicalColors} from "@/modules/app/constants/types.ts";
import {getHexLiturgicalColor} from "@/modules/app/constants/utils.ts";

defineProps({
  liturgicalColorVar: {
    type: String,
    default: getHexLiturgicalColor(LiturgicalColors.WHITE),
    required: true
  }
})


</script>
<style scoped>

.liturgical-color {
  width: 12px;
  height: 12px;
  display: inline-block;
  border-radius: 8px;
  vertical-align: 0;
}
</style>