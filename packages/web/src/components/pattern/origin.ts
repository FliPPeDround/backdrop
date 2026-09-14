export interface CardOrigin {
  left: number
  top: number
  width: number
  height: number
  borderRadius: number
}

export function readOrigin(el: Element): CardOrigin {
  const rect = el.getBoundingClientRect()
  const radius = Number.parseFloat(getComputedStyle(el).borderRadius)
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    borderRadius: Number.isFinite(radius) ? radius : 16,
  }
}
