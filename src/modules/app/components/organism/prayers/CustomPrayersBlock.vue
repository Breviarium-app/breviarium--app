<template>
  <div v-if="intentions.length > 0" class="custom-prayers">
    <ul>
      <li v-for="element in intentions" :key="element.id">- {{ element.text }}</li>
    </ul>
    <p>
      <small>{{ $t('prayer_intentions_modify_explanation') }} <a
          @click="router.push('/prayer-intentions')">{{ $t('prayer_intentions').toLowerCase() }}</a>.</small>
    </p>
  </div>
</template>
<script lang="ts" setup>
import {storeToRefs} from "pinia";
import {useIntentionsStore} from "@/modules/app/stores/intentionsStore.ts";
import router from "@/modules/app/router";

const {intentions} = storeToRefs(useIntentionsStore());
</script>
<style lang="css" scoped>
.custom-prayers li {
  list-style-type: none;
}

ul {
  padding-left: 12px;
}
</style>
