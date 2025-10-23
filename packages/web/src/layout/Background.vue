<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen w-full relative">
    <div
      class="inset-0 absolute z-[-1]"
      :style="{
        background: 'radial-gradient(125% 125% at 50% 90%, #000 40%, #6366f1 100%)',
      }"
    />
    <slot />
  </div>
</template>
