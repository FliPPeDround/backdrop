<script setup lang="ts">
import Background from '~/layout/Background.vue'
</script>

<template>
  <div>
    <RouterView />
    <Background
      :speed="5"
      :scale="1"
      color="#7B7481"
      :noise-intensity="1.5"
      :rotation="0"
    />
  </div>
</template>
