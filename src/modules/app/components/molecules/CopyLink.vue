<template>
  <div class="copy-link">
    <div class="copy-button" style="cursor: pointer" @click="copyToClipboard">
      {{ $t('copyLink') || 'Copiar enlace' }}
      <!--      <ShareIcon/>-->
      <Transition mode="out-in" name="fade-blur">
        <CopyIcon v-if="!copied"/>
        <CircleCheckIcon v-else/>
      </Transition>
    </div>
    <small v-if="showDescription">{{ $t('copyLinkDescription') || 'Copia enlace a los textos de hoy' }}</small>
  </div>
</template>

<script lang="ts" setup>
import CopyIcon from "@/modules/app/components/atoms/CopyIcon.vue";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import {computed, ref} from "vue";
import CircleCheckIcon from "@/modules/app/components/atoms/CircleCheckIcon.vue";

const props = defineProps<{
  link: string;
  showDescription?: boolean;
}>();

const copied = ref(false)
const dateStore = useDateStore();
const base_url = "https://app.breviarium.es"
const urlAndDate = computed(() => {
  const date = dateStore.currentDate;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${base_url}/${year}/${month}/${day}/`;
});

const copyToClipboard = async () => {
  copied.value = true
  try {
    await navigator.clipboard.writeText(urlAndDate.value + props.link);
    // TODO: toast
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
  setTimeout(() => {
    copied.value = false
  }, 1000)
};
</script>

<style scoped>
.copy-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1em 0;
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--background-color-card);
  color: var(--ion-color-primary);
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.15s ease-out;

  &:active {
    transform: scale(0.97);
  }

  &:hover {
    box-shadow: 0 0 10px var(--ion-color-primary);
  }
}

small {
  margin-top: 4px;
  opacity: 0.7;
}

.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: all 0.15s ease-out;
}

.fade-blur-enter-from {
  opacity: 0;
  filter: blur(4px);
}

.fade-blur-leave-to {
  opacity: 0;
}
</style>
