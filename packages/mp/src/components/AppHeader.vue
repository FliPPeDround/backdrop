<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  /** 脚下这张自己的类别，不是筛选器 —— 它是内容的属性，像展签上的那一行 */
  category: string
  name: string
  /** 正在退场的上一条名字，和新名字叠在同一个遮罩里交接 */
  leavingName: string | null
  /**
   * 1 = 往前翻（内容往上走），-1 = 往后退，0 = 没有方向（筛选落位、随机跳）。
   * 0 也按「往前」交接：两条标题原地交叉淡入会在中段叠成一团糊字，
   * 位移在这里是必要的，方向是不是真的没人看得出来 —— 叠在一起倒是看得一清二楚。
   */
  dir: number
  /** 当前筛选结果里的第几张（1 基）与总数 */
  position: number
  /** 脚下这张在不在这批筛选结果里：不在就给一根横线，不硬写 0 */
  inFilter: boolean
  total: number
  colors: readonly { id: string, label: string, swatch: string }[]
  /** 正在生效的颜色筛选，null = 全部 */
  filterLabel: string | null
  /** 首次进来的手势提示，做过任意一个手势之后永久退场 */
  hint: string | null
  /** 每翻一页换一个值：fine hairline 上的那道扫光靠它重播 */
  turn: number
  /** 长按看原图时整块让位 */
  away: boolean
}>()

const emit = defineEmits<{
  filterColor: [id: string]
}>()

interface CapsuleRect {
  top: number
  left: number
  width: number
  height: number
}

/**
 * 右上角胶囊的位置。小程序自己的那颗按钮不在我们的布局里，
 * 但它挡住了顶栏最右边那一块：顶栏对齐、右侧让位都得按它算。
 * H5 预览和拿不到的系统上退回一份典型值 —— 页面是按手机画的，
 * 预览和真机看起来就该是同一套版。
 */
function readCapsule(sys: { statusBarHeight?: number, windowWidth: number }): CapsuleRect {
  try {
    const rect = uni.getMenuButtonBoundingClientRect?.()
    if (rect?.top && rect.left && rect.width && rect.height)
      return rect
  }
  catch {}
  return { top: (sys.statusBarHeight ?? 0) + 8, left: sys.windowWidth - 95, width: 87, height: 32 }
}

/**
 * 顶栏几何：品牌行与胶囊同高、同一条中线，看起来才像这根导航条本来就在那儿。
 * 手机不转屏，所以这些是常量，算一次就够 —— 不必每次渲染都问一遍系统。
 * 这一行现在只有标形和字标，右侧不再有会伸到胶囊底下的东西，也就不用再让位。
 */
const system = uni.getSystemInfoSync()
const capsule = readCapsule(system)
const nav = {
  /** 整块标题区的起点：胶囊上沿 = 状态栏 + 胶囊上下的对称间隙 */
  top: capsule.top,
  height: capsule.height,
}

/** 提示退场时文字不能立刻消失，否则那 300ms 里只是一个空盒子在淡出 */
const shownHint = ref(props.hint)
watch(() => props.hint, (next) => {
  if (next)
    shownHint.value = next
})

/**
 * 动画要重播，就得是另一个动画名 —— 同名动画在微信端不重播，而独立节点的 key
 * 会不会重建元素也没有保证（右侧位置轨就吃过这个亏，那里是靠两条同形动画轮换来绕开的）。
 * 这里同样按 turn 的奇偶备两份：连续往同一个方向翻十页，每一页都还是从零起播。
 * turn = 0 是首帧，落在 b 组，顺带让第一次进场也有一次动画。
 */
const phase = computed(() => (props.turn % 2 ? 'a' : 'b'))
const enterClass = computed(() => `head-in-${props.dir < 0 ? 'down' : 'up'}-${phase.value}`)
const leaveClass = computed(() => `head-out-${props.dir < 0 ? 'down' : 'up'}-${phase.value}`)
const sweepClass = computed(() => `rule-sweep--${phase.value}`)
</script>

<template>
  <view class="head" :class="{ 'head--away': away }" :style="{ paddingTop: `${nav.top}px` }">
    <view class="brand" :style="{ height: `${nav.height}px` }">
      <BrandMark />
      <text class="wordmark">Backdrop</text>
    </view>

    <view class="rule">
      <view class="rule-line" />
      <view class="rule-sweep" :class="sweepClass" />
    </view>

    <view class="meta">
      <view class="meta-tick" />
      <text class="meta-cat">{{ category }}</text>
      <text v-if="filterLabel" class="meta-sep">·</text>
      <text v-if="filterLabel" class="meta-filter">{{ filterLabel }}</text>
      <text class="meta-sep">·</text>
      <view class="meta-num">
        <text v-if="!inFilter" class="meta-dash">—</text>
        <RollingNumber v-else :value="position" :digits="3" :size="23" />
        <text class="meta-slash">/</text>
        <RollingNumber :value="total" :digits="3" :size="23" />
      </view>
    </view>

    <!--
      标题进出走同一个遮罩：旧名往上退出框外、新名从框下顶上来。
      位移按自身高度的百分比算，两行三行的长名字也一样是从头开始露，
      不会像固定 26rpx 那样只把字往上挪一点、看着像抖了一下。
    -->
    <view class="title-mask">
      <view
        v-if="leavingName"
        :key="`out-${leavingName}`"
        class="title title--leave"
        :class="leaveClass"
      >
        <text>{{ leavingName }}</text>
      </view>
      <view class="title" :class="enterClass">
        <text>{{ name }}</text>
      </view>
    </view>

    <view v-if="colors.length" class="colors">
      <view
        v-for="color in colors"
        :key="color.id"
        class="color press"
        hover-class="press--on"
        :hover-stay-time="60"
        @tap.stop="emit('filterColor', color.id)"
      >
        <view class="color-dot" :style="{ background: color.swatch }" />
        <text class="color-label">{{ color.label }}</text>
      </view>
    </view>

    <view class="hint" :class="{ 'hint--on': hint }">
      <view class="hint-dot" />
      <text class="hint-text">{{ shownHint }}</text>
    </view>
  </view>
</template>

<style scoped>
/*
 * 整块是读数，不吃触摸：背景上的长按、双击要能从这一片穿下去。
 * 只有收藏读数和色点自己把触摸收回来。
 */
.head {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  /* 顶部的下移量由 inline paddingTop 给（要按胶囊算），这里只管左右 */
  padding: 0 36rpx;
  pointer-events: none;
  transition: transform 460ms var(--settle), opacity 460ms var(--settle);
  will-change: transform, opacity;
}

.head--away {
  opacity: 0;
  transform: translateY(-36rpx);
}

.brand {
  display: flex;
  align-items: center;
}

/*
 * 字标压着标形走：字号取到 32rpx 而不是跟着标形等比放大，
 * 标形是身份、字标是名字，两者等高反而像两个图标并排。
 */
.wordmark {
  font-size: 32rpx;
  font-weight: 600;
  letter-spacing: 0.2rpx;
  color: #fff;
  text-shadow: 0 1rpx 8rpx rgba(8, 7, 12, 0.45);
}

.rule {
  position: relative;
  /*
   * 带子比发丝线高，是因为扫光要有地方发光。
   * 上一版把 4rpx 的光塞进 2rpx 的 overflow 里裁 —— 开发工具的 Chromium 还能看见
   * 那一两个像素，真机（WKWebView / XWeb）的亚像素裁剪常常把它整个吃掉，
   * 表现就是「开发工具有动画、真机没有」。现在不裁：整条带子就是光要走的路。
   * 下边距是负的：21 + 12 - 5 = 28rpx，和原来「26 边距 + 2 高的线」占的那一格完全一样，
   * 发丝线的位置和下面读数行的位置都一点没动。
   */
  height: 12rpx;
  margin-top: 21rpx;
  margin-bottom: -5rpx;
}

/* 发丝线：2rpx 在 2 倍屏上正好一个物理像素，1rpx 会渲染成半像素、细到看不见 */
.rule-line {
  position: absolute;
  top: 5rpx;
  right: 0;
  left: 0;
  height: 2rpx;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.08) 62%, rgba(255, 255, 255, 0) 100%);
}

/*
 * 换页时一道光沿细线走一遍：眼睛在标题上，这一下负责把「内容变了」说在全屏之外。
 * 位移走 transform，不碰 left，细线上的光不该引起重排。
 */
.rule-sweep {
  position: absolute;
  top: 0;
  left: 0;
  width: 200rpx;
  height: 12rpx;
  /* 一团纵向的晕，不是一条硬边：屏幕上不会出现「差一个像素就整条消失」 */
  background: radial-gradient(closest-side, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0));
}

.rule-sweep--a {
  animation: rule-sweep-a 900ms var(--settle) both;
}

.rule-sweep--b {
  animation: rule-sweep-b 900ms var(--settle) both;
}

@keyframes rule-sweep-a {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  30% {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateX(460%);
  }
}

@keyframes rule-sweep-b {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  30% {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateX(460%);
  }
}

/*
 * 读数行：类别是内容的属性，编号是位置。中间那根短横是行首的行标，
 * 有了它这一行才像展签的第一行，而不是随便一串灰字。
 */
.meta {
  display: flex;
  align-items: center;
  margin-top: 28rpx;
  font-size: 23rpx;
  letter-spacing: 0.6rpx;
  color: var(--ink-2);
  text-shadow: 0 1rpx 6rpx rgba(8, 7, 12, 0.5);
}

.meta-tick {
  /* 一根竖线当行标，不用短横：同一行里已经有一个「/」和一个可能出现的「—」，
     再来一根横的就分不清谁是谁了 */
  width: 2rpx;
  height: 22rpx;
  margin-right: 14rpx;
  background: rgba(255, 255, 255, 0.42);
}

.meta-cat {
  font-weight: 600;
}

.meta-filter {
  color: rgba(255, 255, 255, 0.92);
}

.meta-sep {
  margin: 0 10rpx;
  color: var(--ink-3);
}

.meta-num {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.92);
}

.meta-slash {
  margin: 0 3rpx;
  color: var(--ink-3);
}

/* 横线要占一个数字的宽度，否则后面的斜杠会跟着横线一起左右跳 */
.meta-dash {
  width: 43rpx;
  font-size: 23rpx;
  text-align: center;
  color: var(--ink-3);
}

/*
 * 遮罩只留出降部的余量（0.16em）并用负 margin 收回去，不然 g、y 这些字母的下缘会被切平。
 * 右侧多留 44rpx：名字再长也不去碰右边那条位置轨。
 */
.title-mask {
  position: relative;
  overflow: hidden;
  margin-top: 16rpx;
  margin-bottom: -0.16em;
  padding-right: 44rpx;
  padding-bottom: 0.16em;
  font-size: 62rpx;
}

.title {
  font-weight: 700;
  line-height: 1.14;
  letter-spacing: -1.2rpx;
  color: #fff;
  text-shadow: 0 2rpx 16rpx rgba(8, 7, 12, 0.32);
}

.title--leave {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

/* 进场 560ms：位移走满一整个字高，长名字也从头露出来，不是往上挪一点抖一下 */
.head-in-up-a {
  animation: head-in-up-a 560ms var(--settle) both;
}

.head-in-up-b {
  animation: head-in-up-b 560ms var(--settle) both;
}

.head-in-down-a {
  animation: head-in-down-a 560ms var(--settle) both;
}

.head-in-down-b {
  animation: head-in-down-b 560ms var(--settle) both;
}

/* 退场 360ms，比入场短：离开的那一层不该抢新内容的注意力，两层必须同时动才读得出是交接 */
.head-out-up-a {
  animation: head-out-up-a 360ms var(--press) both;
}

.head-out-up-b {
  animation: head-out-up-b 360ms var(--press) both;
}

.head-out-down-a {
  animation: head-out-down-a 360ms var(--press) both;
}

.head-out-down-b {
  animation: head-out-down-b 360ms var(--press) both;
}

@keyframes head-in-up-a {
  from {
    transform: translateY(108%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes head-in-up-b {
  from {
    transform: translateY(108%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes head-in-down-a {
  from {
    transform: translateY(-108%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes head-in-down-b {
  from {
    transform: translateY(-108%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes head-out-up-a {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-108%);
  }
}

@keyframes head-out-up-b {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-108%);
  }
}

@keyframes head-out-down-a {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(108%);
  }
}

@keyframes head-out-down-b {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(108%);
  }
}

/* 只在减少动效时用：不做位移，但仍要说清换了内容 */
@keyframes head-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes head-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/*
 * 色点：这张图案用了哪几个色系。点一下就是这个色系的筛选 ——
 * 从「这张里有蓝」到「给我看蓝的」之间不该隔着一次开面板。
 */
.colors {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
}

.color {
  display: flex;
  align-items: center;
  margin-right: 24rpx;
  padding: 8rpx 0;
  pointer-events: auto;
}

.color-dot {
  width: 15rpx;
  height: 15rpx;
  margin-right: 9rpx;
  border-radius: 999rpx;
  box-shadow: 0 0 0 2rpx rgba(8, 7, 12, 0.32);
}

.color-label {
  font-size: 23rpx;
  letter-spacing: 0.4rpx;
  color: var(--ink-2);
  text-shadow: 0 1rpx 6rpx rgba(8, 7, 12, 0.5);
}

/*
 * 首次进来的手势提示：两句话撑不住就没人读，所以只说这一屏最不容易猜到的那一个。
 * 常驻的是空的，只有还没做过手势时才把这一行立起来，退场靠高度和透明度一起收。
 */
.hint {
  display: flex;
  align-items: center;
  height: 0;
  margin-top: 0;
  opacity: 0;
  overflow: hidden;
  transform: translateY(-8rpx);
  transition: height 420ms var(--settle), margin-top 420ms var(--settle), opacity 320ms var(--settle), transform 420ms var(--settle);
}

.hint--on {
  height: 34rpx;
  margin-top: 24rpx;
  opacity: 1;
  transform: translateY(0);
}

.hint-dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 12rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.62);
  animation: hint-pulse 2200ms ease-in-out infinite;
}

@keyframes hint-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.7);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.hint-text {
  font-size: 22rpx;
  letter-spacing: 0.4rpx;
  color: var(--ink-2);
  text-shadow: 0 1rpx 6rpx rgba(8, 7, 12, 0.5);
}

@media (prefers-reduced-motion: reduce) {
  .head {
    transition: none;
  }

  .rule-sweep--a,
  .rule-sweep--b {
    animation: none;
    opacity: 0;
  }

  .hint-dot {
    animation: none;
  }

  /* 不做位移，但仍要交代换了内容：位移换成交叉淡入淡出 */
  .head-in-up-a,
  .head-in-up-b,
  .head-in-down-a,
  .head-in-down-b {
    animation: head-fade-in 220ms ease both;
  }

  .head-out-up-a,
  .head-out-up-b,
  .head-out-down-a,
  .head-out-down-b {
    animation: head-fade-out 160ms ease both;
  }
}
</style>
