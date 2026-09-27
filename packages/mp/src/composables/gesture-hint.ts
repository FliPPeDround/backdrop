import { ref } from 'vue'

/**
 * 首次进来的手势提示：这一屏有三个手势，其中两个不看一眼猜不到。
 *
 * 存的是提示文案本身而不是一个 true：以后文案改了，老用户会重新被教一次，
 * 不用再维护一个版本号。做过任意一个手势就永久退场 —— 提示是给第一次的，
 * 第二次还挂在屏幕上就变成噪音了。
 */
const STORAGE_KEY = 'backdrop-gesture-hint'
const HINT_TEXT = '上下翻页 · 长按看原图 · 左右滑动筛选'

export function useGestureHint() {
  const visible = ref(uni.getStorageSync(STORAGE_KEY) !== HINT_TEXT)

  function dismiss() {
    if (!visible.value)
      return
    visible.value = false
    uni.setStorageSync(STORAGE_KEY, HINT_TEXT)
  }

  return { visible, dismiss, text: HINT_TEXT }
}
