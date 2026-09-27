<script setup lang="ts">
import type { CodeStyleId, FrameworkId, Pattern } from '@backdrop/data'
import { generatePatternCode, PATTERN_CODE_STYLES, PATTERN_FRAMEWORKS } from '@backdrop/data'
import { computed, ref } from 'vue'

const props = defineProps<{
  pattern: Pattern
}>()

const framework = ref<FrameworkId>('weixin')
const codeStyle = ref<CodeStyleId>('inline')

const files = computed(() =>
  generatePatternCode(props.pattern, framework.value, codeStyle.value),
)

function pickFramework(id: string) {
  framework.value = id as FrameworkId
}

function pickCodeStyle(id: string) {
  codeStyle.value = id as CodeStyleId
}

function lines(code: string) {
  return code.split('\n').length
}

function copy(code: string) {
  uni.setClipboardData({
    data: code,
    success: () => {
      // 微信自带一个「内容已复制」toast，盖掉它才能显示自己的提示
      uni.hideToast()
      uni.showToast({ title: '代码已复制', icon: 'none' })
      uni.vibrateShort()
    },
  })
}
</script>

<template>
  <view>
    <Switcher
      title="目标框架"
      :items="PATTERN_FRAMEWORKS"
      :active="framework"
      @change="pickFramework"
    />
    <Switcher
      title="代码风格"
      :items="PATTERN_CODE_STYLES"
      :active="codeStyle"
      @change="pickCodeStyle"
    />

    <view
      v-for="file in files"
      :key="file.filename"
      class="flex items-center justify-between mb-[16rpx] px-[28rpx] py-[26rpx] rounded-[24rpx] press
        bg-[rgba(255,255,255,0.07)] shadow-[inset_0_1rpx_0_rgba(255,255,255,0.08)]"
      hover-class="press--on"
      :hover-stay-time="60"
      @tap="copy(file.code)"
    >
      <view class="min-w-0">
        <view class="text-[28rpx] font-500 tracking-[-0.2rpx] text-ink">
          <text>{{ file.filename }}</text>
        </view>
        <view class="mt-[6rpx] text-[21rpx] text-ink-3">
          <text>{{ lines(file.code) }} 行 · {{ file.lang === 'css' ? '样式' : file.lang === 'html' ? '模板' : '脚本' }}</text>
        </view>
      </view>
      <view class="px-[30rpx] py-[12rpx] rounded-full bg-white">
        <text class="text-[24rpx] font-600 text-coal">复制</text>
      </view>
    </view>
  </view>
</template>
