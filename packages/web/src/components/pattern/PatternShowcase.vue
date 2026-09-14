<script setup lang="ts">
import type { Pattern } from '@backdrop/data'
import type { CardOrigin } from './origin'
import { gridPatterns } from '@backdrop/data'
import { useFavourites } from '~/composables/favourites'
import { PATTERN_CATEGORIES } from '~/lib/constants'
import { readOrigin } from './origin'

const { ids } = useFavourites()
const activeCategory = ref<(typeof PATTERN_CATEGORIES)[number]['id']>('all')
const selected = ref<Pattern | null>(null)
const origin = ref<CardOrigin | null>(null)
const originEl = shallowRef<HTMLElement | null>(null)

function onSelect(pattern: Pattern, el: HTMLElement) {
  originEl.value = el
  origin.value = readOrigin(el)
  selected.value = pattern
}

const filteredPatterns = computed(() => {
  if (activeCategory.value === 'all')
    return gridPatterns
  if (activeCategory.value === 'favourites')
    return gridPatterns.filter(pattern => ids.value.includes(pattern.id))
  return gridPatterns.filter(pattern => pattern.category === activeCategory.value)
})
</script>

<template>
  <section id="pattern-showcase" class="mx-auto px-4 pb-20 max-w-7xl relative z-10 lg:px-8 sm:px-6">
    <div class="mb-8 text-center">
      <h2 class="text-2xl text-white font-bold sm:text-3xl">
        背景图案
      </h2>
      <p class="text-sm text-white/60 mt-2">
        点击卡片预览小程序效果，并复制对应框架代码
      </p>
    </div>

    <div class="mb-6 flex flex-wrap gap-2 items-center justify-center">
      <GlassSurface
        v-for="category in PATTERN_CATEGORIES"
        :key="category.id"
        width="auto"
        :height="40"
        :border-radius="20"
        :background-opacity="activeCategory === category.id ? 0.24 : 0.08"
        class-name="cursor-pointer px-3 select-none"
        @click="activeCategory = category.id"
      >
        <span
          class="text-sm whitespace-nowrap"
          :class="activeCategory === category.id ? 'text-white' : 'text-white/65'"
        >
          {{ category.label }}
        </span>
      </GlassSurface>
    </div>

    <p class="text-sm text-white/50 mb-5 text-center">
      {{ filteredPatterns.length }} 个图案
    </p>

    <div
      v-if="filteredPatterns.length"
      id="pattern-grid"
      class="gap-4 grid grid-cols-1 sm:gap-5 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <PatternCard
        v-for="pattern in filteredPatterns"
        :key="pattern.id"
        :pattern="pattern"
        :expanded="selected?.id === pattern.id"
        @select="onSelect"
      />
    </div>

    <div
      v-else
      id="pattern-grid"
      class="text-white/60 px-6 py-16 text-center border border-white/10 rounded-2xl bg-white/5"
    >
      还没有收藏的背景，点卡片左上角星星试试
    </div>

    <PatternModal
      v-model:selected="selected"
      :origin="origin"
      :origin-el="originEl"
    />
  </section>
</template>
