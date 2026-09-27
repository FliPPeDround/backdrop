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
    class="w-full mb-[26rpx] whitespace-nowrap"
    scroll-x
    enhanced
    :show-scrollbar="false"
    :scroll-into-view="`color-${active}`"
    :scroll-with-animation="true"
  >
    <view class="flex px-[4rpx]">
      <view
        v-for="item in items"
        :id="`color-${item.id}`"
        :key="item.id"
        class="flex items-center flex-none mr-[14rpx] px-[22rpx] py-[12rpx] rounded-full
          bg-[rgba(255,255,255,0.08)] shadow-[inset_0_1rpx_0_rgba(255,255,255,0.06)]
          [transition:background_320ms_var(--spring),box-shadow_320ms_var(--spring)]"
        :class="item.id === active ? 'on:bg-white on:shadow-[0_6rpx_18rpx_rgba(0,0,0,0.28)]' : ''"
        hover-class="press--on"
        :hover-stay-time="60"
        @tap="emit('change', item.id)"
      >
        <view
          class="w-[16rpx] h-[16rpx] mr-[10rpx] rounded-full shadow-[0_0_0_2rpx_rgba(8,7,12,0.24)]"
          :style="colorPaint(item)"
        />
        <text class="text-[24rpx] font-500 text-[rgba(255,255,255,0.74)] [transition:color_320ms_var(--spring)]" :class="item.id === active ? 'on:text-coal on:font-600' : ''">{{ item.label }}</text>
        <text class="ml-[10rpx] text-[21rpx] tabular-nums text-ink-3 [transition:color_320ms_var(--spring)]" :class="item.id === active ? 'on:text-[rgba(22,20,28,0.5)]' : ''">{{ item.count }}</text>
      </view>
    </view>
  </scroll-view>
</template>
