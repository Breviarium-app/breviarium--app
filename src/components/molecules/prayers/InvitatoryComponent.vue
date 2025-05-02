<template>
  <p><span class="title-color">Ant. </span>{{ invitatorium?.val }}</p>
  <ion-segment>
    <ion-segment-button content-id="first" value="first">
      <ion-label>{{ $t('psalm') }} 94</ion-label>
    </ion-segment-button>
    <ion-segment-button content-id="second" value="second">
      <ion-label>{{ $t('psalm') }} 99</ion-label>
    </ion-segment-button>
    <ion-segment-button content-id="third" value="third">
      <ion-label>{{ $t('psalm') }} 66</ion-label>
    </ion-segment-button>
    <ion-segment-button content-id="fourth" value="fourth">
      <ion-label>{{ $t('psalm') }} 23</ion-label>
    </ion-segment-button>
  </ion-segment>
  <ion-segment-view>
    <ion-segment-content id="first">
      <div class="title-color" v-html="invitatorium_psalms?.at(0).title"></div>
      <div v-html="invitatorium_psalms?.at(0).psalm"></div>
    </ion-segment-content>
    <ion-segment-content id="second">
      <div class="title-color" v-html="invitatorium_psalms?.at(1).title"></div>
      <div v-html="invitatorium_psalms?.at(1).psalm"></div>
    </ion-segment-content>
    <ion-segment-content id="third">
      <div class="title-color" v-html="invitatorium_psalms?.at(2).title"></div>
      <div v-html="invitatorium_psalms?.at(2).psalm"></div>
    </ion-segment-content>
    <ion-segment-content id="fourth">
      <div class="title-color" v-html="invitatorium_psalms?.at(3).title"></div>
      <div v-html="invitatorium_psalms?.at(3).psalm"></div>
    </ion-segment-content>
  </ion-segment-view>
  <p><span class="title-color">Ant. </span>{{ invitatorium?.val }}</p>
</template>

<script lang="ts" setup>
import {onMounted, ref, Ref} from "vue";
import {IonLabel, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView} from "@ionic/vue";
import Breviarium from "breviarium";
import {InvitatoriumSchemaOutput} from "breviarium/dist/prayer-manager-interface";

let invitatorium_psalms: Ref<any[] | undefined> = ref();
const invitatorium = ref<InvitatoriumSchemaOutput>();

onMounted(async () => {
  const brev = new Breviarium();
  await brev.getInvitatoriumPsalms().then(data => {
    invitatorium_psalms.value = data;
  });

  await brev.getInvitatorium().then((data) => {
    invitatorium.value = data;
  })
});

</script>

<style scoped>
ion-segment-view {
  overflow-y: hidden; /* Prevents scrolling */
  height: auto; /* Ensures it takes the height of its content */
}
</style>