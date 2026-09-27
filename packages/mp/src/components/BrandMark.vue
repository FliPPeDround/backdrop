<script setup lang="ts">
/**
 * 品牌标形：一枚 -10° 倾斜的描边取景框，内嵌一层自左上向右下渐隐到透明的背景层。
 *
 * 比例照母版（内容区 23×26 + 1.5px 描边、圆角 6px，内层 13×16 圆角 3px、渐变 145°），
 * 但页头里整体缩到 38×43rpx：它是陪字标的标记，不是主角，按母版原尺寸放在这一行偏大。
 * 描边取 2rpx —— 2 倍屏上正好一个物理像素，1rpx 会渲染成半像素、细到看不清。
 * 小程序 view 是 content-box，描边算在盒子外面，所以 38+4 × 43+4 就是这枚标的实际占位。
 *
 * 内层用 flex 居中，不用绝对定位 + 手工偏移：偏移量一旦和描边宽度、box-sizing 的理解差一点，
 * 内层就会偏心，倾斜之后整个标就是「歪的」。
 *
 * 不用图片：标形本来就是两个圆角矩形，CSS 画比 image 收 SVG 稳，也不用为几种尺寸各导一张图。
 */
</script>

<template>
  <!--
    比例照母版（内容区 23×26 + 1.5px 描边、圆角 6px，内层 13×16 圆角 3px、渐变 145°），
    但页头里整体缩到 38×43rpx：它是陪字标的标记，不是主角。
    描边取 2rpx —— 2 倍屏上正好一个物理像素，1rpx 会渲染成半像素、细到看不清。
    小程序 view 是 content-box，描边算在盒子外面，所以 38+4 × 43+4 就是这枚标的实际占位。
    内层用 flex 居中，不用绝对定位 + 手工偏移：偏移量一旦和描边宽度、box-sizing 的理解差一点，
    内层就会偏心，倾斜之后整个标就是「歪的」。
    不用图片：标形本来就是两个圆角矩形，CSS 画比 image 收 SVG 稳，也不用为几种尺寸各导一张图。
  -->
  <view
    class="flex box-content flex-shrink-0 items-center justify-center w-[38rpx] h-[43rpx] mr-[20rpx]
      border-[2rpx] border-solid border-[rgba(255,255,255,0.95)] rounded-[10rpx] rotate--10deg"
  >
    <view class="w-[22rpx] h-[27rpx] rounded-[5rpx] bg-[linear-gradient(145deg,#fff,rgba(255,255,255,0.12))]" />
  </view>
</template>
