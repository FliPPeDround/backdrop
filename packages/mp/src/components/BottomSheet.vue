<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

// 面板常驻，用 visibility 控制命中测试：这样开合都是同一条可打断的过渡曲线
const contentMounted = ref(props.open)

watch(() => props.open, (isOpen) => {
  if (isOpen)
    contentMounted.value = true
})

function stop() {}
</script>

<template>
  <view class="mask" :class="{ 'mask--on': props.open }" @tap="emit('close')">
    <view class="frost" />
    <view class="sheet" :class="{ 'sheet--on': props.open }" @tap.stop="stop">
      <view class="grabber" />
      <view v-if="contentMounted">
        <view class="head">
          <text class="head-title">{{ props.title }}</text>
          <view class="head-actions">
            <slot name="action" />
          </view>
        </view>
        <slot />
      </view>
    </view>
  </view>
</template>

<style scoped>
/*
 * 遮罩只管命中和可见性；压暗 + 磨砂交给下面那层 .frost。
 * visibility 的延迟保留：关闭时面板滑完再交出命中区。
 */
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  visibility: hidden;
  transition: visibility 0s linear 420ms;
}

.mask--on {
  visibility: visible;
  transition: visibility 0s;
}

/*
 * 磨砂单独一层，而且这层自己绝不被动画推着走：
 * backdrop-filter 挂在 transform 动画中的元素上，合成器会复用上一次采样的快照，
 * 而那次采样时面板还在屏幕外 —— 表现就是面板先透明、落位后才突然变玻璃。
 * 模糊半径本身可以过渡（材质「凝出来」而不是凭空出现），位移交给面板。
 * 压暗也放这层：整屏一起糊，才像 iOS 的模态。
 */
.frost {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(8, 7, 12, 0);
  backdrop-filter: blur(0px) saturate(180%);
  transition: background 420ms var(--spring), backdrop-filter 420ms var(--spring);
}

.mask--on .frost {
  background: rgba(8, 7, 12, 0.22);
  backdrop-filter: blur(30px) saturate(180%);
}

.sheet {
  position: relative;
  z-index: 1;
  max-height: 80vh;
  padding: 0 32rpx calc(28rpx + env(safe-area-inset-bottom));
  border-radius: 44rpx 44rpx 0 0;
  /*
   * 面板自己不再 backdrop-filter：背后的整屏已经被 .frost 糊过一遍，再糊一次只是白付钱。
   * 这里只留一层同色相的染色（和右侧胶囊一个家族 28,26,36）+ 亮顶边。
   */
  background: rgba(28, 26, 36, 0.55);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.28), 0 -20rpx 60rpx rgba(0, 0, 0, 0.4);
  transform: translateY(102%);
  transition: transform 480ms var(--spring);
  will-change: transform;
}

/* 老内核没有 backdrop-filter：两层都退回实色，别让图案直接透上来 */
@supports not (backdrop-filter: blur(1px)) {
  .mask--on .frost {
    background: rgba(8, 7, 12, 0.62);
  }

  .sheet {
    background: rgba(24, 22, 31, 0.96);
  }
}

.sheet--on {
  transform: translateY(0);
}

.grabber {
  width: 76rpx;
  height: 10rpx;
  margin: 16rpx auto 4rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.26);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 4rpx 24rpx;
}

.head-title {
  font-size: 34rpx;
  font-weight: 600;
  letter-spacing: -0.6rpx;
  color: var(--ink);
}

.head-actions {
  display: flex;
  align-items: center;
}

@media (prefers-reduced-motion: reduce) {
  .sheet {
    transition: none;
  }
}

/* 要求降低透明度时收成实色：毛玻璃是装饰，可读性不是 */
@media (prefers-reduced-transparency: reduce) {
  .frost,
  .mask--on .frost {
    background: rgba(8, 7, 12, 0.62);
    backdrop-filter: none;
  }

  .sheet {
    background: rgba(24, 22, 31, 0.98);
  }
}
</style>
