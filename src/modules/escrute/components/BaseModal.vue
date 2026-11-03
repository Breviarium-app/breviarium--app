<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="closeOnBackdrop && close()">
        <div aria-modal="true" class="modal-sheet" role="dialog" @click.stop>
          <header class="modal-header">
            <slot name="header">
              <div>
                <p v-if="eyebrow" class="es-eyebrow">{{ eyebrow }}</p>
                <h3 class="modal-title">{{ title }}</h3>
              </div>
            </slot>
            <button :aria-label="t('escrute.close')" class="close-button" type="button" @click="close">
              <ion-icon :icon="closeOutline" aria-hidden="true"></ion-icon>
            </button>
          </header>
          <div ref="content" class="modal-content">
            <slot></slot>
          </div>
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import {IonIcon} from '@ionic/vue';
import {closeOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';

withDefaults(defineProps<{
  modelValue: boolean;
  title?: string;
  eyebrow?: string;
  closeOnBackdrop?: boolean;
}>(), {
  title: '',
  eyebrow: '',
  closeOnBackdrop: true,
});

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
const {t} = useI18n();

const close = () => emit('update:modelValue', false);

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close();
};

const content = ref<HTMLElement>();
const scrollToTop = () => content.value?.scrollTo({top: 0});

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));

defineExpose({scrollToTop});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: rgba(var(--shadow-color), 0.35);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.modal-sheet {
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: var(--paper-raised);
  color: var(--ink);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  box-shadow: var(--shadow-lg);
  padding-bottom: var(--ion-safe-area-bottom, 0px);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--rule);
}

.modal-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--paper-sunken);
  color: var(--ink-soft);
  cursor: pointer;
  padding: 0;
  font-size: 1.25rem;
  transition: color 150ms var(--ease);
}

.close-button:hover {
  color: var(--ink);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4) var(--space-5) var(--space-6);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--rule);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 250ms var(--ease);
}

.modal-enter-active .modal-sheet,
.modal-leave-active .modal-sheet {
  transition: transform 300ms var(--ease);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-sheet,
.modal-leave-to .modal-sheet {
  transform: translateY(2rem);
}

@media (min-width: 720px) {
  .modal-overlay {
    align-items: center;
  }

  .modal-sheet {
    width: min(42rem, 90vw);
    border-radius: var(--radius-lg);
    padding-bottom: 0;
  }
}
</style>
