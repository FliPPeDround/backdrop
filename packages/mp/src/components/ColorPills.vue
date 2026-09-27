<script setup lang="ts">
import type { PatternColorChoice } from '@backdrop/shared'
import { colorPaint } from '@/utils/color-paint'

defineProps<{
  items: readonly PatternColorChoice[]
  active: string
}>()

const emit = defineEmits<{
  change: [id: string]
}>()
</script>

<template>
  <scroll-view
    class="pills"
    scroll-x
    enhanced
    :show-scrollbar="false"
    :scroll-into-view="`color-${active}`"
    :scroll-with-animation="true"
  >
    <view class="track">
      <view
        v-for="item in items"
        :id="`color-${item.id}`"
        :key="item.id"
        class="pill press"
        :class="item.id === active ? 'pill--on' : ''"
        hover-class="press--on"
        :hover-stay-time="60"
        @tap="emit('change', item.id)"
      >
        <view class="pill-dot" :style="colorPaint(item)" />
        <text class="pill-label">{{ item.label }}</text>
        <text class="pill-count">{{ item.count }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped>
.pills {
  width: 100%;
  margin-bottom: 26rpx;
  white-space: nowrap;
}

.track {
  display: flex;
  padding: 0 4rpx;
}

/*
 * 选中态是白底黑字，和分类分段器同一个语言：一份实色给「已经选中」用，
 * 底下的暗轨给「还没选中」用，两者之间不留第三种状态。
 */
.pill {
  display: flex;
  align-items: center;
  flex: none;
  margin-right: 14rpx;
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.06);
  transition: background 320ms var(--spring), box-shadow 320ms var(--spring);
}

.pill--on {
  background: #fff;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.28);
}

.pill-dot {
  width: 16rpx;
  height: 16rpx;
  margin-right: 10rpx;
  border-radius: 999rpx;
  box-shadow: 0 0 0 2rpx rgba(8, 7, 12, 0.24);
}

.pill-label {
  font-size: 24rpx;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.74);
  transition: color 320ms var(--spring);
}

.pill-count {
  margin-left: 10rpx;
  font-size: 21rpx;
  font-variant-numeric: tabular-nums;
  color: var(--ink-3);
  transition: color 320ms var(--spring);
}

.pill--on .pill-label {
  font-weight: 600;
  color: #16141c;
}

.pill--on .pill-count {
  color: rgba(22, 20, 28, 0.5);
}
</style>
