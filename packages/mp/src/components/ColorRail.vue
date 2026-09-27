<script setup lang="ts">
import type { PatternColorChoice } from '@backdrop/shared'
import { computed, ref, watch } from 'vue'
import { colorPaint } from '@/utils/color-paint'

const props = defineProps<{
  items: readonly PatternColorChoice[]
  active: string
  /** 长按看原图时整条让位 */
  away: boolean
}>()

const emit = defineEmits<{
  change: [id: string]
}>()

/**
 * 等宽槽位：指针位置能直接算出来，不必量节点，也就不怕 setData 的延迟。
 * 槽宽 54rpx × 11 格 = 594rpx，加两侧内衬 618rpx，750rpx 的屏上留得下。
 */
const SLOT = 54
const PAD = 12
/** 屏幕宽度按 750rpx 算：轨道容器横向铺满，胶囊居中，左边距能直接算出来 */
const SCREEN_RPX = 750
/** 胶囊宽度：格子等宽又有内衬，宽度是算出来的，CSS 里也就不用再写一遍 */
const CAPSULE = computed(() => props.items.length * SLOT + PAD * 2)
/**
 * 胶囊在整条带子里的左内衬（带子从左铺满、胶囊居中）。
 * 色点是画在胶囊里的，气泡挂在带子上，两套坐标差的正是这一段 ——
 * 少了它，气泡就会整整偏出一个内衬。
 */
const bandLeft = computed(() => (SCREEN_RPX - CAPSULE.value) / 2)

const activeIndex = computed(() => {
  const found = props.items.findIndex(item => item.id === props.active)
  return found < 0 ? 0 : found
})

function centerOf(index: number) {
  return index * SLOT + SLOT / 2
}

function clampIndex(index: number) {
  return Math.min(Math.max(index, 0), props.items.length - 1)
}

/**
 * 手指位置，单位 rpx，相对胶囊内沿。它是读数气泡的行进依据：拖动时气泡跟着手指走，
 * 写着「松手会落到哪一格」，而画面里的背景一张都不换 —— 拖一次换一次列表
 * 会把 swiper 里正挂着的图案整片换掉，那不是拨盘该有的手感。
 */
const cursorX = ref(centerOf(activeIndex.value))
/** 当前该亮起的那一格：拖动时是手指压着的预览值，平时就是选中的那一格 */
const preview = ref(activeIndex.value)
const dragging = ref(false)
const tipOn = ref(false)

watch(activeIndex, (index) => {
  if (dragging.value)
    return
  cursorX.value = centerOf(index)
  // 选中圈和放大点都挂在 preview 上：只挪气泡不挪它们，圈就会留在上一格
  // （点了页头的色点、或分享链接复位色系时，看着就是「选中效果没居中」）
  preview.value = index
})

let startX = 0
let startCursor = 0
let tipTimer: ReturnType<typeof setTimeout> | undefined

/**
 * 触摸是 px、槽位是 rpx，中间必须过一次换算。
 * 这里不用 uni.upx2px：实测 H5 端它并不等于「一个 rpx 的 px 值」（返回 1），
 * 而 windowWidth / 750 在两端都成立 —— 屏宽就是 750rpx，换算系数由它定义。
 */
const pxPerRpx = uni.getSystemInfoSync().windowWidth / SCREEN_RPX

function point(event: { touches: readonly { clientX: number }[] }) {
  return event.touches[0]
}

/**
 * 手指落点换算成「相对第一格左沿」的 rpx 位置 —— 原点必须是内容区而不是胶囊外沿，
 * 指针、读数、槽位三者共用同一个原点，差着一个内衬（12rpx）就会算错一格的边界。
 * 容器横向铺满、胶囊居中，所以左边距是算出来的，不用 createSelectorQuery 那种异步量取。
 */
function localX(clientX: number) {
  const left = bandLeft.value + PAD
  return (clientX / pxPerRpx) - left
}

function syncPreview() {
  const next = clampIndex(Math.round((cursorX.value - SLOT / 2) / SLOT))
  if (next === preview.value)
    return
  preview.value = next
  // 每过一格震一下：拨盘的段落感。同屏只有一条轨道在震，不会刷成噪音
  uni.vibrateShort()
}

function showTip() {
  clearTimeout(tipTimer)
  tipOn.value = true
}

function onTouchStart(event: { touches: readonly { clientX: number }[] }) {
  const touch = point(event)
  if (!touch || props.items.length < 2)
    return
  const local = localX(touch.clientX)
  dragging.value = true
  startX = touch.clientX
  // 按在胶囊里：指针直接贴到手指下，跟手；按在两侧空白：从当前格起算，按位移走
  if (local >= 0 && local <= props.items.length * SLOT) {
    startCursor = local
    cursorX.value = local
    syncPreview()
  }
  else {
    startCursor = centerOf(activeIndex.value)
    cursorX.value = startCursor
  }
  showTip()
}

function onTouchMove(event: { touches: readonly { clientX: number }[] }) {
  if (!dragging.value)
    return
  const touch = point(event)
  if (!touch)
    return
  const travel = (touch.clientX - startX) / pxPerRpx
  cursorX.value = Math.min(
    Math.max(startCursor + travel, SLOT / 2),
    (props.items.length - 0.5) * SLOT,
  )
  syncPreview()
}

function onTouchEnd() {
  if (!dragging.value)
    return
  dragging.value = false
  commit(preview.value)
}

/**
 * 落定一格：指针交给它（松手回弹由 transition 接着走，和跟手那段是同一条曲线），
 * 顺手把读数亮一下 —— 拖动时它是「松手会到哪」，点按时它是「刚才选了哪个」。
 */
function commit(index: number) {
  preview.value = index
  cursorX.value = centerOf(index)
  const id = props.items[index]?.id
  if (!id)
    return
  showTip()
  clearTimeout(tipTimer)
  tipTimer = setTimeout(() => {
    tipOn.value = false
  }, 1100)
  if (index !== activeIndex.value)
    emit('change', id)
}

/** 读数是「松手会落到哪一格」，所以跟着指针走，而不是跟着已选中的那一格 */
const current = computed(() => props.items[preview.value])
/** 气泡锚点：带子内的内衬 + 指针在胶囊里的位置，正好落在色点中心 */
const tipX = computed(() => bandLeft.value + cursorX.value)
</script>

<template>
  <view
    class="rail"
    :class="{ 'rail--away': away }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <view class="tip" :class="{ 'tip--on': tipOn && !away }" :style="{ transform: `translateX(${tipX}rpx)` }">
      <view class="tip-body">
        <view class="tip-dot" :style="colorPaint(current)" />
        <text class="tip-label">{{ current?.label }}</text>
        <text class="tip-count">{{ current?.count }}</text>
      </view>
    </view>

    <view class="capsule" :style="{ width: `${CAPSULE}rpx` }">
      <view class="dots">
        <view
          v-for="(item, i) in items"
          :key="item.id"
          class="slot"
          :style="{ width: `${SLOT}rpx` }"
          @tap.stop="commit(i)"
        >
          <view
            class="dot"
            :class="[i === preview ? 'dot--focus' : '', item.count === 0 ? 'dot--empty' : '']"
            :style="colorPaint(item)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/*
 * 整条带子横向铺满、内容居中：手指不必先精准点到胶囊上才能起滑。
 * 高度只包住胶囊，指针读数往上飘，所以比胶囊高一点。
 */
.rail {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 58rpx;
  /* 父层整条底部是 pointer-events: none（拇指根部要能起手势），轨道自己把触摸收回来 */
  pointer-events: auto;
  transition: transform 460ms var(--settle), opacity 460ms var(--settle);
  transition-delay: 40ms;
}

.rail--away {
  opacity: 0;
  transform: translateY(90rpx);
}

/*
 * 深色磨砂：色点本身够亮，底只要压住图案的杂讯就够，压重了整条会变成一块黑条。
 * 材质和右侧轨道、dock 是同一份（rgba(28,26,36,·) + blur + 亮顶边），
 * 悬浮控件不该各是各的玻璃。
 */
.capsule {
  position: relative;
  box-sizing: border-box;
  flex: none;
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: rgba(28, 26, 36, 0.24);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.16), 0 6rpx 18rpx rgba(8, 7, 12, 0.16);
  backdrop-filter: blur(16px) saturate(150%);
}

.dots {
  display: flex;
  align-items: center;
}

.slot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44rpx;
}

/*
 * 色点自带一圈暗描边和落影：浅色点（白、黄）落在浅色图案上靠描边分得开，
 * 深色点（棕、紫）落在深色图案上靠自身亮度也读得到，一套材质两种底都成立。
 */
.dot {
  width: 22rpx;
  height: 22rpx;
  border-radius: 999rpx;
  box-shadow: 0 0 0 2rpx rgba(8, 7, 12, 0.28), 0 2rpx 6rpx rgba(8, 7, 12, 0.2);
  transition: box-shadow 320ms var(--spring), opacity 320ms var(--spring);
}

/*
 * 选中 = 色点自己长出一圈：2rpx 描边 + 3rpx 暗缝 + 4rpx 白环，外径 40rpx，
 * 正正好待在 44rpx 的格子里。
 * box-shadow 永远和元素同心 —— 不是让一个圈去「追」格子中心，所以不存在居不居中这件事；
 * 暗缝就是「边框离色点还有一点距离」的那点空隙，白环保证任何色相、任何底色上都读得出来。
 */
.dot--focus {
  box-shadow:
    0 0 0 2rpx rgba(8, 7, 12, 0.32),
    0 0 0 5rpx rgba(20, 18, 26, 0.55),
    0 0 0 9rpx rgba(255, 255, 255, 0.92),
    0 2rpx 10rpx rgba(8, 7, 12, 0.3);
}

/* 这个分类里一个都没有：看得出来，也省得点进去撞一屏空 */
.dot--empty {
  opacity: 0.3;
}

/*
 * 读数挂在指针正上方。左沿 = 带子内衬（inline transform 里的 bandLeft）+ 胶囊内的那个 12rpx，
 * 内层再往回挪半个自身宽度，所以气泡中心永远压在色点中心上，不看气泡自己多宽。
 */
.tip {
  position: absolute;
  top: 0;
  left: 12rpx;
  width: 0;
  opacity: 0;
  transform-origin: 50% 100%;
  transition: opacity 240ms var(--settle);
}

.tip--on {
  opacity: 1;
}

.tip-body {
  position: absolute;
  bottom: 6rpx;
  left: 0;
  display: flex;
  align-items: center;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(22, 20, 28, 0.82);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.18), 0 8rpx 22rpx rgba(8, 7, 12, 0.36);
  transform: translateX(-50%);
  white-space: nowrap;
}

.tip-dot {
  width: 14rpx;
  height: 14rpx;
  margin-right: 10rpx;
  border-radius: 999rpx;
}

.tip-label {
  font-size: 23rpx;
  font-weight: 600;
  letter-spacing: 0.2rpx;
  color: #fff;
}

.tip-count {
  margin-left: 10rpx;
  font-size: 21rpx;
  font-variant-numeric: tabular-nums;
  color: var(--ink-3);
}

@media (prefers-reduced-motion: reduce) {
  .rail,
  .dot {
    transition: none;
  }
}

/* 要求降低透明度时收成实色：这层材质全靠 backdrop-filter 撑着 */
@media (prefers-reduced-transparency: reduce) {
  .capsule {
    background: rgba(20, 18, 26, 0.82);
    backdrop-filter: none;
  }
}
</style>
