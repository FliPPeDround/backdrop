<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  title?: string
}>()

const emit = defineEmits<{
  'close': []
  'drag-start': []
  /** 0 = 贴在原位，1 = 已经拖到「松手就走」的那条线 */
  'drag': [progress: number]
  'drag-end': []
}>()

// 面板常驻，用 visibility 控制命中测试：这样开合都是同一条可打断的过渡曲线
const contentMounted = ref(props.open)

watch(() => props.open, (isOpen) => {
  if (isOpen)
    contentMounted.value = true
  else
    resetDrag()
})

/**
 * 拖到这里松手就走：约面板高度的三分之一，往下带一下手就够得着，
 * 又不会让「只是想看看下一排缩略图」的误触把面板带走。
 */
const DISMISS_AT = 132
/** 快速下甩的门槛（px/ms）：距离不够也走，看的是速度，和 iOS 面板同一个判据 */
const FLICK = 0.5

const dragging = ref(false)
const offset = ref(0)
const progress = computed(() => Math.min(1, Math.max(0, offset.value / DISMISS_AT)))

let startY = 0
let lastY = 0
let lastAt = 0
let velocity = 0

/**
 * 越过门槛之后开始拉不动：手感像下面有阻力，而不是把面板拖到屏幕外一片空白。
 * 往上拉也留一点余量，但那点位移不该真的把面板举起来。
 */
function resist(dy: number) {
  if (dy <= 0)
    return dy * 0.25
  return dy <= DISMISS_AT ? dy : DISMISS_AT + (dy - DISMISS_AT) * 0.42
}

function resetDrag() {
  dragging.value = false
  offset.value = 0
}

function onDragStart(event: { touches: readonly { clientY: number }[] }) {
  const touch = event.touches[0]
  if (!touch)
    return
  dragging.value = true
  startY = touch.clientY
  lastY = touch.clientY
  lastAt = Date.now()
  velocity = 0
  offset.value = 0
  emit('drag-start')
}

function onDragMove(event: { touches: readonly { clientY: number }[] }) {
  if (!dragging.value)
    return
  const touch = event.touches[0]
  if (!touch)
    return
  const now = Date.now()
  const dt = now - lastAt || 1
  velocity = (touch.clientY - lastY) / dt
  lastY = touch.clientY
  lastAt = now
  offset.value = resist(touch.clientY - startY)
  emit('drag', progress.value)
}

/**
 * 松手只有两种结果，都交给同一条曲线：留下就清掉 inline 位移让 class 把面板送回原位，
 * 走掉就带着当前位移直接换成收起的 class —— 过渡从「手指停在哪」接着走，不回中间那一格。
 */
function onDragEnd() {
  if (!dragging.value)
    return
  const gone = offset.value > DISMISS_AT || velocity > FLICK
  dragging.value = false
  emit('drag-end')
  if (gone)
    emit('close')
  else
    offset.value = 0
}

function stop() {}
</script>

<template>
  <!--
    遮罩只管命中和可见性；压暗 + 磨砂交给下面那层 frost。
    visibility 的延迟保留：关闭时面板滑完再交出命中区。
  -->
  <view
    class="fixed inset-0 z-20 flex flex-col justify-end"
    :class="props.open
      ? 'on:visible on:[transition:visibility_0s]'
      : 'invisible [transition:visibility_0s_linear_420ms]'"
    @tap="emit('close')"
  >
    <!-- 拖到哪，背后的压暗就退到哪：手指在动的是「模态」这件事，不只是那块面板 -->
    <!--
      磨砂单独一层，而且这层自己绝不被动画推着走：
      backdrop-filter 挂在 transform 动画中的元素上，合成器会复用上一次采样的快照，
      而那次采样时面板还在屏幕外 —— 表现就是面板先透明、落位后才突然变玻璃。
      模糊半径本身可以过渡（材质「凝出来」而不是凭空出现），位移交给面板。
      压暗也放这层：整屏一起糊，才像 iOS 的模态。
    -->
    <view
      class="absolute inset-0 backdrop-blur-[0px] backdrop-saturate-180
        bg-[rgba(8,7,12,0)]
        [transition:background_420ms_var(--spring),backdrop-filter_420ms_var(--spring)]"
      :class="[
        props.open
          ? 'on:bg-[rgba(8,7,12,0.22)] on:backdrop-blur-[30px] on:no-backdrop:bg-[rgba(8,7,12,0.62)] on:reduce-transparency:bg-[rgba(8,7,12,0.62)] on:reduce-transparency:backdrop-filter-none'
          : '',
        dragging ? '[transition:none]' : '',
      ]"
      :style="{ opacity: 1 - progress }"
    />
    <!--
      面板自己不再 backdrop-filter：背后的整屏已经被 frost 糊过一遍，再糊一次只是白付钱。
      这里只留一层同色相的染色（和右侧胶囊一个家族 28,26,36）+ 亮顶边。
      no-backdrop / reduce-transparency 两项是兜底：模糊换不来时两层都退回实色。
    -->
    <view
      class="relative z-1 max-h-80vh px-[32rpx] pb-[calc(28rpx_+_env(safe-area-inset-bottom))]
        rounded-t-[44rpx] translate-y-[102%] bg-[rgba(28,26,36,0.55)]
        shadow-[inset_0_1rpx_0_rgba(255,255,255,0.28),0_-20rpx_60rpx_rgba(0,0,0,0.4)]
        [transition:transform_480ms_var(--spring)] will-change-transform motion-reduce:transition-none
        no-backdrop:bg-[rgba(24,22,31,0.96)] reduce-transparency:bg-[rgba(24,22,31,0.98)]"
      :class="[
        props.open ? 'on:translate-y-0' : '',
        dragging ? '[transition:none]' : '',
      ]"
      :style="offset ? { transform: `translateY(${offset}px)` } : {}"
      @tap.stop="stop"
    >
      <!-- 只有头部能拖：下面是横向滚动的缩略图，两边抢同一个手势会有一边失灵 -->
      <view
        @touchstart="onDragStart"
        @touchmove="onDragMove"
        @touchend="onDragEnd"
        @touchcancel="onDragEnd"
      >
        <!-- 抓住了就把把手加宽、提亮：告诉手指「这块面板现在归你拖」 -->
        <view
          class="w-[76rpx] h-[10rpx] mt-[16rpx] mb-[4rpx] mx-auto rounded-full bg-[rgba(255,255,255,0.26)]
            [transition:width_320ms_var(--spring),background_320ms_var(--spring)] motion-reduce:transition-none"
          :class="dragging ? 'on:w-[108rpx] on:bg-[rgba(255,255,255,0.44)]' : ''"
        />
        <view v-if="contentMounted">
          <view class="flex items-center justify-between pt-[16rpx] px-[4rpx] pb-[24rpx]">
            <text class="text-[34rpx] font-600 tracking-[-0.6rpx] text-ink">{{ props.title }}</text>
            <view class="flex items-center">
              <slot name="action" />
            </view>
          </view>
        </view>
      </view>
      <slot v-if="contentMounted" />
    </view>
  </view>
</template>
