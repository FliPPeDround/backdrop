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
  <view class="mb-[28rpx]">
    <view v-if="props.title" class="mb-[12rpx] ml-[4rpx] text-[22rpx] font-600 tracking-[0.4rpx] text-ink-3">
      <text>{{ props.title }}</text>
    </view>
    <view
      class="relative p-[5rpx] rounded-full glass-inset"
    >
      <!-- 等宽分段，位移用百分比即可，无需量取节点位置 -->
      <view
        class="absolute top-[5rpx] bottom-[5rpx] left-[5rpx] rounded-full bg-white
          shadow-[0_4rpx_14rpx_rgba(0,0,0,0.3)] [transition:transform_440ms_var(--spring)]
          will-change-transform motion-reduce:transition-none"
        :style="{ width: `${100 / count}%`, transform: `translateX(${index * 100}%)` }"
      />
      <view class="relative flex">
        <view
          v-for="(item, i) in props.items"
          :key="item.id"
          class="flex flex-1 items-center justify-center py-[18rpx] press"
          hover-class="press--on"
          :hover-stay-time="60"
          @tap="emit('change', item.id)"
        >
          <text class="text-[24rpx] font-500 tracking-[0.2rpx] text-[rgba(255,255,255,0.7)] [transition:color_300ms_var(--spring)]" :class="i === index ? 'on:text-coal on:font-600' : ''">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
