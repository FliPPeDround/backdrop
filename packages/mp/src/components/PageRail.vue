<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  /** 每翻一页换一个值：和 dir 一起决定这一格往哪边滚，以及用哪条 animation-name 重播 */
  turn: number
  /** 1 = 往前翻（内容往上走），-1 = 往后退，和标题共用同一个判据 */
  dir: number
}>()

/**
 * 轨道是固定槽位，衰减只跟「离中心几格」有关，所以大点永远钉在正中，不会跟着列表滚走。
 * key 必须用槽位而不是图案下标：微信对 wx:key 变化的处理是移动节点，而移动过去的节点
 * 不会重新打 class，结果就是焦点停在旧节点上、往一边漂。槽位不动，这个坑就不存在。
 * 列表短到绕不开（会出现重复图案）时把槽位收成奇数格，中心点仍然落在正中。
 */
const SLOTS = 7
const MIDDLE = (SLOTS - 1) / 2
const RAMP = ['dot--focus', 'dot--near', 'dot--mid', 'dot--far']

const slots = computed(() => {
  const reach = Math.min(MIDDLE, Math.floor((props.total - 1) / 2))
  return Array.from({ length: reach * 2 + 1 }, (_, k) => ({
    k,
    cls: RAMP[Math.abs(k - reach)]!,
  }))
})

/**
 * 滚动动画不碰单个点，只把整条轨道当成轮子上的一段做一次 transform，
 * 点的 class 因此永远不变。两条同形 keyframes 按 turn 奇偶换 animation-name：
 * 独立节点的 key 在微信端会不会重建元素没有保证，而同名动画不重播——连续往一个方向
 * 翻时，只有名字换了才每次都起播。turn=0 是首帧，入场交给 rail-in。
 *
 * 一格等于轨道高度的 1/n，n 只可能是 1/3/5/7，用 class 给而不是内联 --step：
 * 既绕开微信在 v-for 子节点上丢 :style 绑定的坑，也留得下 reduced-motion 里那句覆盖。
 */
const STEP = ['rail-track--n1', '', 'rail-track--n3', '', 'rail-track--n5', '', 'rail-track--n7']

const trackCls = computed(() => {
  const step = STEP[slots.value.length - 1] ?? 'rail-track--n7'
  if (!props.turn)
    return step
  const parity = props.turn % 2 ? '--a' : '--b'
  return `${step} ${props.dir > 0 ? 'roll--up' : 'roll--down'} roll${parity}`
})
</script>

<template>
  <view v-if="total > 1" class="rail">
    <view class="rail-body">
      <view :key="turn" class="rail-track" :class="trackCls">
        <view v-for="slot in slots" :key="slot.k" class="rail-slot">
          <view class="rail-dot" :class="slot.cls" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 指示器只负责交代位置，绝不吃手势：整屏任何一点都要能起滑 */
.rail {
  position: absolute;
  top: 50%;
  right: 16rpx;
  z-index: 2;
  transform: translateY(-50%);
  pointer-events: none;
}

/*
 * 中性灰磨砂、低不透明度：浅底上只是一层淡烟，深底上收一点光，
 * 不用判断背后是亮是暗，一套材质两种背景都成立。
 */
.rail-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 11rpx;
  border-radius: 999rpx;
  background: rgba(28, 26, 36, 0.26);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.22), 0 8rpx 24rpx rgba(8, 7, 12, 0.18);
  backdrop-filter: blur(18px) saturate(160%);
  animation: rail-in 560ms var(--settle) 120ms both;
  will-change: transform, opacity;
}

@keyframes rail-in {
  from {
    opacity: 0;
    transform: translateX(16rpx) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/*
 * 轨道当成轮子上的一段整段滚过「一格」：位移用轨道自身高度的 1/n（n = 槽位数），
 * 槽位高度恒定 32rpx，所以 1/n 正好就是一格，列表短到收槽位时也不用改数值。
 * 和标题的 26rpx 是同一套语言：跟着背景走，但不复制一整屏。
 * 收尾按起手位移的十分之一反向轻摆——这一下是手指甩出来的，允许带一点过冲（§4 只在有动量时加弹）。
 * 内衬正好留成一格（32rpx）：轨道偏满一格时最外圈点连投影都仍在胶囊内壁之内（实测内壁余量 12.7rpx）。
 *
 * --step / --dir 都只放无单位数字，rpx 一律留在声明里：微信对自定义属性里的 rpx
 * 换不换算没有保证，别让动画的幅度赌在这上面。.rail-track 里那份 1/7 是兜底值。
 */
.rail-track {
  --step: 0.14285714;
  --dir: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: transform, opacity;
}

.roll--up {
  --dir: 1;
}

.roll--down {
  --dir: -1;
}

.rail-track--n7 {
  --step: 0.14285714;
}

.rail-track--n5 {
  --step: 0.2;
}

.rail-track--n3 {
  --step: 0.33333333;
}

.rail-track--n1 {
  --step: 1;
}

.roll--a {
  animation: rail-roll-a 440ms var(--settle) both;
}

.roll--b {
  animation: rail-roll-b 440ms var(--settle) both;
}

@keyframes rail-roll-a {
  from {
    opacity: var(--dim, 1);
    transform: translateY(calc(100% * var(--step) * var(--dir)));
  }
  78% {
    transform: translateY(calc(100% * var(--step) * var(--dir) / -10));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rail-roll-b {
  from {
    opacity: var(--dim, 1);
    transform: translateY(calc(100% * var(--step) * var(--dir)));
  }
  78% {
    transform: translateY(calc(100% * var(--step) * var(--dir) / -10));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rail-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 12rpx;
  height: 32rpx;
}

/*
 * 浅灰点配一圈暗描边：白底上靠描边分得开，深底上靠自身亮度读得到，所以换背景不用换材质。
 * 描边和落影都压得很轻（0.12 / 0.10）：这两层在浅色图案上就是点周围的一圈灰，
 * 描边再重一档就从「分开」变成「脏」，靠点本身比胶囊亮一截也照样读得出。放大走 scale，
 * 槽位高度恒定，邻居不会被顶开。
 */
.rail-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 999rpx;
  background: #e9e9f0;
  box-shadow: 0 0 0 1rpx rgba(20, 18, 28, 0.12), 0 1rpx 4rpx rgba(20, 18, 28, 0.1);
  transition: transform 420ms var(--spring), opacity 320ms var(--spring);
  will-change: transform, opacity;
}

.dot--focus {
  transform: scale(1.7);
  opacity: 1;
}

.dot--near {
  transform: scale(1.1);
  opacity: 0.78;
}

.dot--mid {
  transform: scale(0.8);
  opacity: 0.6;
}

.dot--far {
  transform: scale(0.55);
  opacity: 0.44;
}

@media (prefers-reduced-motion: reduce) {
  .rail-body {
    animation: none;
  }

  /*
   * --step 收成 0，同一对 keyframes 就只剩一次交叉淡入：仍然交代翻过一页，
   * 但屏幕上没有东西在移动。时长跟着缩短，淡入不该拖成一段慢速闪烁。
   */
  .rail-track {
    --step: 0;
    --dim: 0.4;
  }

  .roll--a,
  .roll--b {
    animation-duration: 220ms;
  }

  .rail-dot {
    transition: none;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .rail-body {
    background: rgba(28, 26, 36, 0.78);
    backdrop-filter: none;
  }
}
</style>
