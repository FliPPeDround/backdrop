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
  <view
    class="mask"
    :class="{ 'mask--on': props.open, 'mask--drag': dragging }"
    @tap="emit('close')"
  >
    <!-- 拖到哪，背后的压暗就退到哪：手指在动的是「模态」这件事，不只是那块面板 -->
    <view class="frost" :style="{ opacity: 1 - progress }" />
    <view
      class="sheet"
      :class="{ 'sheet--on': props.open }"
      :style="offset ? { transform: `translateY(${offset}px)` } : {}"
      @tap.stop="stop"
    >
      <!-- 只有头部能拖：下面是横向滚动的缩略图，两边抢同一个手势会有一边失灵 -->
      <view
        class="grab-zone"
        @touchstart="onDragStart"
        @touchmove="onDragMove"
        @touchend="onDragEnd"
        @touchcancel="onDragEnd"
      >
        <view class="grabber" />
        <view v-if="contentMounted">
          <view class="head">
            <text class="head-title">{{ props.title }}</text>
            <view class="head-actions">
              <slot name="action" />
            </view>
          </view>
        </view>
      </view>
      <slot v-if="contentMounted" />
    </view>
  </view>
</template>

<style scoped>
/*
 * 遮罩只管命中和可见性；压暗 + 磨砂交给下面那层 .frost。
 * visibility 的延迟保留：关闭时面板滑完再交出命中区。
 */
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  visibility: hidden;
  transition: visibility 0s linear 420ms;
}

.mask--on {
  visibility: visible;
  transition: visibility 0s;
}

/* 拖动的这一段必须一帧一帧跟手：过渡会让面板滑在手指后面 */
.mask--drag .frost,
.mask--drag .sheet {
  transition: none;
}

/*
 * 磨砂单独一层，而且这层自己绝不被动画推着走：
 * backdrop-filter 挂在 transform 动画中的元素上，合成器会复用上一次采样的快照，
 * 而那次采样时面板还在屏幕外 —— 表现就是面板先透明、落位后才突然变玻璃。
 * 模糊半径本身可以过渡（材质「凝出来」而不是凭空出现），位移交给面板。
 * 压暗也放这层：整屏一起糊，才像 iOS 的模态。
 */
.frost {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(8, 7, 12, 0);
  backdrop-filter: blur(0px) saturate(180%);
  transition: background 420ms var(--spring), backdrop-filter 420ms var(--spring);
}

.mask--on .frost {
  background: rgba(8, 7, 12, 0.22);
  backdrop-filter: blur(30px) saturate(180%);
}

.sheet {
  position: relative;
  z-index: 1;
  max-height: 80vh;
  padding: 0 32rpx calc(28rpx + env(safe-area-inset-bottom));
  border-radius: 44rpx 44rpx 0 0;
  /*
   * 面板自己不再 backdrop-filter：背后的整屏已经被 .frost 糊过一遍，再糊一次只是白付钱。
   * 这里只留一层同色相的染色（和右侧胶囊一个家族 28,26,36）+ 亮顶边。
   */
  background: rgba(28, 26, 36, 0.55);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.28), 0 -20rpx 60rpx rgba(0, 0, 0, 0.4);
  transform: translateY(102%);
  transition: transform 480ms var(--spring);
  will-change: transform;
}

/* 老内核没有 backdrop-filter：两层都退回实色，别让图案直接透上来 */
@supports not (backdrop-filter: blur(1px)) {
  .mask--on .frost {
    background: rgba(8, 7, 12, 0.62);
  }

  .sheet {
    background: rgba(24, 22, 31, 0.96);
  }
}

.sheet--on {
  transform: translateY(0);
}

.grabber {
  width: 76rpx;
  height: 10rpx;
  margin: 16rpx auto 4rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.26);
  transition: width 320ms var(--spring), background 320ms var(--spring);
}

/* 抓住了就把把手加宽、提亮：告诉手指「这块面板现在归你拖」 */
.mask--drag .grabber {
  width: 108rpx;
  background: rgba(255, 255, 255, 0.44);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 4rpx 24rpx;
}

.head-title {
  font-size: 34rpx;
  font-weight: 600;
  letter-spacing: -0.6rpx;
  color: var(--ink);
}

.head-actions {
  display: flex;
  align-items: center;
}

@media (prefers-reduced-motion: reduce) {
  .sheet {
    transition: none;
  }

  .grabber {
    transition: none;
  }
}

/* 要求降低透明度时收成实色：毛玻璃是装饰，可读性不是 */
@media (prefers-reduced-transparency: reduce) {
  .frost,
  .mask--on .frost {
    background: rgba(8, 7, 12, 0.62);
    backdrop-filter: none;
  }

  .sheet {
    background: rgba(24, 22, 31, 0.98);
  }
}
</style>
