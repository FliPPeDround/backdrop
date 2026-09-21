import type { Ref } from 'vue'

export interface ProgressiveRevealOptions {
  /** 首屏先挂载多少条 */
  initial?: number
  /** 每次流式追加的条数 */
  batch?: number
  /** 距离视口底部多少像素时开始追加下一批 */
  prefetch?: number
}

/**
 * 把大列表按视口分批流式挂载，避免低端设备一次性渲染整页。
 * 配合每项的入场动画，形成渐进「流入」的效果。
 */
export function useProgressiveReveal<T>(
  source: Ref<readonly T[]>,
  options: ProgressiveRevealOptions = {},
) {
  const { initial = 12, batch = 12, prefetch = 500 } = options

  const visibleCount = ref(initial)
  const sentinel = shallowRef<HTMLElement | null>(null)
  let frame: number | null = null

  // 作为函数 ref 绑定到哨兵元素：Vue 挂载传元素、卸载传 null
  const setSentinel = (el: unknown) => {
    sentinel.value = el instanceof HTMLElement ? el : null
  }

  const visible = computed(() => source.value.slice(0, visibleCount.value))
  const hasMore = computed(() => visibleCount.value < source.value.length)
  const total = computed(() => source.value.length)

  function pump() {
    frame = null
    if (!hasMore.value || !sentinel.value)
      return
    if (sentinel.value.getBoundingClientRect().top > window.innerHeight + prefetch)
      return
    visibleCount.value = Math.min(visibleCount.value + batch, source.value.length)
    // 等 DOM 撑开后再判断：若仍在预取区，下一帧继续流式追加
    nextTick(() => {
      if (hasMore.value)
        frame = requestAnimationFrame(pump)
    })
  }

  function schedule() {
    frame ??= requestAnimationFrame(pump)
  }

  function reset() {
    visibleCount.value = initial
    schedule()
  }

  // 来源变化即新的筛选结果（切分类 / 收藏增减），从头开始流式加载
  watch(() => source.value.length, reset)
  useEventListener(window, 'scroll', schedule, { passive: true })
  useEventListener(window, 'resize', schedule, { passive: true })
  onMounted(schedule)
  onScopeDispose(() => {
    if (frame != null)
      cancelAnimationFrame(frame)
  })

  return { visible, visibleCount, hasMore, total, setSentinel, schedule, reset }
}
