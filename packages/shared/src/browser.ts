import type { Pattern } from '@backdrop/data'
import type { ComputedRef, Ref } from 'vue'
import type { PatternCategory } from './categories'
import { gridPatterns } from '@backdrop/data'
import { computed, ref } from 'vue'
import { PATTERN_CATEGORIES } from './categories'
import { filterPatterns } from './filter'

export interface PatternBrowserOptions {
  patterns?: readonly Pattern[]
  favouriteIds?: Ref<string[]>
  initialCategory?: PatternCategory
}

export interface PatternBrowser {
  categories: typeof PATTERN_CATEGORIES
  activeCategory: Ref<PatternCategory>
  filteredPatterns: ComputedRef<readonly Pattern[]>
  count: ComputedRef<number>
  isEmptyState: ComputedRef<boolean>
}

export function usePatternBrowser(options: PatternBrowserOptions = {}): PatternBrowser {
  const { patterns = gridPatterns, favouriteIds, initialCategory = 'all' } = options

  const activeCategory = ref<PatternCategory>(initialCategory)
  const filteredPatterns = computed(() =>
    filterPatterns(patterns, activeCategory.value, favouriteIds?.value ?? []),
  )

  return {
    categories: PATTERN_CATEGORIES,
    activeCategory,
    filteredPatterns,
    count: computed(() => filteredPatterns.value.length),
    isEmptyState: computed(() => filteredPatterns.value.length === 0),
  }
}
