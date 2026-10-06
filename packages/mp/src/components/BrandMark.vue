<script setup lang="ts">
/**
 * 品牌标形：一枚 -10° 倾斜的描边取景框，内嵌一层自左上向右下渐隐到透明的背景层。
 *
 * 比例照母版（内容区 23×26 + 1.5px 描边、圆角 6px，内层 13×16 圆角 3px、渐变 145°）。
 * 描边取 2rpx —— 2 倍屏上正好一个物理像素，1rpx 会渲染成半像素、细到看不清。
 * 小程序 view 是 content-box，描边算在盒子外面，所以 38+4 × 43+4 就是这枚标的实际占位。
 *
 * 内层用 flex 居中，不用绝对定位 + 手工偏移：偏移量一旦和描边宽度、box-sizing 的理解差一点，
 * 内层就会偏心，倾斜之后整个标就是「歪的」。
 *
 * 不用图片：标形本来就是两个圆角矩形，CSS 画比 image 收 SVG 稳，也不用为几种尺寸各导一张图。
 */
const props = withDefaults(defineProps<{
  /**
   * sm = 页头里陪字标的那一档（母版缩到 38×43rpx，标准尺寸）；
   * lg = 「关于」页的主视觉（1.9 倍，比例原封不动）。
   */
  size?: 'sm' | 'lg'
}>(), { size: 'sm' })

/*
 * 两档的类名都必须写成字面量：UnoCSS 扫的是源码文本，拼出来的类名它扫不到。
 * 倾斜、描边颜色、居中方式两档共用，换档只换这一组数字，比例关系不动。
 * 右边距跟着尺寸走 —— 它是这枚标和字标之间的呼吸，不是标形自己的几何。
 */
const BOX = {
  sm: 'w-[38rpx] h-[43rpx] mr-[20rpx] border-[2rpx] rounded-[10rpx]',
  lg: 'w-[72rpx] h-[82rpx] mr-[28rpx] border-[3rpx] rounded-[19rpx]',
} as const

const INNER = {
  sm: 'w-[22rpx] h-[27rpx] rounded-[5rpx]',
  lg: 'w-[42rpx] h-[51rpx] rounded-[9rpx]',
} as const
</script>

<template>
  <view
    class="flex box-content flex-shrink-0 items-center justify-center
      border-solid border-[rgba(255,255,255,0.95)] rotate--10deg"
    :class="BOX[props.size]"
  >
    <view class="bg-[linear-gradient(145deg,#fff,rgba(255,255,255,0.12))]" :class="INNER[props.size]" />
  </view>
</template>
