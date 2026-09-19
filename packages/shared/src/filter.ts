import type { Pattern } from '@backdrop/data'
import type { PatternCategory } from './categories'

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
