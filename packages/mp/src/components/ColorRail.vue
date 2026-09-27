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
  <!--
    整条带子横向铺满、内容居中：手指不必先精准点到胶囊上才能起滑。
    高度只包住胶囊，指针读数往上飘，所以比胶囊高一点。
    父层整条底部是 pointer-events: none（拇指根部要能起手势），轨道自己把触摸收回来。
  -->
  <view
    class="relative flex justify-center pt-[58rpx] pointer-events-auto
      [transition:transform_460ms_var(--settle),opacity_460ms_var(--settle)] delay-[40ms]
      motion-reduce:transition-none"
    :class="away ? 'on:opacity-0 on:translate-y-[90rpx]' : ''"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <!--
      读数挂在指针正上方。左沿 = 带子内衬（inline transform 里的 bandLeft）+ 胶囊内的那个 12rpx，
      内层再往回挪半个自身宽度，所以气泡中心永远压在色点中心上，不看气泡自己多宽。
    -->
    <view
      class="absolute top-0 left-[12rpx] w-0 opacity-0 origin-bottom [transition:opacity_240ms_var(--settle)]"
      :class="tipOn && !away ? 'on:opacity-100' : ''"
      :style="{ transform: `translateX(${tipX}rpx)` }"
    >
      <view
        class="absolute bottom-[6rpx] left-0 flex items-center px-[18rpx] py-[8rpx] rounded-full
          -translate-x-1/2 whitespace-nowrap
          bg-[rgba(22,20,28,0.82)] shadow-[inset_0_1rpx_0_rgba(255,255,255,0.18),0_8rpx_22rpx_rgba(8,7,12,0.36)]"
      >
        <view class="w-[14rpx] h-[14rpx] mr-[10rpx] rounded-full" :style="colorPaint(current)" />
        <text class="text-[23rpx] font-600 tracking-[0.2rpx] text-white">{{ current?.label }}</text>
        <text class="ml-[10rpx] text-[21rpx] tabular-nums text-ink-3">{{ current?.count }}</text>
      </view>
    </view>

    <!--
      深色磨砂：色点本身够亮，底只要压住图案的杂讯就够，压重了整条会变成一块黑条。
      材质和右侧轨道、dock 是同一份（rgba(28,26,36,·) + blur + 亮顶边），悬浮控件不该各是各的玻璃。
    -->
    <view
      class="relative box-border flex-none px-[12rpx] py-[6rpx] rounded-full
        bg-[rgba(28,26,36,0.24)] shadow-[inset_0_1rpx_0_rgba(255,255,255,0.16),0_6rpx_18rpx_rgba(8,7,12,0.16)]
        backdrop-blur-[16px] backdrop-saturate-150
        reduce-transparency:bg-[rgba(20,18,26,0.82)] reduce-transparency:backdrop-filter-none"
      :style="{ width: `${CAPSULE}rpx` }"
    >
      <view class="flex items-center">
        <view
          v-for="(item, i) in items"
          :key="item.id"
          class="relative flex items-center justify-center h-[44rpx]"
          :style="{ width: `${SLOT}rpx` }"
          @tap.stop="commit(i)"
        >
          <!--
            选中 = 色点自己长出一圈：2rpx 描边 + 3rpx 暗缝 + 4rpx 白环，外径 40rpx，
            正正好待在 44rpx 的格子里。box-shadow 永远和元素同心，不存在居不居中这件事；
            暗缝就是「边框离色点还有一点距离」的那点空隙，白环保证任何色相、任何底色上都读得出来。
            这个分类里一个都没有（opacity-30）时看得出来，也省得点进去撞一屏空。
          -->
          <view
            class="w-[22rpx] h-[22rpx] rounded-full
              shadow-[0_0_0_2rpx_rgba(8,7,12,0.28),0_2rpx_6rpx_rgba(8,7,12,0.2)]
              [transition:box-shadow_320ms_var(--spring),opacity_320ms_var(--spring)]
              motion-reduce:transition-none"
            :class="[
              i === preview
                ? 'on:shadow-[0_0_0_2rpx_rgba(8,7,12,0.32),0_0_0_5rpx_rgba(20,18,26,0.55),0_0_0_9rpx_rgba(255,255,255,0.92),0_2rpx_10rpx_rgba(8,7,12,0.3)]'
                : '',
              item.count === 0 ? 'opacity-30' : '',
            ]"
            :style="colorPaint(item)"
          />
        </view>
      </view>
    </view>
  </view>
</template>
