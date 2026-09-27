<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  /** 每翻一页换一个值：和 dir 一起决定这一格往哪边滚，以及用哪条 animation-name 重播 */
  turn: number
  /** 1 = 往前翻（内容往上走），-1 = 往后退，和标题共用同一个判据 */
  dir: number
  /** 长按看原图时整条让位：那一眼里不该有任何控件 */
  away: boolean
}>()

/**
 * 轨道是固定槽位，衰减只跟「离中心几格」有关，所以大点永远钉在正中，不会跟着列表滚走。
 * key 必须用槽位而不是图案下标：微信对 wx:key 变化的处理是移动节点，而移动过去的节点
 * 不会重新打 class，结果就是焦点停在旧节点上、往一边漂。槽位不动，这个坑就不存在。
 * 列表短到绕不开（会出现重复图案）时把槽位收成奇数格，中心点仍然落在正中。
 */
const SLOTS = 7
const MIDDLE = (SLOTS - 1) / 2
/** 离中心越远越小、越淡；一套材质两种底都成立，所以只动尺寸和亮度 */
const RAMP = [
  'scale-[1.7] opacity-100',
  'scale-[1.1] opacity-[0.78]',
  'scale-80 opacity-60',
  'scale-[0.55] opacity-[0.44]',
]

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
 * 一格等于轨道高度的 1/n，n 只可能是 1/3/5/7，所以写成四份字面量给 UnoCSS 扫：
 * 既绕开微信在 v-for 子节点上丢 :style 绑定的坑，也留得下降动效里那句覆盖。
 * --step / --dir 都只放无单位数字，rpx 一律留在声明里：微信对自定义属性里的 rpx
 * 换不换算没有保证，别让动画的幅度赌在这上面。
 */
const STEP = [
  '[--step:1]',
  '',
  '[--step:0.33333333]',
  '',
  '[--step:0.2]',
  '',
  '[--step:0.14285714]',
]

/**
 * 滚一段：--dir 决定往哪边，a/b 决定用哪条同名 keyframes。
 * 四种组合都写成字面量 —— 模板里的类名必须能被 UnoCSS 直接扫到，拼出来的字符串扫不到。
 */
const ROLL = {
  up: {
    a: 'animate-rail-roll-a [--dir:1]',
    b: 'animate-rail-roll-b [--dir:1]',
  },
  down: {
    a: 'animate-rail-roll-a [--dir:-1]',
    b: 'animate-rail-roll-b [--dir:-1]',
  },
} as const

const trackCls = computed(() => {
  const step = STEP[slots.value.length - 1] ?? '[--step:0.14285714]'
  if (!props.turn)
    return step
  const roll = ROLL[props.dir > 0 ? 'up' : 'down'][props.turn % 2 ? 'a' : 'b']
  return `${step} ${roll}`
})
</script>

<template>
  <!-- 指示器只负责交代位置，绝不吃手势：整屏任何一点都要能起滑 -->
  <view
    v-if="total > 1"
    class="absolute top-1/2 right-[16rpx] z-2 -translate-y-1/2 pointer-events-none
      [transition:transform_460ms_var(--settle),opacity_460ms_var(--settle)] delay-[90ms]
      motion-reduce:transition-none"
    :class="away ? 'on:opacity-0 on:translate-x-[56rpx]' : ''"
  >
    <!--
      中性灰磨砂、低不透明度：浅底上只是一层淡烟，深底上收一点光，
      不用判断背后是亮是暗，一套材质两种背景都成立。
    -->
    <view
      class="flex flex-col items-center px-[11rpx] py-[32rpx] rounded-full glass-dark
        will-change-transform,opacity animate-rail-in motion-reduce:animate-none
        reduce-transparency:bg-[rgba(28,26,36,0.78)]"
    >
      <view
        :key="turn"
        class="flex flex-col items-center will-change-transform,opacity
          motion-reduce:[--step:0] motion-reduce:[--dim:0.4] motion-reduce:animate-duration-[220ms]"
        :class="trackCls"
      >
        <view v-for="slot in slots" :key="slot.k" class="flex items-center justify-center flex-shrink-0 w-[12rpx] h-[32rpx]">
          <view
            class="w-[12rpx] h-[12rpx] rounded-full bg-[#e9e9f0]
              shadow-[0_0_0_1rpx_rgba(20,18,28,0.12),0_1rpx_4rpx_rgba(20,18,28,0.1)]
              [transition:transform_420ms_var(--spring),opacity_320ms_var(--spring)]
              will-change-transform,opacity motion-reduce:transition-none"
            :class="slot.cls"
          />
        </view>
      </view>
    </view>
  </view>
</template>
