<script setup lang="ts">
import type { Pattern } from '@backdrop/data'
import { toBindingStyle } from '@backdrop/shared'
import { useNow } from '@vueuse/core'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  pattern: Pattern
  fluid?: boolean
  morph?: 'card' | 'phone'
}>(), {
  fluid: false,
  morph: 'phone',
})

const bindingStyle = computed(() => toBindingStyle(props.pattern.style))

const now = useNow({ interval: 1000 })
const currentTime = computed(() => {
  const h = now.value.getHours().toString().padStart(2, '0')
  const m = now.value.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
})
</script>

<template>
  <div
    class="phone-shell"
    :class="{
      'phone-shell--fluid': fluid,
      'phone-shell--card': morph === 'card',
    }"
  >
    <div class="phone-screen">
      <div class="phone-wallpaper" :style="bindingStyle" />
      <div class="phone-ui">
        <div class="phone-status">
          <span>{{ currentTime }}</span>
          <div class="phone-island" />
          <span class="phone-status-icons">
            <i i-carbon:wifi />
            <i i-carbon:battery-full />
          </span>
        </div>
        <div class="phone-nav">
          <div class="phone-nav-left">
            <i i-carbon:chevron-left text-sm />
          </div>
          <div class="phone-nav-title">
            {{ pattern.name }}
          </div>
          <div class="phone-capsule" aria-hidden="true">
            <span class="phone-capsule-dots">•••</span>
            <span class="phone-capsule-divider" />
            <span class="phone-capsule-close" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone-shell {
  width: min(260px, 100%);
  aspect-ratio: 9 / 19.5;
  padding: 10px;
  border-radius: 38px;
  background: linear-gradient(160deg, #3a3a3a, #111 30%, #000);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.12),
    0 0 0 1px #1a1a1a,
    0 18px 50px rgba(0, 0, 0, 0.45);
  transition:
    padding 0.48s cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 0.48s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.48s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.48s cubic-bezier(0.22, 1, 0.36, 1);
}

.phone-shell--fluid {
  width: 100%;
  height: 100%;
  aspect-ratio: auto;
}

.phone-shell--card {
  padding: 0;
  border-radius: inherit;
  background: transparent;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
}

@media (max-width: 1023px) {
  .phone-shell:not(.phone-shell--fluid) {
    width: min(180px, 56vw);
  }
}

.phone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 28px;
  background: #fff;
  transition: border-radius 0.48s cubic-bezier(0.22, 1, 0.36, 1);
}

.phone-shell--card .phone-screen {
  border-radius: inherit;
}

.phone-wallpaper {
  position: absolute;
  inset: 0;
}

.phone-ui {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #fff;
  pointer-events: none;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.28) 0%, transparent 28%);
  opacity: 1;
  transition: opacity 0.36s ease 0.08s;
}

.phone-shell--card .phone-ui {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .phone-shell,
  .phone-screen,
  .phone-ui {
    transition: none;
  }
}

.phone-status {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  margin-top: 8px;
  padding: 0 18px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.phone-island {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  max-width: 72px;
  height: 18px;
  border-radius: 999px;
  background: #0a0a0a;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.phone-status-icons {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}

.phone-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 10px 0 8px;
}

.phone-nav-left {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(8px);
}

.phone-nav-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
}

.phone-capsule {
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: #111;
  box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.08);
  text-shadow: none;
}

.phone-capsule-dots {
  font-size: 11px;
  letter-spacing: 0.5px;
  line-height: 1;
}

.phone-capsule-divider {
  width: 1px;
  height: 14px;
  margin: 0 6px;
  background: rgba(0, 0, 0, 0.18);
}

.phone-capsule-close {
  width: 10px;
  height: 10px;
  border: 1.5px solid #111;
  border-radius: 999px;
}
</style>
