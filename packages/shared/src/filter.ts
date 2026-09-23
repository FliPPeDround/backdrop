import type { Pattern, PatternColor } from '@backdrop/data'
import type { PatternCategory } from './categories'
import type { PatternColorFilter } from './colors'

export function filterPatterns(
  patterns: readonly Pattern[],
  category: PatternCategory,
  favouriteIds: readonly string[] = [],
): readonly Pattern[] {
  if (category === 'all')
    return patterns
  if (category === 'favourites')
    return patterns.filter(pattern => favouriteIds.includes(pattern.id))
  return patterns.filter(pattern => pattern.category === category)
}

/**
 * The second axis: a pattern carries every colour its CSS paints with, so 蓝 matches a
 * blue-on-white radial as well as an all-blue one.
 */
export function filterByColor(
  patterns: readonly Pattern[],
  color: PatternColorFilter,
): readonly Pattern[] {
  if (color === 'all')
    return patterns
  return patterns.filter(pattern => pattern.color.includes(color))
}

export function countByColor(patterns: readonly Pattern[]): Map<PatternColor, number> {
  const counts = new Map<PatternColor, number>()
  for (const pattern of patterns) {
    for (const color of pattern.color)
      counts.set(color, (counts.get(color) ?? 0) + 1)
  }
  return counts
}
