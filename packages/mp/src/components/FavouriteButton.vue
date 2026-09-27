<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFavourites } from '@/composables/favourites'

const props = defineProps<{
  patternId: string
  /** 父层也可以让书签弹一下（背景上双击收藏）：同一个状态变化，两个入口要给同一种回应 */
  signal?: number
}>()

const emit = defineEmits<{
  change: [favourite: boolean]
}>()

const { isFavourite, toggleFavourite } = useFavourites()
const active = computed(() => isFavourite(props.patternId))
const bumps = ref(0)

// 换 key 让节点重建，弹出动画每次都能从头播
function bump() {
  bumps.value += 1
}

watch(() => props.signal, (next) => {
  if (next)
    bump()
})

function toggle() {
  const next = !active.value
  toggleFavourite(props.patternId)
  bump()
  uni.vibrateShort()
  emit('change', next)
}
</script>

<template>
  <view class="fav press" :class="{ 'fav--on': active }" hover-class="press--on" :hover-stay-time="60" @tap.stop="toggle">
    <!--
      图标走项目自己的 UnoCSS 图标系统（@iconify-json/carbon），和 web 端卡片上的收藏是同一对：
      i-carbon-star / i-carbon-star-filled。不自己画，也不再用字体星号 ——
      颜色、线宽、外形都跟着图标集走，改图标集就两边一起变。
    -->
    <view
      :key="bumps"
      class="mark"
      :class="[active ? 'i-carbon-star-filled' : 'i-carbon-star', bumps > 0 ? 'mark--bump' : '']"
    />
  </view>
</template>

<style scoped>
/*
 * 材质跟右侧轨道的胶囊同一份：rgba(28,26,36,0.26) + blur(18px) saturate(160%)，
 * 亮顶边和落影也照抄，两颗浮在图案上的控件不该一个是磨砂一个是实底。
 * 代价是白线在近白图案上读不强，所以线本身留了 0.86 的白，靠这一层深色玻璃托着。
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

/*
 * 图标本体由图标集出（宽度就是 1em），这里只管大小和颜色：
 * 没收藏是半透明白的描边星，收藏了换成实心星并转琥珀 —— 形状和颜色一起变，
 * 再加下面那一下弹跳和按钮本身变实，三处一起说同一句话。
 */
.mark {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.86);
  transition: color 300ms var(--settle);
}

.fav--on .mark {
  color: #ffd97a;
}

.mark--bump {
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
  .mark--bump {
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
