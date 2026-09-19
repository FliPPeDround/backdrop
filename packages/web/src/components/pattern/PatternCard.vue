<script setup lang="ts">
import type { Pattern } from '@backdrop/data'
import { toBindingStyle } from '@backdrop/shared'
import { useFavourites } from '~/composables/favourites'

const props = defineProps<{
  pattern: Pattern
  expanded?: boolean
}>()

const emit = defineEmits<{
  select: [pattern: Pattern, el: HTMLElement]
}>()

const { isFavourite, toggleFavourite } = useFavourites()

const bindingStyle = computed(() => toBindingStyle(props.pattern.style))

function onSelect(event: MouseEvent | KeyboardEvent) {
  emit('select', props.pattern, event.currentTarget as HTMLElement)
}

function onToggleFavourite(event: Event) {
  event.stopPropagation()
  toggleFavourite(props.pattern.id)
}
</script>

<template>
  <div
    class="group text-left rounded-2xl bg-white w-full aspect-square cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-transform duration-300 relative overflow-hidden focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-2"
    :class="expanded
      ? 'opacity-0 pointer-events-none'
      : 'hover:scale-[1.02]'"
    role="button"
    :tabindex="expanded ? -1 : 0"
    :aria-expanded="expanded"
    @click="onSelect"
    @keydown.enter.prevent="onSelect"
  >
    <div class="inset-0 absolute" :style="bindingStyle" />

    <div class="left-2 top-2 absolute z-10" @click.stop>
      <GlassSurface
        simple
        :width="32"
        :height="32"
        :border-radius="16"
        :background-opacity="isFavourite(pattern.id) ? 0.28 : 0.12"
        class-name="cursor-pointer transition-transform hover:scale-110"
        :title="isFavourite(pattern.id) ? '取消收藏' : '收藏'"
        @click="onToggleFavourite"
      >
        <i
          class="text-sm"
          :class="isFavourite(pattern.id) ? 'i-carbon:star-filled text-amber-300' : 'i-carbon:star text-white'"
        />
      </GlassSurface>
    </div>

    <div
      v-if="pattern.badge && pattern.badge.trim()"
      class="w-fit right-2 top-2 absolute z-10"
    >
      <GlassSurface
        simple
        width="auto"
        :height="26"
        :border-radius="13"
        :background-opacity="0.16"
        class-name="px-1"
      >
        <span class="text-xs text-white">{{ pattern.badge }}</span>
      </GlassSurface>
    </div>

    <div class="p-3 pt-10 opacity-100 flex flex-col transition-opacity duration-300 inset-x-0 bottom-0 justify-end absolute z-10 from-black/80 to-transparent via-black/25 bg-gradient-to-t lg:opacity-0 lg:group-hover:opacity-100">
      <span class="text-sm text-white font-medium truncate">{{ pattern.name }}</span>
      <span class="text-xs text-white/70 mt-0.5">点击查看代码</span>
    </div>
  </div>
</template>
