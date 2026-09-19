import type { ComputedRef } from 'vue'
import { computed, ref, watch } from 'vue'

/**
 * 258 条图案都带大段内联样式，一次渲染会把小程序的 setData 撑爆，
 * 因此按页追加渲染，切换分类时回到首屏。
 */
export function usePagedPatterns<T>(
  source: ComputedRef<readonly T[]>,
  pageSize = 30,
) {
  const visibleCount = ref(pageSize)

  watch(source, () => {
    visibleCount.value = pageSize
  })

  const visible = computed(() => source.value.slice(0, visibleCount.value))
  const hasMore = computed(() => visibleCount.value < source.value.length)

  function loadMore() {
    if (hasMore.value)
      visibleCount.value += pageSize
  }

  return { visible, hasMore, loadMore }
}
