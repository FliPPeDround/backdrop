<script setup lang="ts">
import type { Pattern } from '@backdrop/data'
import type { CardOrigin } from './origin'
import { PATTERN_CATEGORIES, usePatternBrowser } from '@backdrop/shared'
import { Motion } from 'motion-v'
import { useFavourites } from '~/composables/favourites'
import { useProgressiveReveal } from '~/composables/progressiveReveal'
import { readOrigin } from './origin'

const { ids } = useFavourites()
const { activeCategory, filteredPatterns } = usePatternBrowser({ favouriteIds: ids })
const selected = ref<Pattern | null>(null)
const origin = ref<CardOrigin | null>(null)
const originEl = shallowRef<HTMLElement | null>(null)

const BATCH = 12
const REVEAL_Y = 14
const REVEAL_STAGGER = 0.045
const { visible, setSentinel } = useProgressiveReveal(filteredPatterns, { initial: BATCH, batch: BATCH })

const preferredMotion = usePreferredReducedMotion()
const reduceMotion = computed(() => preferredMotion.value === 'reduce')

const revealInitial = computed(() =>
  reduceMotion.value ? { opacity: 0 } : { opacity: 0, y: REVEAL_Y },
)
const revealAnimate = computed(() =>
  reduceMotion.value ? { opacity: 1 } : { opacity: 1, y: 0 },
)

// 每批内按 index % BATCH 错峰，对象引用稳定，避免父级重渲染时重启动画
const springTransitions = Array.from({ length: BATCH }, (_, i) => ({
  type: 'spring' as const,
  bounce: 0,
  duration: 0.5,
  delay: i * REVEAL_STAGGER,
}))
const fadeTransitions = Array.from({ length: BATCH }, () => ({ duration: 0.18 }))
function revealTransition(index: number) {
  return (reduceMotion.value ? fadeTransitions : springTransitions)[index % BATCH]
}

function onSelect(pattern: Pattern, el: HTMLElement) {
  originEl.value = el
  origin.value = readOrigin(el)
  selected.value = pattern
}
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

    <template v-if="filteredPatterns.length">
      <div
        id="pattern-grid"
        class="gap-4 grid grid-cols-1 sm:gap-5 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <Motion
          v-for="(pattern, index) in visible"
          :key="pattern.id"
          :initial="revealInitial"
          :animate="revealAnimate"
          :transition="revealTransition(index)"
        >
          <PatternCard
            :pattern="pattern"
            :expanded="selected?.id === pattern.id"
            @select="onSelect"
          />
        </Motion>
      </div>
      <div :ref="setSentinel" aria-hidden="true" class="h-px w-full" />
    </template>

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
