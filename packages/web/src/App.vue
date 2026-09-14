<script setup lang="ts">
import Background from '~/layout/Background.vue'
</script>

<template>
  <div class="min-h-screen relative">
    <Background
      class-name="fixed inset-0 z-0 pointer-events-none"
      :speed="5"
      :scale="1"
      color="#7B7481"
      :noise-intensity="1.5"
      :rotation="0"
    />
    <RouterView />
  </div>
</template>
