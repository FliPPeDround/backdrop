import type { Pattern } from '@backdrop/data'
import type { ComputedRef, Ref } from 'vue'
import type { PatternCategory } from './categories'
import type { PatternColorFilter, PatternColorOption } from './colors'
import { gridPatterns } from '@backdrop/data'
import { computed, ref } from 'vue'
import { PATTERN_CATEGORIES } from './categories'
import { PATTERN_COLORS } from './colors'
import { countByColor, filterByColor, filterPatterns } from './filter'

export interface PatternBrowserOptions {
  patterns?: readonly Pattern[]
  favouriteIds?: Ref<string[]>
  initialCategory?: PatternCategory
  initialColor?: PatternColorFilter
}

export interface PatternColorChoice extends PatternColorOption {
  /** How many of the current category carry this colour — 0 means picking it empties the grid. */
  count: number
}

export interface PatternBrowser {
  categories: typeof PATTERN_CATEGORIES
  activeCategory: Ref<PatternCategory>
  colors: ComputedRef<PatternColorChoice[]>
  activeColor: Ref<PatternColorFilter>
  filteredPatterns: ComputedRef<readonly Pattern[]>
  count: ComputedRef<number>
  isEmptyState: ComputedRef<boolean>
}

export function usePatternBrowser(options: PatternBrowserOptions = {}): PatternBrowser {
  const {
    patterns = gridPatterns,
    favouriteIds,
    initialCategory = 'all',
    initialColor = 'all',
  } = options

  const activeCategory = ref<PatternCategory>(initialCategory)
  const activeColor = ref<PatternColorFilter>(initialColor)

  // Category narrows first, so a colour pill can report how many it still has to offer.
  const inCategory = computed(() =>
    filterPatterns(patterns, activeCategory.value, favouriteIds?.value ?? []),
  )
  const filteredPatterns = computed(() => filterByColor(inCategory.value, activeColor.value))
  const colors = computed(() => {
    const counts = countByColor(inCategory.value)
    return PATTERN_COLORS.map(option => ({
      ...option,
      count: option.id === 'all' ? inCategory.value.length : counts.get(option.id) ?? 0,
    }))
  })

  return {
    categories: PATTERN_CATEGORIES,
    activeCategory,
    colors,
    activeColor,
    filteredPatterns,
    count: computed(() => filteredPatterns.value.length),
    isEmptyState: computed(() => filteredPatterns.value.length === 0),
  }
}
