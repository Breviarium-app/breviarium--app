<template>
  <div>
    <h4 class="title title-color">
      {{ $t("hymn") }}
    </h4>
    <div v-if="hymns.length > 1">
      <ion-segment>
        <ion-segment-button v-for="(item, index) in hymns" :content-id="index" :value="index">
          <ion-label :alt="item.charAt(0)">{{ $t("hymn") }} {{ index + 1 }}</ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-segment-view>
        <ion-segment-content v-for="(item, index) in hymns" :id="index">
          <div v-html="formatText(item)"></div>
        </ion-segment-content>
      </ion-segment-view>

    </div>
    <div v-if="hymns.length === 1">
      <span v-html="formatText(hymns[0])"></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {formatText} from "@/constants/formatText.js";
import {IonLabel, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView} from "@ionic/vue";
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

console.log("props.text", props.text)
watch(hymns, () => {
  selectedHymn.value = hymns.value[0];
}, {immediate: true});

function onChangeHymn(newHymn: any) {
  selectedHymn.value = newHymn;
}
</script>
