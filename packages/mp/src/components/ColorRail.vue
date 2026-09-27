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
 * 指针（白圈）位置，单位 rpx，相对胶囊内沿。选中格由 active 决定，指针由手指决定：
 * 拖动时两者分开，读数写着「松手会落到哪一格」，画面里的背景一张都不换——
 * 拖一次换一次列表会把 swiper 里正挂着的图案整片换掉，那不是拨盘该有的手感。
 */
const cursorX = ref(centerOf(activeIndex.value))
/** 指针当前压住的格子（拖动中的预览值，未提交） */
const preview = ref(activeIndex.value)
const dragging = ref(false)
const tipOn = ref(false)

watch(activeIndex, (index) => {
  if (!dragging.value)
    cursorX.value = centerOf(index)
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
  const left = (SCREEN_RPX - CAPSULE.value) / 2 + PAD
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
    <view class="tip" :class="{ 'tip--on': tipOn && !away }" :style="{ transform: `translateX(${cursorX}rpx)` }">
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
      <!-- 白圈压在色点之上：色相千变万化，只有中性色能在任何一格上读得出来 -->
      <view
        class="cursor"
        :class="{ 'cursor--drag': dragging }"
        :style="{ transform: `translateX(${cursorX - SLOT / 2}rpx)` }"
      />
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
  transition: transform 320ms var(--spring), opacity 320ms var(--spring);
  will-change: transform;
}

.dot--focus {
  transform: scale(1.42);
}

/* 这个分类里一个都没有：看得出来，也省得点进去撞一屏空 */
.dot--empty {
  opacity: 0.3;
}

.cursor {
  position: absolute;
  top: 6rpx;
  left: 12rpx;
  width: 54rpx;
  height: 44rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.86);
  border-radius: 999rpx;
  /* 白圈外面再压一圈暗边：浅色图案上胶囊自己也发白，只靠白圈会糊在一起 */
  box-shadow: 0 0 0 3rpx rgba(8, 7, 12, 0.26), 0 2rpx 10rpx rgba(8, 7, 12, 0.3);
  transition: transform 420ms var(--spring);
  will-change: transform;
}

/* 跟手那一段必须一帧不落地贴住手指：过渡会让指针滑在手指后面 */
.cursor--drag {
  transition: none;
}

/* 读数挂在指针正上方：左沿对齐指针，内层再往回挪一半宽度，不看胶囊宽度脸色 */
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
  .dot,
  .cursor {
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
