<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  /** 位数固定，数字变化时列不重建，滚动才连得上 */
  digits: number
  /** 字号（rpx）。格高 1.5 倍、格宽 0.62 倍，等宽数字换值不左右跳 */
  size?: number
  /** 补前导零：位数不足时留空格更像读数，补零更像编号，两边都用得上 */
  pad?: boolean
}>()

const fontSize = computed(() => props.size ?? 24)

/**
 * 每一列是一条 0-9 的竖带，整条 translateY(-10% × 数字) 滚到位。
 * 滚的是合成层，不逐帧 setData，所以可以在一次筛选里连滚十几个数。
 */
const cells = computed(() => {
  const value = Math.max(0, Math.round(props.value))
  const raw = props.pad
    ? String(value).padStart(props.digits, '0')
    : String(value)
  // 超过位数就截尾：这是读数，不是计数器
  const shown = raw.slice(-props.digits)

  return Array.from({ length: props.digits }, (_, i) => {
    const char = shown[shown.length - props.digits + i]
    return {
      /** 从右往左第几位：个位先动、高位后跟，像机械表的进位 */
      place: props.digits - 1 - i,
      digit: char ? Number(char) : 0,
      on: char !== undefined,
    }
  })
})

/** rpx 只出现在具体属性里，不进自定义属性：微信对 var() 里的 rpx 换不换算没有保证 */
const colStyle = computed(() => ({
  width: `${fontSize.value * 0.62}rpx`,
  height: `${fontSize.value * 1.5}rpx`,
  fontSize: `${fontSize.value}rpx`,
}))
</script>

<template>
  <view class="roll">
    <view
      v-for="cell in cells"
      :key="cell.place"
      class="roll-col"
      :class="cell.on ? 'roll-col--on' : ''"
      :style="colStyle"
    >
      <view
        class="roll-strip"
        :style="{
          transform: `translateY(${-cell.digit * 10}%)`,
          transitionDelay: `${cell.place * 45}ms`,
        }"
      >
        <view v-for="n in 10" :key="n" class="roll-digit">
          <text>{{ n - 1 }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.roll {
  display: flex;
  align-items: center;
}

.roll-col {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  /* 首位是空格列时整列淡出，占位还在，后面的数字不会跳位置 */
  opacity: 0;
  transition: opacity 260ms var(--settle);
}

.roll-col--on {
  opacity: 1;
}

.roll-strip {
  display: flex;
  flex-direction: column;
  /*
   * 1000% 是十格的总高：列高由 inline 给了具体值，百分比在这里算得出来。
   * 一格正好等于窗口高，窗口里就不会露出下一格的字头。
   */
  height: 1000%;
  will-change: transform;
  transition: transform 620ms var(--settle);
}

.roll-digit {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  height: 10%;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .roll-strip {
    transition: none;
  }
}
</style>
