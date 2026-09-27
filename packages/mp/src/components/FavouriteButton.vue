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
  <!--
    材质跟右侧轨道的胶囊同一份（glass-dark）：两颗浮在图案上的控件不该一个是磨砂一个是实底。
    代价是白线在近白图案上读不强，所以线本身留了 0.86 的白，靠这一层深色玻璃托着。
    收藏态在同一份材质里往上加（更实一点），不换成另一种深色重底。
  -->
  <view
    class="flex items-center justify-center w-[92rpx] h-[92rpx] rounded-full glass-dark
      pointer-events-auto press"
    :class="active ? 'on:bg-[rgba(28,26,36,0.42)] on:reduce-transparency:bg-[rgba(28,26,36,0.82)]' : ''"
    hover-class="press--on"
    :hover-stay-time="60"
    @tap.stop="toggle"
  >
    <!--
      图标走项目自己的 UnoCSS 图标系统（@iconify-json/carbon），和 web 端卡片上的收藏是同一对：
      i-carbon-star / i-carbon-star-filled。不自己画，也不再用字体星号 ——
      颜色、线宽、外形都跟着图标集走，改图标集就两边一起变。
      没收藏是半透明白的描边星，收藏了换成实心星并转琥珀 —— 形状和颜色一起变，
      再加下面那一下弹跳和按钮本身变实，三处一起说同一句话。
    -->
    <view
      :key="bumps"
      class="text-[30rpx] text-[rgba(255,255,255,0.86)] [transition:color_300ms_var(--settle)]"
      :class="[
        active ? 'i-carbon-star-filled on:text-star' : 'i-carbon-star',
        bumps > 0 ? 'animate-bump motion-reduce:animate-none' : '',
      ]"
    />
  </view>
</template>
