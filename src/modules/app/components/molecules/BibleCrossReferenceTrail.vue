<script lang="ts" setup>
import {nextTick, ref, watch} from 'vue';
import {IonIcon} from '@ionic/vue';
import {chevronDownOutline, closeOutline, gitBranchOutline} from 'ionicons/icons';
import {useI18n} from 'vue-i18n';
import {bibleTrailStore} from '@/modules/app/stores/bibleTrailStore.ts';
import {useTabbarVisibility} from '@/modules/app/composables/useTabbarVisibility';

const emit = defineEmits<{ (event: 'select', position: number): void }>();

const {t} = useI18n();
const trail = bibleTrailStore();
const tabbarVisible = useTabbarVisibility();
const list = ref<HTMLElement>();

// Keep the current step in view when the trail grows or the reader jumps back.
watch(() => [trail.index, trail.entries.length, trail.collapsed], async () => {
  await nextTick();
  list.value?.querySelector('.is-current')?.scrollIntoView({block: 'nearest'});
});
</script>

<template>
  <Transition name="trail">
    <aside
        v-if="trail.active"
        :aria-label="t('bible.trail_title')"
        :class="{'tabbar-hidden': !tabbarVisible, 'is-collapsed': trail.collapsed}"
        class="trail"
    >
      <header class="trail-header">
        <button
            :aria-expanded="!trail.collapsed"
            class="trail-toggle"
            type="button"
            @click="trail.collapsed = !trail.collapsed"
        >
          <ion-icon :icon="gitBranchOutline" aria-hidden="true"></ion-icon>
          <span class="trail-title">{{ t('bible.trail_title') }}</span>
          <span class="trail-count">{{ trail.entries.length }}</span>
          <ion-icon :icon="chevronDownOutline" aria-hidden="true" class="trail-chevron"></ion-icon>
        </button>
        <button :aria-label="t('bible.trail_close')" class="trail-close" type="button" @click="trail.clear()">
          <ion-icon :icon="closeOutline" aria-hidden="true"></ion-icon>
        </button>
      </header>

      <ol v-show="!trail.collapsed" ref="list" class="trail-list">
        <li
            v-for="(entry, position) in trail.entries"
            :key="position"
            :class="{'is-current': position === trail.index, 'is-ahead': position > trail.index}"
            :style="{paddingInlineStart: `${Math.min(position, 5) * 0.55}rem`}"
        >
          <button
              :aria-current="position === trail.index ? 'step' : undefined"
              class="trail-step"
              type="button"
              @click="emit('select', position)"
          >
            <span class="trail-label">{{ entry.label }}</span>
            <span v-if="entry.quote" class="trail-quote">{{ entry.quote }}</span>
          </button>
        </li>
      </ol>
    </aside>
  </Transition>
</template>

<style scoped>
/* Floats on the right, right above the auto-scroll fab. The fab sits at its ion-fab margin
   (16px, 24px on wide screens) plus the 8px margin of ion-fab-button, and the button is 40px. */
.trail {
  --tabbar-top: calc(var(--ion-safe-area-bottom, 0px) + 69px);
  --fab-inset: 24px;
  position: fixed;
  z-index: 10;
  right: var(--fab-inset);
  bottom: calc(var(--tabbar-top) + var(--fab-inset) + 40px + 12px);
  width: min(15rem, calc(100vw - 2 * var(--fab-inset)));
  border-radius: 14px;
  background: var(--background-color-card, var(--ion-background-color));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22);
  font-size: 0.85rem;
  transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.trail.tabbar-hidden {
  --tabbar-top: calc(var(--ion-safe-area-bottom, 0px) + 19px);
}

.trail-header {
  display: flex;
  align-items: center;
}

.trail-toggle,
.trail-close,
.trail-step {
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}

.trail-toggle {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  padding: 0.55rem 0.5rem 0.55rem 0.75rem;
}

.trail-toggle > ion-icon:first-child {
  color: var(--ion-color-danger);
}

.trail-title {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.trail-count {
  min-width: 1.3rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: rgba(235, 68, 90, 0.12);
  background: color-mix(in srgb, var(--ion-color-danger) 12%, transparent);
  color: var(--ion-color-danger);
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
}

.trail-chevron {
  margin-inline-start: auto;
  transition: transform 0.2s ease;
}

.is-collapsed .trail-chevron {
  transform: rotate(180deg);
}

.trail-close {
  padding: 0.55rem 0.7rem;
  line-height: 0;
  opacity: 0.6;
}

.trail-list {
  max-height: 13rem;
  margin: 0;
  padding: 0 0.5rem 0.5rem;
  overflow-y: auto;
  list-style: none;
}

.trail-step {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  border-inline-start: 2px solid rgba(235, 68, 90, 0.35);
  border-inline-start-color: color-mix(in srgb, var(--ion-color-danger) 35%, transparent);
}

.is-current .trail-step {
  background: rgba(235, 68, 90, 0.12);
  background: color-mix(in srgb, var(--ion-color-danger) 12%, transparent);
  border-inline-start-color: var(--ion-color-danger);
}

.is-ahead {
  opacity: 0.55;
}

.trail-label {
  color: var(--ion-color-danger);
  font-weight: 600;
  white-space: nowrap;
}

.trail-quote {
  overflow: hidden;
  font-size: 0.75rem;
  opacity: 0.75;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trail-enter-active,
.trail-leave-active {
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.2, 0.64, 1), bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.trail-enter-from,
.trail-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

@media (min-width: 768px) {
  .trail {
    --fab-inset: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .trail,
  .trail-enter-active,
  .trail-leave-active,
  .trail-chevron {
    transition: none;
  }
}
</style>
