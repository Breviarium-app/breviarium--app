<template>
  <div>
    <h4 class="title title-color">
      {{ $t("hymn") }}
    </h4>
    <div v-if="hymns.length > 1">
      <breviarium-segment
          :value="selectedHymn"
          @update:value="onChangeHymn"
      >
        <breviarium-segment-button
            v-for="(hymn, index) in hymns"
            :key="index"
            :value="hymn"
        >
          <ion-label>
            {{ $t("hymn") }} {{ index + 1 }}
          </ion-label>
        </breviarium-segment-button>
      </breviarium-segment>
      <span v-html="formatText(selectedHymn)"></span>
    </div>
    <div v-if="hymns.length === 1">
      <span v-html="formatText(hymns[0])"></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BreviariumSegment from "@/components/molecules/prayers/BreviariumSegment.vue";
import BreviariumSegmentButton from "@/components/molecules/prayers/BreviariumSegmentButton.vue";
import {formatText} from "@/constants/formatText.js";
import {IonLabel} from "@ionic/vue";
import {computed, ref, watch} from "vue";

const props = defineProps({
  text: {
    type: String,
    required: false,
  },
});


const selectedHymn = ref("");
const splitText = "$O bien:$";
const hymns = computed(
    () => props.text?.split(splitText).map((hymn) => hymn.trim()) || []
);

watch(hymns, () => {
  selectedHymn.value = hymns.value[0];
}, {immediate: true});

function onChangeHymn(newHymn: any) {
  selectedHymn.value = newHymn;
}
</script>
