<template>
  <h4 class="title title-color">
    {{ $t("officiumLectionis") }}
  </h4>
  <div>
    <OfficiumFirstLecture/>
  </div>
  <h4 class="title title-color">
    {{ $t("lectioAltera") }}
  </h4>
  <div>
    <OfficiumSecondLecture/>
  </div>
</template>
<script lang="ts" setup>
import OfficiumFirstLecture from "@/modules/app/components/molecules/prayers/OfficiumFirstLecture.vue";
import OfficiumSecondLecture from "@/modules/app/components/molecules/prayers/OfficiumSecondLecture.vue";
</script>