<script setup lang="ts">
import type { Pattern } from '@backdrop/data'
import { gridPatterns } from '@backdrop/data'
import { PATTERN_CATEGORIES, usePatternBrowser } from '@backdrop/shared'
import { onBackPress } from '@dcloudio/uni-app'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import ColorRail from '@/components/ColorRail.vue'
import { useFavourites } from '@/composables/favourites'
import { useGestureHint } from '@/composables/gesture-hint'
import { usePagedPatterns } from '@/composables/paged'

definePage({
  style: {
    navigationBarTitleText: 'Backdrop',
    navigationStyle: 'custom',
  },
})

/** 程序化跳到相邻页时的滑动时长；手势跟手和一屏一屏的落点由原生 swiper 自己管 */
const SWIPE_MS = 480
/** 旧标题的退场时长，比入场短：离开的那一层不该抢新内容的注意力 */
const LEAVE_MS = 380
/** 按住多久算「看原图」：更短的停顿只可能是想滑动，滑动不该被这层吃掉 */
const HOLD_MS = 260
/** 手指出格多少 px 之后就不算长按/点击，交还给 swiper 去翻页 */
const TOUCH_SLOP = 10
/** 双击间隔上限：超过这个间隔就是两次独立的单击 */
const DOUBLE_TAP_MS = 320

const { ids, isFavourite, toggleFavourite } = useFavourites()
const { categories, colors, activeCategory, activeColor, filteredPatterns, count, isEmptyState }
  = usePatternBrowser({ favouriteIds: ids })
const { visible, hasMore, loadMore } = usePagedPatterns(filteredPatterns, 24)
const { visible: hintVisible, dismiss: dismissHint, text: gestureHintText } = useGestureHint()

// 列表是循环的，没有「第一张」可回，每次进来落在随机一张更像在翻牌
const start = Math.floor(Math.random() * filteredPatterns.value.length)
const index = ref(start)
/** 只有「挂载时正好是当前页」的那一层才播合焦，手势切页不再叠第二次动画 */
const armed = ref(start)
/** 合焦还是重掷：随机跳是断开的一次落位，动画该读作「换了一张」而不是「翻了一页」 */
const entry = ref<'focus' | 'shuffle'>('focus')
// 首帧必须 0ms 落到随机页：从 0 滑过去要穿过一整片没挂载的空位
const duration = ref(0)
/** 1 = 往前翻（内容往上走），-1 = 往后退，0 = 没有方向（筛选落位、随机跳） */
const dir = ref(1)
/** 轨道每翻一页换一个值：换奇偶就是换 animation-name，滚一格才不会被「同名动画」吞掉 */
const railTurn = ref(0)
/**
 * 标题交接的次数，和 railTurn 分开记：随机跳、筛选落位这些「画面没往哪边滚」的情况
 * 不动轨道，但标题确实换了名字，它那一进一退的动画得照常重播。
 */
const headTurn = ref(0)
// 筛选结果可能为空（收藏分类最常撞上），这时停在脚下这张而不是整屏空白
const shown = ref<Pattern>(filteredPatterns.value[start] ?? gridPatterns[0]!)
const leaving = ref<Pattern | null>(null)
let leaveTimer: ReturnType<typeof setTimeout> | undefined

const pickerOpen = ref(false)
const codeOpen = ref(false)

/**
 * 脚下这张永远在列表里：换分类把它筛掉了就钉在锚点格上，
 * 否则 slides[index] 会指向新列表的另一张 —— 只点了筛选却换了背景。
 *
 * 锚点必须独立存（pinnedAt），不能现从 index 算：goTo 一改 index，钉着的那张就会跟着
 * 搬到目标格，slides[target] 又变回它，点缩略图看着像没反应。-1 = 没在钉。
 */
const pinnedAt = ref(-1)

const slides = computed<readonly Pattern[]>(() => {
  const list = filteredPatterns.value
  if (!list.length)
    return [shown.value]
  if (list.some(item => item.id === shown.value.id))
    return list
  const at = Math.min(pinnedAt.value >= 0 ? pinnedAt.value : index.value, list.length)
  return [...list.slice(0, at), shown.value, ...list.slice(at)]
})
const active = computed(() => slides.value[index.value] ?? shown.value)
const categoryLabel = computed(
  () => PATTERN_CATEGORIES.find(item => item.id === active.value.category)?.label ?? '',
)
const sheetOpen = computed(() => pickerOpen.value || codeOpen.value)

/** 当前筛选结果里的第几张（1 基）；0 = 脚下这张不在这批结果里（被钉住的那一屏） */
const position = computed(
  () => filteredPatterns.value.findIndex(item => item.id === active.value.id) + 1,
)
/** 不在这批结果里时读数给一根横线，比硬写 0/47 诚实 */
const inFilter = computed(() => position.value > 0)

/** 这张图案用了哪几个色系，按色相顺序排；点一下就是那个色系的筛选 */
const activeColors = computed(() => {
  const set = new Set<string>(active.value.color)
  return colors.value.filter(option => option.id !== 'all' && set.has(option.id))
})
const filterLabel = computed(() => {
  if (activeColor.value === 'all')
    return null
  return colors.value.find(option => option.id === activeColor.value)?.label ?? null
})

/** 长按看原图：所有控件让位，图案整屏铺开 */
const peeking = ref(false)
/** 面板被拖着往下时，父层一点点回到原位，拖到哪松手都接得上 */
const sheetDragging = ref(false)
const sheetProgress = ref(0)
/** 双击收藏时，星标要跟着在 dock 里弹一下：两处同时动才看得出是同一次操作 */
const bumpSignal = ref(0)
/** 随机重掷的那一下：骰子自己转一圈 */
const shuffleKey = ref(0)
const bursts = ref<{ id: number, x: number, y: number }[]>([])
let burstSeq = 0

/** 换列表落位 / 跨多页的随机跳：画面没往哪边滚，方向那一套就不该出场 */
let quiet = false

// 先记方向再换内容，两者在同一次渲染里生效，标题才不会出现从错误的一边进来
watch(index, (next, prev) => {
  const d = next - prev
  const half = slides.value.length / 2
  if (quiet) {
    quiet = false
    dir.value = 0
    return
  }
  // 循环绕回时下标差会反向：跨过半圈就等于从另一头走的
  dir.value = Math.abs(d) <= half ? (d < 0 ? -1 : 1) : (d < 0 ? 1 : -1)
  // 轨道滚一格：只有真翻页才配得上这一下
  railTurn.value += 1
})

watch(active, (next, prev) => {
  shown.value = next
  if (!prev || prev.id === next.id)
    return
  headTurn.value += 1
  // 旧标题留在原地播完退场，别在新内容进来之前就凭空消失
  leaving.value = prev
  clearTimeout(leaveTimer)
  leaveTimer = setTimeout(() => {
    leaving.value = null
  }, LEAVE_MS)
})

/*
 * 换分类、换色系或收藏增减 = 换了一批结果。落点分两种：
 * - 脚下这张还在这批里：把指针挪到它那一格，画面本身不动（0ms 落位，滑一下就像翻了页）；
 * - 不在了，或者这一轮是点色系来的：落到新列表的第一张。
 *   筛选的意义就是「给我看这种」，停在旧背景上会让人以为筛选没生效。
 *
 * 必须 flush: 'sync'。watch(active) 建得比这里早，默认 pre 队列里它先跑：
 * 列表一换，slides[index] 已经是别人，它会先把 shown 写成那个「别人」，
 * 落点当场被污染，再也找不回来了（就是「只点筛选却换了背景」那个 bug 的另一面）。
 */

/** 色系是「点一次就要看到对应颜色」的一步，所以它带来的落点永远是第一张 */
let jumpToFirst = false

watch(activeColor, () => {
  jumpToFirst = true
}, { flush: 'sync' })

function reanchor() {
  const list = filteredPatterns.value
  const at = list.findIndex(item => item.id === shown.value.id)
  const jump = jumpToFirst || at < 0
  jumpToFirst = false

  // 还在这批结果里：解钉、把指针挪过去，画面本身不动
  if (!jump) {
    pinnedAt.value = -1
    if (at === index.value)
      return
    quiet = true
    duration.value = 0
    index.value = at
    nextTick(() => (duration.value = SWIPE_MS))
    return
  }

  /*
   * 不在结果里：落到新列表的第一张，而不是把旧的那张钉在原地。
   * 筛选的意义就是「给我看这种」，停在旧背景上只会让人以为筛选没生效；
   * 第一张和面板首格是同一张，看得见的落点和列表的顺序对得上。
   */
  const first = list[0]
  if (!first)
    return
  pinnedAt.value = -1
  quiet = true
  entry.value = 'focus'
  // 已经站在第一张上时不重播合焦：那会像「点了没反应，只是糊了一下」
  armed.value = at === 0 && index.value === 0 ? -1 : 0
  duration.value = 0
  shown.value = first
  index.value = 0
  nextTick(() => (duration.value = SWIPE_MS))
}

watch([activeCategory, activeColor, () => filteredPatterns.value.length], reanchor, { flush: 'sync' })

// 首帧已经落到随机页，把曲线还回去，之后的切页动画照常用
onMounted(() => {
  nextTick(() => (duration.value = SWIPE_MS))
})

onBackPress(() => {
  if (codeOpen.value) {
    codeOpen.value = false
    return true
  }
  if (pickerOpen.value) {
    pickerOpen.value = false
    return true
  }
  return false
})

/**
 * 只挂载当前页 ±1：258 条图案各带一大段内联样式，全量渲染会把 setData 撑爆。
 * 循环列表首尾互为邻居，所以距离要按绕回去的那一头也算一遍，否则从最后一页翻回第一页时是空白。
 */
function isNear(i: number) {
  const d = Math.abs(i - index.value)
  return d <= 1 || slides.value.length - d <= 1
}

/** 只有正好落在这一格的那一层播入场动画：翻页是合焦，随机跳是重掷 */
function slideClass(i: number) {
  if (i !== armed.value)
    return ''
  return entry.value === 'shuffle' ? 'slide--shuffle' : 'slide--enter'
}

function goTo(target: number, mode: 'auto' | 'shuffle' = 'auto') {
  if (target < 0 || target === index.value)
    return
  // 相邻页沿用滑动曲线，和手势是同一套语言；跨多页时中途全是没挂载的空位，
  // 滑动会拖出一屏白底，所以 0ms 直接落到目标再播合焦。
  const near = mode === 'auto' && Math.abs(target - index.value) <= 1
  duration.value = near ? SWIPE_MS : 0
  // 相邻目标本来就在 ±1 窗口里挂着，补上动画类会让它凭空重播一次合焦
  armed.value = near ? -1 : target
  entry.value = mode === 'shuffle' ? 'shuffle' : 'focus'
  quiet = !near
  index.value = target
  if (!near)
    nextTick(() => (duration.value = SWIPE_MS))
}

function pick(pattern: Pattern) {
  const at = slides.value.findIndex(item => item.id === pattern.id)
  // 点中的就是脚下这张：当成一次确认收面板，而不是留在原地什么都不发生
  if (at === index.value) {
    pickerOpen.value = false
    return
  }
  goTo(at)
}

function onSwiperChange(event: UniHelper.SwiperOnChangeEvent) {
  const next = event.detail.current
  // 程序跳页 swiper 也会回报同一个下标，那种情况内容已经在 watch 里落好了
  if (next === index.value)
    return
  index.value = next
  armed.value = -1
  entry.value = 'focus'
  dismissHint()
}

function onFavouriteChange(next: boolean) {
  uni.showToast({ title: next ? '已收藏' : '已取消收藏', icon: 'none' })
}

/** 顶部那行收藏读数直接进收藏分类：攒起来的数字得能点进去看 */
function openFavourites() {
  activeCategory.value = 'favourites'
  // 带着色系进来很可能撞上一屏空（收藏里正好没有那个色），进收藏就先看全部
  activeColor.value = 'all'
  pickerOpen.value = true
  dismissHint()
}

function pickColor(id: string) {
  activeColor.value = id as typeof activeColor.value
  dismissHint()
}

/** 随机换一张：断开的一次落位，走重掷动画（比翻页的合焦更糊更涨） */
function shuffle() {
  const list = filteredPatterns.value
  if (list.length < 2)
    return
  shuffleKey.value += 1
  dismissHint()
  uni.vibrateShort()
  let at = Math.floor(Math.random() * list.length)
  // 连点两次不该原地不动
  if (list[at]?.id === active.value.id)
    at = (at + 1) % list.length
  goTo(slides.value.findIndex(item => item.id === list[at]!.id), 'shuffle')
}

/*
 * 手势仲裁：三种手势共用这一层触摸监听，谁先满足条件谁就拿走。
 * - 按住不动 → 看原图（控件让位、图案整屏铺开，松手回来）
 * - 双击 → 收藏（星标同时弹一下，两处一起动才读得出因果）
 * - 上下滑 → 交给原生 swiper，这里只负责在动起来之后撤掉长按
 * 全程只读事件、不 preventDefault：swiper 跟手那一段不能被这一层打断。
 */
let holdTimer: ReturnType<typeof setTimeout> | undefined
let originX = 0
let originY = 0
let lastTapAt = 0

function firstTouch(event: { touches: readonly { clientX: number, clientY: number }[] }) {
  return event.touches[0]
}

function onStageTouchStart(event: { touches: readonly { clientX: number, clientY: number }[] }) {
  if (sheetOpen.value)
    return
  const touch = firstTouch(event)
  if (!touch)
    return
  originX = touch.clientX
  originY = touch.clientY
  clearTimeout(holdTimer)
  holdTimer = setTimeout(() => {
    peeking.value = true
    dismissHint()
    uni.vibrateShort()
  }, HOLD_MS)
}

function onStageTouchMove(event: { touches: readonly { clientX: number, clientY: number }[] }) {
  const touch = firstTouch(event)
  if (!touch)
    return
  const moved
    = Math.abs(touch.clientX - originX) > TOUCH_SLOP
      || Math.abs(touch.clientY - originY) > TOUCH_SLOP
  if (!moved)
    return
  clearTimeout(holdTimer)
  // 已经开始滑了就不是在看原图：手指要翻页，屏幕就该还给翻页
  if (peeking.value)
    peeking.value = false
}

function onStageTouchEnd() {
  clearTimeout(holdTimer)
  if (peeking.value)
    peeking.value = false
}

/** 两种端的点击坐标字段不一样：小程序在 detail.x/y，H5 在 clientX/clientY */
function tapPoint(event: { detail?: { x?: number, y?: number }, clientX?: number, clientY?: number }) {
  const x = typeof event.detail?.x === 'number' ? event.detail.x : event.clientX ?? 0
  const y = typeof event.detail?.y === 'number' ? event.detail.y : event.clientY ?? 0
  return { x, y }
}

function onStageTap(event: { detail?: { x?: number, y?: number }, clientX?: number, clientY?: number }) {
  const now = Date.now()
  if (now - lastTapAt > DOUBLE_TAP_MS) {
    lastTapAt = now
    return
  }
  lastTapAt = 0
  burst(tapPoint(event))
}

/**
 * 双击只收藏、不取消：一个手势承担两种相反的结果，第二次就没人敢按了。
 * 已经收藏的那张再双击也照样给一次爆开——想要的是「收到了」的回应。
 */
function burst(point: { x: number, y: number }) {
  const id = active.value.id
  if (!isFavourite(id))
    toggleFavourite(id)
  bumpSignal.value += 1
  dismissHint()
  uni.vibrateShort()
  burstSeq += 1
  const item = { id: burstSeq, ...point }
  bursts.value = [...bursts.value, item]
  setTimeout(() => {
    bursts.value = bursts.value.filter(burst => burst.id !== item.id)
  }, 900)
}

function onSheetDragStart() {
  sheetDragging.value = true
}

function onSheetDrag(progress: number) {
  sheetProgress.value = progress
}

function onSheetDragEnd() {
  sheetDragging.value = false
  sheetProgress.value = 0
}

/**
 * 面板被拖着往下时，父层从「推远」一点点回到原位：
 * 拖到一半松手，父层也停在一半 —— 两个层是同一件事的两半，不是各动各的。
 */
const stageStyle = computed(() => {
  if (!sheetDragging.value)
    return {}
  return {
    transform: `scale(${(0.955 + 0.045 * sheetProgress.value).toFixed(4)})`,
    filter: `brightness(${(0.78 + 0.22 * sheetProgress.value).toFixed(3)})`,
  }
})

const gestureHint = computed(() => (hintVisible.value && !sheetOpen.value ? gestureHintText : null))
</script>

<template>
  <view class="root">
    <view
      class="stage"
      :class="{ 'stage--pushed': sheetOpen, 'stage--drag': sheetDragging }"
      :style="stageStyle"
      @touchstart="onStageTouchStart"
      @touchmove="onStageTouchMove"
      @touchend="onStageTouchEnd"
      @touchcancel="onStageTouchEnd"
      @tap="onStageTap"
    >
      <swiper
        class="bg"
        :vertical="true"
        :circular="true"
        :current="index"
        :duration="duration"
        :disable-touch="sheetOpen"
        easing-function="easeInOutCubic"
        @change="onSwiperChange"
      >
        <swiper-item v-for="(pattern, i) in slides" :key="pattern.id">
          <view v-if="isNear(i)" class="slide" :class="slideClass(i)">
            <PatternSurface :pattern="pattern" />
          </view>
        </swiper-item>
      </swiper>

      <view class="scrim" :class="{ 'scrim--away': peeking }" />

      <PageRail :total="slides.length" :turn="railTurn" :dir="dir" :away="peeking" />

      <AppHeader
        :category="categoryLabel"
        :name="active.name"
        :leaving-name="leaving?.name ?? null"
        :dir="dir"
        :position="position"
        :in-filter="inFilter"
        :total="count"
        :colors="activeColors"
        :favourite-count="ids.length"
        :filter-label="filterLabel"
        :hint="gestureHint"
        :turn="headTurn"
        :away="peeking"
        @favourites="openFavourites"
        @filter-color="pickColor"
      />

      <view class="bottom">
        <ColorRail :items="colors" :active="activeColor" :away="peeking" @change="pickColor" />

        <view class="dock" :class="{ 'dock--away': peeking }">
          <view
            class="dock-circle press"
            hover-class="press--on"
            :hover-stay-time="60"
            @tap.stop="shuffle"
          >
            <view :key="shuffleKey" class="dice" :class="{ 'dice--roll': shuffleKey > 0 }">
              <view class="dice-face">
                <view class="pip pip--tl" />
                <view class="pip pip--tr" />
                <view class="pip pip--c" />
                <view class="pip pip--bl" />
                <view class="pip pip--br" />
              </view>
            </view>
          </view>

          <view
            class="dock-btn press"
            hover-class="press--on"
            :hover-stay-time="60"
            @tap.stop="pickerOpen = true"
          >
            <text class="dock-text">选择背景</text>
          </view>

          <FavouriteButton
            :pattern-id="active.id"
            :signal="bumpSignal"
            @change="onFavouriteChange"
          />
        </view>
      </view>

      <!-- 双击收藏的那一下从手指底下炸开，而不是在屏幕角落悄悄换一个状态 -->
      <view
        v-for="item in bursts"
        :key="item.id"
        class="burst"
        :style="{ left: `${item.x}px`, top: `${item.y}px` }"
      >
        <view class="burst-ring" />
        <text class="burst-star">★</text>
      </view>
    </view>

    <BottomSheet
      :open="pickerOpen"
      title="选择背景"
      @close="pickerOpen = false"
      @drag-start="onSheetDragStart"
      @drag="onSheetDrag"
      @drag-end="onSheetDragEnd"
    >
      <template #action>
        <text class="sheet-act press" hover-class="press--on" :hover-stay-time="60" @tap="codeOpen = true">
          复制代码
        </text>
      </template>
      <PatternPicker
        :categories="categories"
        :active-category="activeCategory"
        :colors="colors"
        :active-color="activeColor"
        :patterns="visible"
        :active-id="active.id"
        :has-more="hasMore"
        :empty="isEmptyState"
        @change-category="activeCategory = $event"
        @change-color="pickColor"
        @pick="pick"
        @load-more="loadMore"
      />
    </BottomSheet>

    <BottomSheet
      :open="codeOpen"
      title="复制背景代码"
      @close="codeOpen = false"
      @drag-start="onSheetDragStart"
      @drag="onSheetDrag"
      @drag-end="onSheetDragEnd"
    >
      <CodeSheet :pattern="active" />
    </BottomSheet>
  </view>
</template>

<style scoped>
.root {
  position: relative;
  min-height: 100vh;
  background: #16141c;
}

/* 一屏一页：stage 自己就是视口，分页器和浮层都在这个坐标系里 */
.stage {
  position: relative;
  height: 100vh;
  overflow: hidden;
  transition: transform 480ms var(--spring), filter 480ms var(--spring);
  will-change: transform, filter;
}

/* 拖着面板走的时候父层要一帧一帧跟手，不能挂一条 480ms 的过渡在后面追 */
.stage--drag {
  transition: none;
}

/*
 * 模态任务：把父层推远压暗，材质层级即层级关系。
 * 0.62 压得太死——弹层收成毛玻璃之后，背后被压成灰，玻璃收不到颜色；
 * 提到 0.78，推远交给 scale 和这层一起说（实测面板底色从 28-36 抬到 45-58，白字仍 10:1 以上）。
 */
.stage--pushed {
  transform: scale(0.955);
  filter: brightness(0.78);
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  /* swiper 自带 150px 默认高（h5 和微信原生都一样），只写 inset 会被它自己的 height 顶掉 */
  width: 100%;
  height: 100%;
  z-index: 0;
  /*
   * 白底和 web 端一致（卡片 bg-white、手机框 .phone-screen #fff）。
   * 带 maskImage 渐隐的图案边缘是透明的，深色底会让它整片发暗，看着像图案本身是深色。
   */
  background: #fff;
}

/* 动 blur/scale 的是包裹层，图案自己的内联 filter 不受影响 */
.slide {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  will-change: transform, opacity;
}

.slide--enter {
  animation: materialize 620ms var(--settle) both;
}

/* 收尾落到 filter: none，而不是 blur(0)：留一个恒等 filter 会一直占住合成层并露出边缘 */
@keyframes materialize {
  from {
    opacity: 0;
    transform: scale(1.055);
    filter: blur(14px);
  }
  99% {
    filter: blur(0.6px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: none;
  }
}

/*
 * 随机重掷比合焦重一档：合焦是「这一张就位了」，重掷是「换了一张」，
 * 后者要糊得更彻底、涨得更开，才读得出和翻页不是同一件事。
 */
.slide--shuffle {
  animation: shuffle-in 760ms var(--settle) both;
}

@keyframes shuffle-in {
  from {
    opacity: 0;
    transform: scale(1.09);
    filter: blur(26px);
  }
  99% {
    filter: blur(1px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: none;
  }
}

/*
 * 白底之后，浅色图案上的标题全靠这层压暗；0.5 压不住近白底，提到 0.62。
 * 中段留一段 0.52 的平台再收到 0：标题区拉开之后读数落在渐变尾段，纯线性衰减会让它
 * 掉到 1.9:1，平台托回 3:1 以上，而图案照样在这层之下完整浮出来。
 * 长按看原图时这层也一起撤掉 —— 看原图就是连压暗也不要。
 */
.scrim {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: 54vh;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(8, 7, 12, 0.62) 0%, rgba(8, 7, 12, 0.52) 42%, rgba(8, 7, 12, 0) 100%);
  transition: opacity 420ms var(--settle);
}

.scrim--away {
  opacity: 0;
}

/* 底部两层：色轨在上、dock 在下，让位时各走各的延迟，读起来像一次收拢 */
.bottom {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
}

/*
 * dock 无底板：图案一直铺到底边，只有三颗浮着的按钮。
 * 底部留 64rpx（≈16pt，iOS 常规底边距）再叠安全区：原来只有 28rpx，
 * 在没有安全区的机型上按钮几乎贴着屏幕边，拇指按起来很勉强。
 */
.dock {
  display: flex;
  align-items: center;
  padding: 32rpx 36rpx calc(64rpx + env(safe-area-inset-bottom));
  transition: transform 460ms var(--settle), opacity 460ms var(--settle);
  transition-delay: 70ms;
}

.dock--away {
  opacity: 0;
  transform: translateY(80rpx);
}

/*
 * 灰白毛玻璃：半透明白 + backdrop-filter，图案从底下透上来但被压平；
 * 亮顶边是光打在材质上，比纯描边更像真实材质。
 */
.dock-btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 92rpx;
  margin-right: 18rpx;
  border-radius: 999rpx;
  background: rgba(238, 238, 244, 0.68);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.55), 0 10rpx 28rpx rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(24px) saturate(180%);
  pointer-events: auto;
}

/* 圆形控件跟右侧轨道、星标同一份深色磨砂：三颗浮在图案上的按钮不该各是各的玻璃 */
.dock-circle {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 92rpx;
  height: 92rpx;
  margin-right: 18rpx;
  border-radius: 999rpx;
  background: rgba(28, 26, 36, 0.26);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.22), 0 8rpx 24rpx rgba(8, 7, 12, 0.18);
  backdrop-filter: blur(18px) saturate(160%);
  pointer-events: auto;
}

/*
 * 骰子：随机这件事不该用文字说。
 * 五点自己画——图形是空心的，浅色图案上白描边加落影也读得出来；
 * 换成图标字体又要赌内核认不认那个字形。
 */
.dice {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  will-change: transform;
}

.dice--roll {
  animation: dice-roll 620ms var(--spring) both;
}

@keyframes dice-roll {
  from {
    transform: rotate(140deg) scale(0.72);
  }
  60% {
    transform: rotate(-8deg) scale(1.04);
  }
  to {
    transform: rotate(0) scale(1);
  }
}

.dice-face {
  position: relative;
  box-sizing: border-box;
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.92);
  border-radius: 9rpx;
  box-shadow: 0 0 6rpx rgba(8, 7, 12, 0.45);
}

.pip {
  position: absolute;
  width: 7rpx;
  height: 7rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.92);
}

.pip--tl {
  top: 5rpx;
  left: 5rpx;
}

.pip--tr {
  top: 5rpx;
  right: 5rpx;
}

.pip--c {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pip--bl {
  bottom: 5rpx;
  left: 5rpx;
}

.pip--br {
  right: 5rpx;
  bottom: 5rpx;
}

.dock-text {
  font-size: 29rpx;
  font-weight: 600;
  letter-spacing: -0.2rpx;
  color: #16141c;
}

/*
 * 双击的爆开：一颗星加一圈往外散掉的环。星先亮起来再胀开，
 * 环走得比星远 —— 两者同源不同速，才像有质量的一下，而不是两个一起淡出的动画。
 */
.burst {
  position: absolute;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0;
  height: 0;
  pointer-events: none;
}

.burst-star {
  position: absolute;
  font-size: 92rpx;
  line-height: 1;
  color: #ffd97a;
  text-shadow: 0 4rpx 22rpx rgba(8, 7, 12, 0.45);
  animation: burst-star 720ms var(--settle) both;
}

.burst-ring {
  position: absolute;
  width: 170rpx;
  height: 170rpx;
  border: 3rpx solid rgba(255, 217, 122, 0.7);
  border-radius: 999rpx;
  animation: burst-ring 780ms var(--settle) both;
}

@keyframes burst-star {
  0% {
    opacity: 0;
    transform: scale(0.32) rotate(-16deg);
  }
  24% {
    opacity: 1;
    transform: scale(1.08) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scale(1.55) rotate(5deg);
  }
}

@keyframes burst-ring {
  0% {
    opacity: 0.8;
    transform: scale(0.34);
  }
  100% {
    opacity: 0;
    transform: scale(1.45);
  }
}

/*
 * 弹层头部只有一个「实」按钮，就是它：颜色落在实色层上（§12），
 * 和选中态的分类片、Switcher 的滑块同一种语言；关闭动作让位给裸文字。
 */
.sheet-act {
  margin-right: 10rpx;
  padding: 12rpx 26rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #16141c;
  background: #fff;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.24);
}

@media (prefers-reduced-motion: reduce) {
  .stage,
  .dock,
  .scrim {
    transition: none;
  }

  .stage--pushed {
    transform: none;
    filter: brightness(0.72);
  }

  /* 不做位移和模糊，但仍要把「换了内容」交代清楚：位移换成交叉淡入淡出 */
  .slide--enter,
  .slide--shuffle {
    animation: fade-in 220ms ease both;
  }

  .dice--roll,
  .burst-star,
  .burst-ring {
    animation: none;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 用户要求降低透明度时，主按钮收成实色，不再依赖 backdrop-filter */
@media (prefers-reduced-transparency: reduce) {
  .dock-btn {
    background: #eeeff4;
    backdrop-filter: none;
  }

  .dock-circle {
    background: rgba(28, 26, 36, 0.72);
    backdrop-filter: none;
  }
}
</style>
