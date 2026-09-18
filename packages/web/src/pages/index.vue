<script setup lang="ts">
import PatternShowcase from '~/components/pattern/PatternShowcase.vue'
import Header from '~/layout/Header.vue'
import Hero from '~/layout/Hero.vue'

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <Header />
  <div class="relative z-10">
    <div mx-auto px-4 py-8 text-center container flex items-center justify-center overflow-hidden lg:px-8 lg:py-18 md:py-16 sm:px-6 sm:py-12>
      <div mx-auto max-w-6xl cursor-default>
        <Hero />
      </div>
    </div>
    <PatternShowcase />
  </div>
  <footer class="text-sm text-gray-400 mx-auto px-4 pb-8 text-center w-full relative z-10">
    <p>
      <a href="https://github.com/FliPPeDround/backdrop" target="_blank" underline>Backdrop</a>
      · Released under the
      <a href="https://github.com/FliPPeDround/backdrop/blob/main/LICENSE" target="_blank" underline>MIT License</a>
    </p>
    <p class="text-gray-500 mt-1">
      灵感与背景样式来自
      <a href="https://github.com/megh-bari/pattern-craft" target="_blank" underline>pattern-craft</a>
      by megh-bari
    </p>
    <p class="text-gray-500 mt-1">
      This site is powered by
      <a href="https://www.netlify.com/" target="_blank" underline>Netlify</a>
    </p>
  </footer>
</template>
