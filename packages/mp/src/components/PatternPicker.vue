<script setup lang="ts">
import type { Pattern } from '@backdrop/data'
import type { PatternCategory, PatternColorChoice } from '@backdrop/shared'
import { computed } from 'vue'
import ColorPills from '@/components/ColorPills.vue'

const props = defineProps<{
  categories: readonly { id: PatternCategory, label: string }[]
  activeCategory: PatternCategory
  colors: readonly PatternColorChoice[]
  activeColor: string
  patterns: readonly Pattern[]
  activeId: string
  hasMore: boolean
  empty: boolean
}>()

const emit = defineEmits<{
  'change-category': [id: PatternCategory]
  'change-color': [id: string]
  'pick': [pattern: Pattern]
  'load-more': []
}>()

// 逐个错开入场，但只错开前 12 个，避免长列表尾部等待
function delayOf(index: number) {
  return `${Math.min(index, 12) * 26}ms`
}

/**
 * 分类本身有货、只是被色系筛空的时候，别让人以为收藏丢了 ——
 * 色系是可逆的一步，得说清空的是哪一层。
 */
const emptyText = computed(() => {
  const inCategory = props.colors[0]?.count ?? 0
  return inCategory > 0
    ? '这个色系下暂时没有，换个色系看看'
    : '还没有收藏的背景，点右下角星星试试'
})

function pickCategory(id: string) {
  emit('change-category', id as PatternCategory)
}
</script>

<template>
  <view>
    <!-- 左右让 14rpx 和卡片对齐；分类行和列表之间的间距由 Switcher 自己的 margin 负责 -->
    <view class="px-[14rpx]">
      <Switcher
        :items="categories"
        :active="activeCategory"
        @change="pickCategory"
      />
    </view>

    <!--
      两个筛选轴都留在面板顶部常驻：色系是第二个轴，
      跟着列表滚走的话，滑到一半想换个色还得先滑回顶。
    -->
    <view class="px-[14rpx]">
      <ColorPills :items="colors" :active="activeColor" @change="emit('change-color', $event)" />
    </view>

    <scroll-view
      class="max-h-[54vh]"
      scroll-y
      enhanced
      :show-scrollbar="false"
      :lower-threshold="160"
      @scrolltolower="emit('load-more')"
    >
      <!--
        选中环是外扩的 box-shadow（7rpx），而 scroll-view 会按自己的边界裁切，
        首行/首尾列的卡片环会被切平，所以先让出 14rpx 给环。
      -->
      <view v-if="!empty" class="flex flex-wrap justify-between px-[14rpx] pt-[14rpx]">
        <!-- 选中态：卡片本身是白的，白描边会直接融进去，所以先用一层面板色做间隙，再描白环 -->
        <view
          v-for="(pattern, i) in patterns"
          :key="pattern.id"
          class="relative flex flex-col overflow-hidden w-[31.5%] h-[156rpx] mb-[18rpx] rounded-[20rpx] press
            bg-white shadow-[0_6rpx_18rpx_rgba(0,0,0,0.28)]
            animate-cell-in will-change-transform,opacity motion-reduce:animate-none"
          :class="pattern.id === activeId
            ? 'on:shadow-[0_0_0_3rpx_#18161f,0_0_0_7rpx_#fff,0_12rpx_28rpx_rgba(0,0,0,0.4)]'
            : ''"
          :style="{ animationDelay: delayOf(i) }"
          hover-class="press--on"
          :hover-stay-time="60"
          @tap="emit('pick', pattern)"
        >
          <PatternSurface :pattern="pattern" />
          <text class="absolute right-0 bottom-0 left-0 z-1 px-[12rpx] pt-[22rpx] pb-[10rpx] overflow-hidden text-[19rpx] font-500 text-white whitespace-nowrap text-ellipsis text-shadow-[0_1rpx_4rpx_rgba(0,0,0,0.5)] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_100%)]">{{ pattern.name }}</text>
          <view
            v-if="pattern.id === activeId"
            class="absolute top-[10rpx] right-[10rpx] z-1 w-[16rpx] h-[16rpx] rounded-full
              bg-white shadow-[0_0_0_4rpx_rgba(0,0,0,0.22)]"
          />
        </view>
      </view>

      <text v-else class="block py-[72rpx] text-[26rpx] text-center text-ink-2">{{ emptyText }}</text>

      <text v-if="hasMore" class="block pt-[8rpx] pb-[20rpx] text-[22rpx] text-center text-ink-3">继续下滑</text>
    </scroll-view>
  </view>
</template>
