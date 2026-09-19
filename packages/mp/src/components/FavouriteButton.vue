<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFavourites } from '@/composables/favourites'

const props = defineProps<{
  patternId: string
}>()

const emit = defineEmits<{
  change: [favourite: boolean]
}>()

const { isFavourite, toggleFavourite } = useFavourites()
const active = computed(() => isFavourite(props.patternId))
const bumps = ref(0)

function toggle() {
  const next = !active.value
  toggleFavourite(props.patternId)
  // 换 key 让节点重建，弹出动画每次都能从头播
  bumps.value += 1
  uni.vibrateShort()
  emit('change', next)
}
</script>

<template>
  <view class="fav press" :class="{ 'fav--on': active }" hover-class="press--on" :hover-stay-time="60" @tap.stop="toggle">
    <text :key="bumps" class="fav-icon" :class="{ 'fav-bump': bumps > 0 }">{{ active ? '★' : '☆' }}</text>
  </view>
</template>

<style scoped>
/*
 * 材质跟右侧轨道的胶囊同一份：rgba(28,26,36,0.26) + blur(18px) saturate(160%)，
 * 亮顶边和落影也照抄，两颗浮在图案上的控件不该一个是磨砂一个是实底。
 * 代价是白星在近白图案上只剩 1.7:1，靠贴身阴影把字形从浅底上抠出来。
 */
.fav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92rpx;
  height: 92rpx;
  border-radius: 999rpx;
  background: rgba(28, 26, 36, 0.26);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.22), 0 8rpx 24rpx rgba(8, 7, 12, 0.18);
  backdrop-filter: blur(18px) saturate(160%);
  /* dock 整条是 pointer-events: none 让起手势不受底边遮挡，按钮自己把触摸收回来 */
  pointer-events: auto;
}

/* 收藏态仍然要更“实”一点，但留在同一份材质里往上加，不换成另一种深色重底 */
.fav--on {
  background: rgba(28, 26, 36, 0.42);
}

/* 材质收成 0.26 之后白星在近白图案上只剩 1.7:1，靠一圈贴身暗边把字形抠出来 */
.fav-icon {
  font-size: 38rpx;
  line-height: 1;
  color: #fff;
  text-shadow: 0 0 3rpx rgba(8, 7, 12, 0.75), 0 2rpx 12rpx rgba(8, 7, 12, 0.35);
}

.fav--on .fav-icon {
  color: #ffd97a;
}

.fav-bump {
  animation: bump 460ms var(--spring) both;
}

@keyframes bump {
  0% {
    transform: scale(0.6);
  }
  45% {
    transform: scale(1.28);
  }
  100% {
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fav-bump {
    animation: none;
  }
}

/* 要求降低透明度时收成实色：这层材质全靠 backdrop-filter 撑着，去掉模糊就得自己压住底 */
@media (prefers-reduced-transparency: reduce) {
  .fav {
    background: rgba(28, 26, 36, 0.72);
    backdrop-filter: none;
  }

  .fav--on {
    background: rgba(28, 26, 36, 0.82);
  }
}
</style>
