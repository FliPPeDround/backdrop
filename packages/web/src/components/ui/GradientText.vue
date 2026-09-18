<script setup lang="ts">
import { computed } from 'vue'

interface GradientTextProps {
  text?: string
  className?: string
  colors?: string[]
  animationSpeed?: number
  showBorder?: boolean
}

const props = withDefaults(defineProps<GradientTextProps>(), {
  text: '',
  className: '',
  colors: () => ['#ffaa40', '#9c40ff', '#ffaa40'],
  animationSpeed: 8,
  showBorder: false,
})

const gradientStyle = computed(() => ({
  'backgroundImage': `linear-gradient(to right, ${props.colors.join(', ')})`,
  'animationDuration': `${props.animationSpeed}s`,
  'backgroundSize': '300% 100%',
  '--animation-duration': `${props.animationSpeed}s`,
}))

const borderStyle = computed(() => ({
  ...gradientStyle.value,
}))

const textStyle = computed(() => ({
  ...gradientStyle.value,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
}))
</script>

<template>
  <div
    class="font-medium mx-auto rounded-[1.25rem] flex flex-row max-w-fit cursor-pointer transition-shadow duration-500 items-center justify-center relative overflow-hidden backdrop-blur"
  >
    <div
      v-if="showBorder"
      class="animate-gradient pointer-events-none inset-0 absolute z-0 bg-cover"
      :style="borderStyle"
    >
      <div
        class="rounded-[1.25rem] bg-black inset-0 absolute z-[-1]"
        style="width: calc(100% - 2px); height: calc(100% - 2px); left: 50%; top: 50%; transform: translate(-50%, -50%)"
      />
    </div>

    <div class="animate-gradient text-transparent inline-block relative z-2 bg-cover" :style="textStyle">
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  animation: gradient var(--animation-duration, 8s) linear infinite;
}
</style>
