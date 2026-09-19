<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** 不传就不渲染标题行（分类切换这种自身可读的场合） */
  title?: string
  items: readonly { id: string, label: string }[]
  active: string
}>()

const emit = defineEmits<{
  change: [id: string]
}>()

const count = computed(() => props.items.length || 1)
const index = computed(() => {
  const found = props.items.findIndex(item => item.id === props.active)
  return found < 0 ? 0 : found
})
</script>

<template>
  <view class="seg">
    <view v-if="props.title" class="seg-label">
      <text>{{ props.title }}</text>
    </view>
    <view class="seg-track">
      <!-- 等宽分段，位移用百分比即可，无需量取节点位置 -->
      <view
        class="seg-thumb"
        :style="{ width: `${100 / count}%`, transform: `translateX(${index * 100}%)` }"
      />
      <view class="seg-items">
        <view
          v-for="(item, i) in props.items"
          :key="item.id"
          class="seg-item press"
          hover-class="press--on"
          :hover-stay-time="60"
          @tap="emit('change', item.id)"
        >
          <text class="seg-text" :class="i === index ? 'seg-text--on' : ''">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.seg {
  margin-bottom: 28rpx;
}

.seg-label {
  margin-bottom: 12rpx;
  margin-left: 4rpx;
  font-size: 22rpx;
  font-weight: 600;
  letter-spacing: 0.4rpx;
  color: var(--ink-3);
}

.seg-track {
  position: relative;
  padding: 5rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.09);
  box-shadow: inset 0 1rpx 3rpx rgba(0, 0, 0, 0.28);
}

.seg-thumb {
  position: absolute;
  top: 5rpx;
  bottom: 5rpx;
  left: 5rpx;
  border-radius: 999rpx;
  background: #fff;
  box-shadow: 0 4rpx 14rpx rgba(0, 0, 0, 0.3);
  transition: transform 440ms var(--spring);
  will-change: transform;
}

.seg-items {
  position: relative;
  display: flex;
}

.seg-item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 18rpx 0;
}

.seg-text {
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.2rpx;
  color: rgba(255, 255, 255, 0.7);
  transition: color 300ms var(--spring);
}

.seg-text--on {
  color: #16141c;
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .seg-thumb {
    transition: none;
  }
}
</style>
