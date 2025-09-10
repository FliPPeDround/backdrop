<script setup lang="ts">
import Header from '~/layout/Header.vue'
import Hero from '~/layout/Hero.vue'

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <Header />
  <div mx-auto px-4 py-8 text-center flex items-center justify-center relative overflow-hidden lg:px-8 lg:py-18 md:py-16 sm:px-6 sm:py-12 container>
    <div mx-auto max-w-6xl relative z-10>
      <Hero />
    </div>
  </div>
</template>
