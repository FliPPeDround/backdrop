<script setup lang="ts">
import type { Pattern } from '@backdrop/data'
import type { PatternCategory } from '@backdrop/shared'

defineProps<{
  categories: readonly { id: PatternCategory, label: string }[]
  activeCategory: PatternCategory
  patterns: readonly Pattern[]
  activeId: string
  hasMore: boolean
  empty: boolean
}>()

const emit = defineEmits<{
  'change-category': [id: PatternCategory]
  'pick': [pattern: Pattern]
  'load-more': []
}>()

// 逐个错开入场，但只错开前 12 个，避免长列表尾部等待
function delayOf(index: number) {
  return `${Math.min(index, 12) * 26}ms`
}

function pickCategory(id: string) {
  emit('change-category', id as PatternCategory)
}
</script>

<template>
  <view class="picker">
    <view class="tabs-slot">
      <Switcher
        :items="categories"
        :active="activeCategory"
        @change="pickCategory"
      />
    </view>

    <scroll-view
      class="scroller"
      scroll-y
      enhanced
      :show-scrollbar="false"
      :lower-threshold="160"
      @scrolltolower="emit('load-more')"
    >
      <view v-if="!empty" class="thumbs">
        <view
          v-for="(pattern, i) in patterns"
          :key="pattern.id"
          class="cell press"
          :class="pattern.id === activeId ? 'cell--on' : ''"
          :style="{ animationDelay: delayOf(i) }"
          hover-class="press--on"
          :hover-stay-time="60"
          @tap="emit('pick', pattern)"
        >
          <PatternSurface :pattern="pattern" />
          <text class="cell-name">{{ pattern.name }}</text>
          <view v-if="pattern.id === activeId" class="cell-dot" />
        </view>
      </view>

      <text v-else class="empty">还没有收藏的背景，点右下角星星试试</text>

      <text v-if="hasMore" class="hint">继续下滑</text>
    </scroll-view>
  </view>
</template>

<style scoped>
/* 左右让 14rpx 和卡片对齐；分类行和列表之间的间距由 Switcher 自己的 margin 负责 */
.tabs-slot {
  padding: 0 14rpx;
}

.scroller {
  max-height: 54vh;
}

.thumbs {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /*
   * 选中环是外扩的 box-shadow（7rpx），而 scroll-view 会按自己的边界裁切，
   * 首行/首尾列的卡片环会被切平，所以先让出 14rpx 给环。
   */
  padding: 14rpx 14rpx 0;
}

.cell {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 31.5%;
  height: 156rpx;
  margin-bottom: 18rpx;
  border-radius: 20rpx;
  /* 垫白底：带透明度的图案（蒙版、渐隐）在深色面板上会发闷，和 web 端卡片同一处理 */
  background: #fff;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.28);
  animation: cell-in 460ms var(--spring) both;
  will-change: transform, opacity;
}

@keyframes cell-in {
  from {
    opacity: 0;
    transform: translateY(18rpx) scale(0.94);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 卡片本身是白的，白描边会直接融进去：先用一层面板色做间隙，再描白环 */
.cell--on {
  box-shadow: 0 0 0 3rpx #18161f, 0 0 0 7rpx #fff, 0 12rpx 28rpx rgba(0, 0, 0, 0.4);
}

.cell-name {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  padding: 22rpx 12rpx 10rpx;
  font-size: 19rpx;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.5);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.55) 100%);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cell-dot {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  z-index: 1;
  width: 16rpx;
  height: 16rpx;
  border-radius: 999rpx;
  background: #fff;
  box-shadow: 0 0 0 4rpx rgba(0, 0, 0, 0.22);
}

.empty {
  display: block;
  padding: 72rpx 0;
  font-size: 26rpx;
  text-align: center;
  color: var(--ink-2);
}

.hint {
  display: block;
  padding: 8rpx 0 20rpx;
  font-size: 22rpx;
  text-align: center;
  color: var(--ink-3);
}

@media (prefers-reduced-motion: reduce) {
  .cell {
    animation: none;
  }
}
</style>
