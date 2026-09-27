<script setup lang="ts">
/**
 * 品牌标形：一枚 -10° 倾斜的描边取景框，内嵌一层自左上向右下渐隐到透明的背景层。
 *
 * 几何照母版写死，不做等比缩放：内容区 23×26 + 1.5px 描边、圆角 6px，内层 13×16 圆角 3px、
 * 渐变 145°。小程序 view 是 content-box，描边算在盒子外面，所以 23+3 × 26+3 正好是母版的
 * 26×29 —— 用 border-box 会让框小一圈，比例跟着变，看着就不像了。这里按 1px = 2rpx 换成 rpx，
 * 和页面其他尺寸用同一套单位。
 *
 * 内层用 flex 居中，不用绝对定位 + 手工偏移：偏移量一旦和描边宽度、box-sizing 的理解差一点，
 * 内层就会偏心，倾斜之后整个标就是「歪的」。
 *
 * 不用图片：标形本来就是两个圆角矩形，CSS 画比 image 收 SVG 稳，也不用为几种尺寸各导一张图。
 */
</script>

<template>
  <view class="brand-mark">
    <view class="brand-mark-inner" />
  </view>
</template>

<style scoped>
.brand-mark {
  display: flex;
  box-sizing: content-box;
  /* 字标再长也不能把它压扁：宽高比一变，这枚斜框立刻就不像自己了 */
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 46rpx;
  height: 52rpx;
  margin-right: 20rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.95);
  border-radius: 12rpx;
  transform: rotate(-10deg);
}

.brand-mark-inner {
  width: 26rpx;
  height: 32rpx;
  border-radius: 6rpx;
  background: linear-gradient(145deg, #fff, rgba(255, 255, 255, 0.12));
}
</style>
