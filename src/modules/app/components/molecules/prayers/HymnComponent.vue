<template>
  <div>
    <h4 class="title title-color">
      {{ $t("hymn") }}
    </h4>
    <div v-if="hymns.length > 1">
      <ion-segment v-model="selectedHymn">
        <ion-segment-button v-for="(item, index) in hymns" :value="index">
          <ion-label :alt="item.charAt(0)">{{ $t("hymn") }} {{ index + 1 }}</ion-label>
        </ion-segment-button>
      </ion-segment>
      <div>
        <div v-for="(item, index) in hymns">
          <div v-if="selectedHymn == index" v-html="formatText(item)"></div>
        </div>
      </div>

    </div>
    <div v-if="hymns.length === 1">
      <span v-html="formatText(hymns[0])"></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {formatText} from "@/modules/app/constants/formatText.ts";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import {computed, ref} from "vue";

const props = defineProps({
  text: {
    type: String,
    required: false,
  },
});

const selectedHymn = ref<number>(0);
const splitText = "$O bien:$";
const hymns = computed(
    () => props.text?.split(splitText).map((hymn) => hymn.trim()) || []
);

// watch(hymns, () => {
//   selectedHymn.value = hymns.value[0];
// }, {immediate: true});

</script>
