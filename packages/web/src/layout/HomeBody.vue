<script setup lang="ts">
/**
 * 首页与图案深链页 `/p/<id>/` 共用的正文。
 *
 * 两处的差别只在 `PatternShowcase` 从哪里读到要打开的图案 id
 * （首页读 `?pattern=`，深链页读路径），正文本身保持一致。
 */
import McpAccess from '~/components/mcp/McpAccess.vue'
import PatternShowcase from '~/components/pattern/PatternShowcase.vue'
import Header from '~/layout/Header.vue'
import Hero from '~/layout/Hero.vue'
</script>

<template>
  <Header />
  <div class="relative z-10">
    <div mx-auto px-4 py-8 text-center container flex items-center justify-center overflow-hidden lg:px-8 lg:py-18 md:py-16 sm:px-6 sm:py-12>
      <div mx-auto max-w-6xl cursor-default>
        <Hero />
      </div>
    </div>
    <McpAccess />
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
