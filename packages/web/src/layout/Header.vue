<script setup lang="ts">
const hidden = ref(false)
const qrOpen = ref(false)
const qrWrapRef = useTemplateRef<HTMLElement>('qrWrapRef')

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
useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape')
    qrOpen.value = false
})

onClickOutside(qrWrapRef, () => {
  qrOpen.value = false
})

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
      class-name="!overflow-visible"
    >
      <div flex="~ row" mx-6 w-full items-center justify-between>
        <div flex items-center>
          <Logo text-26px mr-2 />
          Backdrop
        </div>

        <div flex gap-2 items-center>
          <div ref="qrWrapRef" class="group flex items-center relative">
            <button
              type="button"
              class="flex cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="扫码体验小程序"
              :aria-expanded="qrOpen"
              @click="qrOpen = !qrOpen"
            >
              <div i-mingcute:wechat-miniprogram-fill />
            </button>

            <div
              class="pt-8 opacity-0 pointer-events-none origin-top-right scale-95 transition-[opacity,transform] duration-200 ease-out right-0 top-full absolute z-50 group-focus-within:opacity-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-hover:pointer-events-auto group-focus-within:scale-100 group-hover:scale-100"
              :class="qrOpen ? 'pointer-events-auto scale-100 opacity-100' : ''"
            >
              <GlassSurface simple width="12rem" height="auto" :border-radius="16">
                <div class="p-1 flex flex-col gap-2 w-full items-center">
                  <img src="/mp-qrcode.png" alt="Backdrop 小程序二维码" class="p-2 rounded-xl bg-white h-36 w-36">
                  <span class="text-xs text-white/70 leading-snug text-center">微信扫码，体验 Backdrop 小程序</span>
                </div>
              </GlassSurface>
            </div>
          </div>

          <a href="https://github.com/FliPPeDround/backdrop" target="_blank" i-carbon:logo-github cursor-pointer />
        </div>
      </div>
    </GlassSurface>
  </div>
</template>
