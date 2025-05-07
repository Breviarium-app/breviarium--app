<template>
  <div v-if="storageManager.loadIntentions().length > 0" class="custom-prayers">
    <ul>
      <li v-for="element in storageManager.loadIntentions()">- {{ element }}</li>
    </ul>
    <p>
      <small>{{ $t('prayer_intentions_modify_explanation') }} <a
          @click="router.push('/prayer-intentions')">{{ $t('prayer_intentions').toLowerCase() }}</a>.</small>
    </p>
  </div>
</template>
<script lang="ts" setup>
import {IntentionsStorageManager} from "@/services/IntentionsStorageManager.ts";
import router from "@/router";

const storageManager = new IntentionsStorageManager('prayerIntentions');
</script>
<style lang="css" scoped>
.custom-prayers li {
  list-style-type: none;
}
</style>