import type { Pattern } from '@backdrop/data'

export type ShareFeedback = 'idle' | 'shared' | 'copied' | 'failed'

const FEEDBACK_MS = 1800

/** 站内深链（?pattern=<id>），与 MCP 搜索结果里给出的 url 保持一致 */
export function patternShareUrl(id: string) {
  const url = new URL(window.location.href)
  url.hash = ''
  url.searchParams.set('pattern', id)
  return url.toString()
}

export function patternShareData(pattern: Pattern): ShareData {
  return {
    title: `${pattern.name} · Backdrop`,
    text: pattern.description?.trim() || `${pattern.name} · 小程序背景图案与配套代码`,
    url: patternShareUrl(pattern.id),
  }
}

/**
 * 优先调系统分享面板（移动端、Safari、macOS Chrome 都支持），
 * 不支持时退回复制链接，两种情况都给一次短暂的状态反馈。
 */
export function usePatternShare() {
  const feedback = ref<ShareFeedback>('idle')
  const { copy, copied } = useClipboard({ copiedDuring: FEEDBACK_MS })

  let feedbackTimer: ReturnType<typeof setTimeout> | undefined

  function flash(next: ShareFeedback) {
    feedback.value = next
    clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => {
      feedback.value = 'idle'
    }, FEEDBACK_MS)
  }

  onScopeDispose(() => clearTimeout(feedbackTimer))

  async function sharePattern(pattern: Pattern) {
    const data = patternShareData(pattern)
    const url = patternShareUrl(pattern.id)
    const canNativeShare
      = typeof navigator !== 'undefined'
        && typeof navigator.share === 'function'
        && (!navigator.canShare || navigator.canShare(data))

    if (canNativeShare) {
      try {
        await navigator.share(data)
        flash('shared')
        return
      }
      catch (error) {
        // 用户在系统面板里取消：不算失败，也不用再复制一遍
        if (error instanceof DOMException && error.name === 'AbortError')
          return
      }
    }

    await copy(url)
    flash(copied.value ? 'copied' : 'failed')
  }

  return { feedback, sharePattern }
}
