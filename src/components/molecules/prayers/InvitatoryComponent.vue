<template>
  <p><span class="title-color">Ant. </span>{{ invitatoriumAntiphon?.val }}</p>
  <ion-segment v-model="selectedInvitatorium">
    <ion-segment-button value="first">
      <ion-label>{{ $t('psalm') }} 94</ion-label>
    </ion-segment-button>
    <ion-segment-button value="second">
      <ion-label>{{ $t('psalm') }} 99</ion-label>
    </ion-segment-button>
    <ion-segment-button value="third">
      <ion-label>{{ $t('psalm') }} 66</ion-label>
    </ion-segment-button>
    <ion-segment-button value="fourth">
      <ion-label>{{ $t('psalm') }} 23</ion-label>
    </ion-segment-button>
  </ion-segment>
  <div>
    <div v-if="selectedInvitatorium == 'first'">
      <div class="title-color" v-html="invitatorium_psalms?.at(0).title"></div>
      <div v-html="invitatorium_psalms?.at(0).psalm"></div>
    </div>
    <div v-if="selectedInvitatorium == 'second'">
      <div class="title-color" v-html="invitatorium_psalms?.at(1).title"></div>
      <div v-html="invitatorium_psalms?.at(1).psalm"></div>
    </div>
    <div v-if="selectedInvitatorium == 'third'">
      <div class="title-color" v-html="invitatorium_psalms?.at(2).title"></div>
      <div v-html="invitatorium_psalms?.at(2).psalm"></div>
    </div>
    <div v-if="selectedInvitatorium == 'fourth'">
      <div class="title-color" v-html="invitatorium_psalms?.at(3).title"></div>
      <div v-html="invitatorium_psalms?.at(3).psalm"></div>
    </div>
  </div>
  <p><span class="title-color">Ant. </span>{{ invitatoriumAntiphon?.val }}</p>
</template>

<script lang="ts" setup>
import {onMounted, ref, Ref} from "vue";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/vue";
import Breviarium from "breviarium";
import {InvitatoriumSchemaOutput} from "breviarium/dist/prayer-manager-interface";

const invitatorium_psalms: Ref<any[] | undefined> = ref();
const invitatoriumAntiphon = ref<InvitatoriumSchemaOutput>();
const selectedInvitatorium = ref<string>('first');

onMounted(async () => {
  const brev = new Breviarium();
  await brev.getInvitatoriumPsalms().then(data => {
    invitatorium_psalms.value = data;
  });

  await brev.getInvitatorium().then((data) => {
    invitatoriumAntiphon.value = data;
  }).catch(error => {
    console.error(error);
  })
});

</script>

<style scoped>
ion-segment-view {
  overflow-y: hidden; /* Prevents scrolling */
  height: auto; /* Ensures it takes the height of its content */
}
</style>