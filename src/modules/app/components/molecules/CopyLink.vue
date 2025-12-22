<template>
  <div class="copy-link">
    <div class="copy-button" style="cursor: pointer" @click="copyToClipboard">
      {{ $t('copyLink') || 'Copiar enlace' }}
      <ShareIcon/>
    </div>
    <small v-if="showDescription">{{ $t('copyLinkDescription') || 'Copia enlace a los textos de hoy' }}</small>
  </div>
</template>

<script lang="ts" setup>
import ShareIcon from "@/modules/app/components/atoms/ShareIcon.vue";

const props = defineProps<{
  link: string;
  showDescription?: boolean;
}>();

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.link);

  } catch (err) {
    console.error('Failed to copy: ', err);
  }
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
  border-radius: 20px;
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
</style>
