<script setup lang="ts">
import type { Pattern } from '@backdrop/data'
import { gridPatterns } from '@backdrop/data'
import { PATTERN_CATEGORIES, usePatternBrowser } from '@backdrop/shared'
import { onBackPress } from '@dcloudio/uni-app'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useFavourites } from '@/composables/favourites'
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
const LEAVE_MS = 260

const { ids } = useFavourites()
const { categories, activeCategory, filteredPatterns, count, isEmptyState }
  = usePatternBrowser({ favouriteIds: ids })
const { visible, hasMore, loadMore } = usePagedPatterns(filteredPatterns, 24)

// 列表是循环的，没有「第一张」可回，每次进来落在随机一张更像在翻牌
const start = Math.floor(Math.random() * filteredPatterns.value.length)
const index = ref(start)
/** 只有「挂载时正好是当前页」的那一层才播合焦，手势切页不再叠第二次动画 */
const armed = ref(start)
// 首帧必须 0ms 落到随机页：从 0 滑过去要穿过一整片没挂载的空位
const duration = ref(0)
/** 1 = 往前翻（内容往上走），-1 = 往后退；标题要按这个方向进出 */
const dir = ref(1)
/** 轨道每翻一页换一个值：换奇偶就是换 animation-name，滚一格才不会被「同名动画」吞掉 */
const railTurn = ref(0)
// 筛选结果可能为空（收藏分类最常撞上），这时停在脚下这张而不是整屏空白
const shown = ref<Pattern>(filteredPatterns.value[start] ?? gridPatterns[0]!)
const leaving = ref<Pattern | null>(null)
let leaveTimer: ReturnType<typeof setTimeout> | undefined

const pickerOpen = ref(false)
const codeOpen = ref(false)
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight ?? 0)

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
// 只剩一张时没什么可滑的，别把提示留在屏幕上骗人
const swipeHint = computed(() => (slides.value.length > 1 ? '上下滑动切换 · ' : ''))
const sheetOpen = computed(() => pickerOpen.value || codeOpen.value)

// 换分类 / 收藏增减：把指针重新落到脚下这张上，别把它当一次翻页
let reanchoring = false

// 先记方向再换内容，两者在同一次渲染里生效，标题才不会出现从错误的一边进来
watch(index, (next, prev) => {
  const d = next - prev
  const half = slides.value.length / 2
  // 循环绕回时下标差会反向：跨过半圈就等于从另一头走的
  dir.value = Math.abs(d) <= half ? (d < 0 ? -1 : 1) : (d < 0 ? 1 : -1)
  // 换列表导致的重新落位不算翻页：画面没动，轨道滚一格就是在骗人
  if (reanchoring)
    reanchoring = false
  else railTurn.value += 1
})

watch(active, (next, prev) => {
  shown.value = next
  if (!prev || prev.id === next.id)
    return
  // 旧标题留在原地播完退场，别在新内容进来之前就凭空消失
  leaving.value = prev
  clearTimeout(leaveTimer)
  leaveTimer = setTimeout(() => {
    leaving.value = null
  }, LEAVE_MS)
})

/*
 * 换分类或收藏增减 = 只换列表，不换背景：
 * 脚下这张还在新列表里就把指针挪到它那一格，被筛掉了就由 slides 在原位钉住。
 * 两种情况画面都没动，所以是 0ms 落位——让它滑一下，看起来就像翻了页。
 *
 * 必须 flush: 'sync'。watch(active) 建得比这里早，默认 pre 队列里它先跑：
 * 列表一换，slides[index] 已经是别人，它会先把 shown 写成那个「别人」，
 * 锚点当场被污染，落位就再也找不回来了（就是只点筛选却换了背景的那个 bug）。
 */
function reanchor() {
  const list = filteredPatterns.value
  const at = list.findIndex(item => item.id === shown.value.id)
  const next = at >= 0 ? at : Math.min(index.value, list.length)
  // 新列表里有它就解钉、把指针挪过去；没有它就把它钉在脚下这格
  pinnedAt.value = at >= 0 ? -1 : next
  if (next === index.value)
    return
  reanchoring = true
  duration.value = 0
  index.value = next
  nextTick(() => (duration.value = SWIPE_MS))
}

watch([activeCategory, () => filteredPatterns.value.length], reanchor, { flush: 'sync' })

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

function goTo(target: number) {
  if (target < 0 || target === index.value)
    return
  // 相邻页沿用滑动曲线，和手势是同一套语言；跨多页时中途全是没挂载的空位，
  // 滑动会拖出一屏白底，所以 0ms 直接落到目标再播合焦。
  const near = Math.abs(target - index.value) <= 1
  duration.value = near ? SWIPE_MS : 0
  // 相邻目标本来就在 ±1 窗口里挂着，补上动画类会让它凭空重播一次合焦
  armed.value = near ? -1 : target
  index.value = target
  if (!near)
    nextTick(() => (duration.value = SWIPE_MS))
}

function pick(pattern: Pattern) {
  goTo(slides.value.findIndex(item => item.id === pattern.id))
}

function onSwiperChange(event: UniHelper.SwiperOnChangeEvent) {
  const next = event.detail.current
  // 程序跳页 swiper 也会回报同一个下标，那种情况内容已经在 watch 里落好了
  if (next === index.value)
    return
  index.value = next
  armed.value = -1
}

function onFavouriteChange(next: boolean) {
  uni.showToast({ title: next ? '已收藏' : '已取消收藏', icon: 'none' })
}
</script>

<template>
  <view class="root">
    <view class="stage" :class="{ 'stage--pushed': sheetOpen }">
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
          <view v-if="isNear(i)" :class="i === armed ? 'slide slide--enter' : 'slide'">
            <PatternSurface :pattern="pattern" />
          </view>
        </swiper-item>
      </swiper>

      <view class="scrim" />

      <PageRail :total="slides.length" :turn="railTurn" :dir="dir" />

      <view class="top" :style="{ marginTop: `${statusBarHeight}px` }">
        <view :key="`cat-${active.id}`" class="eyebrow" :class="dir > 0 ? 'head-in-up' : 'head-in-down'">
          <text>{{ categoryLabel }}</text>
        </view>
        <view class="title-stack">
          <view
            v-if="leaving"
            :key="`out-${leaving.id}`"
            class="title title--leave"
            :class="dir > 0 ? 'head-out-up' : 'head-out-down'"
          >
            <text>{{ leaving.name }}</text>
          </view>
          <view :key="active.id" class="title" :class="dir > 0 ? 'head-in-up' : 'head-in-down'">
            <text>{{ active.name }}</text>
          </view>
        </view>
        <view class="sub">
          <text>{{ swipeHint }}{{ count }} 个图案 · {{ ids.length }} 个收藏</text>
        </view>
      </view>

      <view class="dock">
        <view
          class="dock-btn press"
          hover-class="press--on"
          :hover-stay-time="60"
          @tap="pickerOpen = true"
        >
          <text class="dock-text">选择背景</text>
        </view>
        <FavouriteButton :pattern-id="active.id" @change="onFavouriteChange" />
      </view>
    </view>

    <BottomSheet :open="pickerOpen" title="选择背景" @close="pickerOpen = false">
      <template #action>
        <text class="sheet-act press" hover-class="press--on" :hover-stay-time="60" @tap="codeOpen = true">
          复制代码
        </text>
      </template>
      <PatternPicker
        :categories="categories"
        :active-category="activeCategory"
        :patterns="visible"
        :active-id="active.id"
        :has-more="hasMore"
        :empty="isEmptyState"
        @change-category="activeCategory = $event"
        @pick="pick"
        @load-more="loadMore"
      />
    </BottomSheet>

    <BottomSheet :open="codeOpen" title="复制背景代码" @close="codeOpen = false">
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
 * 白底之后，浅色图案上的标题全靠这层压暗；0.5 压不住近白底，提到 0.62。
 * 中段留一段 0.52 的平台再收到 0：标题区拉开之后读数落在渐变尾段，纯线性衰减会让它
 * 掉到 1.9:1，平台托回 3:1 以上，而图案照样在这层之下完整浮出来。
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
}

.top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  /* 状态栏的高度由 inline margin 给，这里只放设计上的下移量：整块从屏幕边离开一段 */
  padding-top: 96rpx;
  padding-right: 36rpx;
  padding-left: 36rpx;
  /* 标题区只是读数，起手势不该被文字块挡住 */
  pointer-events: none;
}

/*
 * 三行不是一堆，是两组：分类是名字的标签（14rpx，贴着走），
 * 名字下方留 44rpx 才放读数——间距本身就是层级，3 倍于标签间距才读得出这是两组。
 */
.title-stack {
  position: relative;
  margin-top: 14rpx;
}

.title--leave {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

/*
 * 标题按行进方向进出：往前翻就从下面进来、旧的往上面退，往后退则整个反过来 ——
 * 背景是从下往上推的，文字只在原地淡入的话两层运动对不上（§7 进出同一条路径）。
 * 位移只有 26rpx，远小于一屏：文字是更轻的一层，跟着走但不复制一遍滑动。
 */
.head-in-up {
  animation: head-in-up 460ms var(--settle) both;
}

.head-in-down {
  animation: head-in-down 460ms var(--settle) both;
}

.head-out-up {
  animation: head-out-up 240ms var(--press) both;
}

.head-out-down {
  animation: head-out-down 240ms var(--press) both;
}

/* 按阅读顺序错开：先分类再名字；退场不延迟，两层要同时动才读得出是交接 */
.title.head-in-up,
.title.head-in-down {
  animation-delay: 45ms;
}

@keyframes head-in-up {
  from {
    opacity: 0;
    transform: translateY(26rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes head-in-down {
  from {
    opacity: 0;
    transform: translateY(-26rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes head-out-up {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20rpx);
  }
}

@keyframes head-out-down {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20rpx);
  }
}

.eyebrow {
  font-size: 22rpx;
  font-weight: 600;
  letter-spacing: 1.2rpx;
  color: var(--ink-2);
  text-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.4);
}

/*
 * 三档字号各自定重量：标签 22 / 名字 60 / 读数 24。
 * 字距按字号走，不能一个值用到底：60rpx 收 -1.2rpx（约 -0.02em，大字号要收紧），
 * 24rpx 留 +0.3rpx（小字号要松开一点才读得清）。
 * 行高 1.12：名字是英文，超过一行就折行，1.05 下上一行的降部和下一行的升部会打架。
 * 注意：标题类名不要取「h + 数字」，UnoCSS 会把它当高度工具类扫出来，
 * 生成一条全局 height 规则把文字盒压扁。
 */
.title {
  font-size: 60rpx;
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -1.2rpx;
  color: #fff;
  text-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.32);
}

/* 读数比标签大一档、比名字轻两档：它要说清内容，但别跟名字抢 */
.sub {
  margin-top: 44rpx;
  font-size: 24rpx;
  letter-spacing: 0.3rpx;
  color: var(--ink-2);
  text-shadow: 0 1rpx 3rpx rgba(8, 7, 12, 0.6), 0 3rpx 14rpx rgba(8, 7, 12, 0.35);
}

/*
 * dock 无底板：图案一直铺到底边，只有两颗浮着的按钮。
 * 底部留 64rpx（≈16pt，iOS 常规底边距）再叠安全区：原来只有 28rpx，
 * 在没有安全区的机型上按钮几乎贴着屏幕边，拇指按起来很勉强。
 */
.dock {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 24rpx 36rpx calc(64rpx + env(safe-area-inset-bottom));
  /* 底边这条带是起手势最常用的位置，只有按钮自己吃触摸 */
  pointer-events: none;
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

.dock-text {
  font-size: 29rpx;
  font-weight: 600;
  letter-spacing: -0.2rpx;
  color: #16141c;
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
  .stage {
    transition: none;
    animation: none;
  }

  .stage--pushed {
    transform: none;
    filter: brightness(0.72);
  }

  /* 不做位移和模糊，但仍要把「换了内容」交代清楚：位移换成交叉淡入淡出 */
  .slide--enter {
    animation: fade-in 220ms ease both;
  }

  .head-in-up,
  .head-in-down {
    animation: fade-in 220ms ease both;
  }

  .head-out-up,
  .head-out-down {
    animation: fade-out 160ms ease both;
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

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* 用户要求降低透明度时，主按钮收成实色，不再依赖 backdrop-filter */
@media (prefers-reduced-transparency: reduce) {
  .dock-btn {
    background: #eeeff4;
    backdrop-filter: none;
  }
}
</style>
