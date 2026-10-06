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
  openAbout: []
  /** 起手落在标形上：让页面上那层手势仲裁别把这次触摸算成「长按看原图」 */
  lockupTouch: []
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
 *
 * 类名必须写成完整字面量：UnoCSS 是扫源码文本的，拼出来的字符串它扫不到。
 */
const ENTER = {
  up: ['animate-head-in-up-a', 'animate-head-in-up-b'],
  down: ['animate-head-in-down-a', 'animate-head-in-down-b'],
} as const
const LEAVE = {
  up: ['animate-head-out-up-a', 'animate-head-out-up-b'],
  down: ['animate-head-out-down-a', 'animate-head-out-down-b'],
} as const
const SWEEP = ['animate-rule-sweep-a', 'animate-rule-sweep-b'] as const

/** turn 奇数用 a，偶数（含首帧）用 b */
const phase = computed(() => (props.turn % 2 ? 0 : 1))

/* 降动效时不做位移，但仍要交代换了内容：位移换成交叉淡入淡出 */
const enterClass = computed(
  () => `${ENTER[props.dir < 0 ? 'down' : 'up'][phase.value]} motion-reduce:animate-head-fade-in`,
)
const leaveClass = computed(
  () => `${LEAVE[props.dir < 0 ? 'down' : 'up'][phase.value]} motion-reduce:animate-head-fade-out`,
)
const sweepClass = computed(
  () => `${SWEEP[phase.value]} motion-reduce:animate-none motion-reduce:opacity-0`,
)
</script>

<template>
  <!--
    整块是读数，不吃触摸：背景上的长按、双击要能从这一片穿下去。
    只有收藏读数和色点自己把触摸收回来。
    顶部的下移量由 inline paddingTop 给（要按胶囊算），这里只管左右。
  -->
  <view
    class="absolute top-0 right-0 left-0 z-2 px-[36rpx] pointer-events-none
      [transition:transform_460ms_var(--settle),opacity_460ms_var(--settle)]
      will-change-transform,opacity motion-reduce:transition-none"
    :class="away ? 'on:opacity-0 on:-translate-y-[36rpx]' : ''"
    :style="{ paddingTop: `${nav.top}px` }"
  >
    <view class="flex items-center" :style="{ height: `${nav.height}px` }">
      <!--
        标形加字标就是这个小程序自己的身份，点它进「关于」：
        项目叫什么、谁做的、代码在哪，最该待的地方就是项目自己的名字底下。
        负外边距把内衬吃掉 —— 命中区往外长一圈（这一行只有 32px 高，拇指够不着），版式一格不动。

        触摸只能 bind，不能 catch：catchtouchstart 会让微信认定这次触摸被「吃掉」，
        同一节点上的 tap 就不再派发 —— 表现就是点了没反应。这一块又确实是按钮、
        不该跟着长按去看原图，所以这里只上报一句「起手在我这儿」，
        由页面上那层手势仲裁让开（见 index.vue 的 lockupDown）。
      -->
      <view
        class="flex items-center -ml-[16rpx] px-[16rpx] py-[16rpx] rounded-[16rpx] pointer-events-auto press"
        :class="away ? 'on:pointer-events-none' : ''"
        hover-class="press--on"
        :hover-stay-time="60"
        @touchstart="emit('lockupTouch')"
        @tap.stop="emit('openAbout')"
      >
        <BrandMark />
        <!--
          字标压着标形走：字号取到 32rpx 而不是跟着标形等比放大，
          标形是身份、字标是名字，两者等高反而像两个图标并排。
        -->
        <text class="text-[32rpx] font-600 tracking-[0.2rpx] text-white text-shadow-[0_1rpx_8rpx_rgba(8,7,12,0.55)]">Backdrop</text>
        <!-- 一枚很轻的指示：这里进得去，别让人猜。压暗跟着字标，不抢名字 -->
        <view class="i-carbon-chevron-right ml-[10rpx] text-[22rpx] text-[rgba(255,255,255,0.42)]" />
      </view>
    </view>

    <!--
      带子比发丝线高，是因为扫光要有地方发光。上一版把 4rpx 的光塞进 2rpx 的 overflow 里裁，
      真机（WKWebView / XWeb）的亚像素裁剪常常把它整个吃掉，表现就是「开发工具有动画、真机没有」。
      现在不裁：整条带子就是光要走的路。
      下边距是负的：21 + 12 - 5 = 28rpx，和原来「26 边距 + 2 高的线」占的那一格完全一样。
    -->
    <view class="relative h-[12rpx] mt-[21rpx] -mb-[5rpx]">
      <!-- 发丝线：2rpx 在 2 倍屏上正好一个物理像素，1rpx 会渲染成半像素、细到看不见 -->
      <view
        class="absolute top-[5rpx] right-0 left-0 h-[2rpx]
          bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.08)_62%,rgba(255,255,255,0)_100%)]"
      />
      <!--
        换页时一道光沿细线走一遍：眼睛在标题上，这一下负责把「内容变了」说在全屏之外。
        位移走 transform，不碰 left，细线上的光不该引起重排。
      -->
      <view
        class="absolute top-0 left-0 w-[200rpx] h-[12rpx]
          bg-[radial-gradient(closest-side,rgba(255,255,255,0.92),rgba(255,255,255,0))]"
        :class="sweepClass"
      />
    </view>

    <!--
      读数行：类别是内容的属性，编号是位置。中间那根短横是行首的行标，
      有了它这一行才像展签的第一行，而不是随便一串灰字。
    -->
    <view class="flex items-center mt-[28rpx] text-[23rpx] tracking-[0.6rpx] text-ink-2 text-shadow-[0_1rpx_6rpx_rgba(8,7,12,0.6)]">
      <!-- 一根竖线当行标，不用短横：同一行里已经有一个「/」和一个可能出现的「—」 -->
      <view class="w-[2rpx] h-[22rpx] mr-[14rpx] bg-[rgba(255,255,255,0.42)]" />
      <text class="font-600">{{ category }}</text>
      <text v-if="filterLabel" class="mx-[10rpx] text-ink-3">·</text>
      <text v-if="filterLabel" class="text-[rgba(255,255,255,0.92)]">{{ filterLabel }}</text>
      <text class="mx-[10rpx] text-ink-3">·</text>
      <view class="flex items-center text-[rgba(255,255,255,0.92)]">
        <!-- 横线要占一个数字的宽度，否则后面的斜杠会跟着横线一起左右跳 -->
        <text v-if="!inFilter" class="w-[43rpx] text-[23rpx] text-center text-ink-3">—</text>
        <RollingNumber v-else :value="position" :digits="3" :size="23" />
        <text class="mx-[3rpx] text-ink-3">/</text>
        <RollingNumber :value="total" :digits="3" :size="23" />
      </view>
    </view>

    <!--
      标题进出走同一个遮罩：旧名往上退出框外、新名从框下顶上来。
      位移按自身高度的百分比算，两行三行的长名字也一样是从头开始露，
      不会像固定 26rpx 那样只把字往上挪一点、看着像抖了一下。
      遮罩只留出降部的余量（0.16em）并用负 margin 收回去，不然 g、y 这些字母的下缘会被切平。
      右侧多留 44rpx：名字再长也不去碰右边那条位置轨。
    -->
    <view class="relative overflow-hidden mt-[16rpx] -mb-[0.16em] pr-[44rpx] pb-[0.16em] text-[62rpx]">
      <view
        v-if="leavingName"
        :key="`out-${leavingName}`"
        class="absolute top-0 right-0 left-0 font-700 leading-[1.14] tracking-[-1.2rpx] text-white
          text-shadow-[0_2rpx_16rpx_rgba(8,7,12,0.42)]"
        :class="leaveClass"
      >
        <text>{{ leavingName }}</text>
      </view>
      <!-- 进场 560ms、退场 360ms：离开的那一层不该抢新内容的注意力，两层必须同时动才读得出是交接 -->
      <view
        class="font-700 leading-[1.14] tracking-[-1.2rpx] text-white
          text-shadow-[0_2rpx_16rpx_rgba(8,7,12,0.42)]"
        :class="enterClass"
      >
        <text>{{ name }}</text>
      </view>
    </view>

    <!--
      色点：这张图案用了哪几个色系。点一下就是这个色系的筛选 ——
      从「这张里有蓝」到「给我看蓝的」之间不该隔着一次开面板。
    -->
    <view v-if="colors.length" class="flex items-center mt-[30rpx]">
      <view
        v-for="color in colors"
        :key="color.id"
        class="flex items-center mr-[24rpx] py-[8rpx] pointer-events-auto press"
        hover-class="press--on"
        :hover-stay-time="60"
        @tap.stop="emit('filterColor', color.id)"
      >
        <view
          class="w-[15rpx] h-[15rpx] mr-[9rpx] rounded-full shadow-[0_0_0_2rpx_rgba(8,7,12,0.32)]"
          :style="{ background: color.swatch }"
        />
        <text class="text-[23rpx] tracking-[0.4rpx] text-ink-2 text-shadow-[0_1rpx_6rpx_rgba(8,7,12,0.6)]">{{ color.label }}</text>
      </view>
    </view>

    <!--
      首次进来的手势提示：两句话撑不住就没人读，所以只说这一屏最不容易猜到的那一个。
      常驻的是空的，只有还没做过手势时才把这一行立起来，退场靠高度和透明度一起收。
    -->
    <view
      class="flex items-center h-0 mt-0 opacity-0 overflow-hidden -translate-y-[8rpx]
        [transition:height_420ms_var(--settle),margin-top_420ms_var(--settle),opacity_320ms_var(--settle),transform_420ms_var(--settle)]"
      :class="hint ? 'on:h-[34rpx] on:mt-[24rpx] on:opacity-100 on:translate-y-0' : ''"
    >
      <view
        class="w-[12rpx] h-[12rpx] mr-[12rpx] rounded-full bg-[rgba(255,255,255,0.62)]
          animate-hint-pulse motion-reduce:animate-none"
      />
      <text class="text-[22rpx] tracking-[0.4rpx] text-ink-2 text-shadow-[0_1rpx_6rpx_rgba(8,7,12,0.6)]">{{ shownHint }}</text>
    </view>
  </view>
</template>
