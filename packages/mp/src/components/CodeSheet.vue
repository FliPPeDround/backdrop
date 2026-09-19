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
  <view class="code-sheet">
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
      class="row press"
      hover-class="press--on"
      :hover-stay-time="60"
      @tap="copy(file.code)"
    >
      <view class="row-text">
        <view class="row-name">
          <text>{{ file.filename }}</text>
        </view>
        <view class="row-meta">
          <text>{{ lines(file.code) }} 行 · {{ file.lang === 'css' ? '样式' : file.lang === 'html' ? '模板' : '脚本' }}</text>
        </view>
      </view>
      <view class="row-btn">
        <text class="row-btn-text">复制</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
  padding: 26rpx 28rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.08);
}

.row-text {
  min-width: 0;
}

.row-name {
  font-size: 28rpx;
  font-weight: 500;
  letter-spacing: -0.2rpx;
  color: var(--ink);
}

.row-meta {
  margin-top: 6rpx;
  font-size: 21rpx;
  color: var(--ink-3);
}

.row-btn {
  padding: 12rpx 30rpx;
  border-radius: 999rpx;
  background: #fff;
}

.row-btn-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #16141c;
}
</style>
