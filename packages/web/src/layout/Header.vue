<script setup lang="ts">
const hidden = ref(false)

function updateVisibility() {
  const grid = document.getElementById('pattern-grid')
  if (!grid) {
    hidden.value = false
    return
  }
  hidden.value = grid.getBoundingClientRect().top < 96
}

useEventListener(window, 'scroll', updateVisibility, { passive: true })
useEventListener(window, 'resize', updateVisibility, { passive: true })
onMounted(updateVisibility)
</script>

<template>
  <div
    class="mx-auto mt-6 w-fit transform-gpu transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] top-6 sticky z-50"
    :class="hidden
      ? 'pointer-events-none opacity-0 -translate-y-[120%]'
      : 'opacity-100 translate-y-0'"
  >
    <GlassSurface
      :border-radius="20"
      width="min(48rem, calc(100vw - 1.5rem))"
      height="60px"
    >
      <div flex="~ row" mx-6 w-full items-center justify-between>
        <div flex items-center>
          <Logo text-26px mr-2 />
          Backdrop
        </div>
        <a href="https://github.com/FliPPeDround/backdrop" target="_blank" i-carbon:logo-github cursor-pointer />
      </div>
    </GlassSurface>
  </div>
</template>
