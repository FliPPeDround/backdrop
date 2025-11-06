<script setup lang="ts">
</script>

<template>
  <GlassSurface
    :border-radius="20"
    width="48rem"
    height="60px"
    class-name="fixed top-6 left-1/2 -translate-x-1/2 z-50"
  >
    <div flex="~ row" mx-6 w-full items-center justify-between>
      <div flex items-center>
        <Logo mr-2 />
        Bling Background
      </div>
      <a href="https://github.com/FliPPeDround/BG-Bling" target="_blank" i-carbon:logo-github cursor-pointer />
    </div>
  </GlassSurface>
</template>
