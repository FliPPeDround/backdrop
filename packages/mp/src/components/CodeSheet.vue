<script setup lang="ts">
import type { CodeStyleId, FrameworkId, Pattern } from '@backdrop/data'
import { generatePatternCode, PATTERN_CODE_STYLES, PATTERN_FRAMEWORKS } from '@backdrop/data'
import { NBSP, tokenizeToLines } from '@uni-helper/highlight/tokenize'
import { computed, ref } from 'vue'
import { codeTheme } from '@/utils/code-theme'

const props = defineProps<{
  pattern: Pattern
}>()

const framework = ref<FrameworkId>('weixin')
const codeStyle = ref<CodeStyleId>('inline')

const files = computed(() =>
  generatePatternCode(props.pattern, framework.value, codeStyle.value),
)

/**
 * 展开的是哪一份文件，同时只开一块。收起是默认态：
 * 两块代码一起摊开，视线要在两段颜色里找落点，列表本身也被顶出可见区。
 */
const openFile = ref('')

/**
 * 行高是个死数，展开的高度就是从它乘出来的 —— 这也是这里不直接用 <Code> 组件的原因。
 * 组件把行高交给内容（换行、字号都可能改），块高就只能跨组件去量；
 * 而小程序上面板刚挂上来的那一帧，量到的常是 0×0，量不出真实高度。
 * 自己按 token 画之后，行数 × 行高就是块高，展开能精确地从 0 长到那一条线。
 */
const LINE_H = 40
const FONT_SIZE = 24
/** 代码块上下内边距，和模板里 py-[22rpx] 同源 */
const PAD_Y = 22
/** 代码块与上面那一行之间的间距，和模板里 pt-[16rpx] 同源 */
const GAP = 16

/**
 * 逐份文件把源码 token 化。词法分析、配色、空格的 NBSP 处理都还是
 * @uni-helper/highlight 那一套，只是渲染交回给自己：
 * 小程序端 <text> 里连续空格会被折叠，所以取的是 text 而不是 value。
 */
const blocks = computed(() => files.value.map((file) => {
  const lines = tokenizeToLines(file.code, { lang: file.lang, theme: codeTheme, tabSize: 2 })
  return {
    filename: file.filename,
    lang: file.lang,
    code: file.code,
    lines,
    /** 展开后的高度：行数 × 行高 + 上下内边距 + 与上一行之间的间距 */
    height: `${GAP + PAD_Y * 2 + lines.length * LINE_H}rpx`,
    /** 横向滚动区的高度：正好一行不多一行不少，多出来的那点基线间隙不该占地方 */
    bodyHeight: `${lines.length * LINE_H}rpx`,
  }
}))

function pickFramework(id: string) {
  framework.value = id as FrameworkId
}

function pickCodeStyle(id: string) {
  codeStyle.value = id as CodeStyleId
}

function toggle(filename: string) {
  openFile.value = openFile.value === filename ? '' : filename
}

function lines(code: string) {
  return code.split('\n').length
}

function kindLabel(lang: string) {
  return lang === 'css' ? '样式' : lang === 'html' ? '模板' : '脚本'
}

/** 颜色是内联写上去的：小程序端页面样式进不了组件内部，只能跟着 token 走 */
function tokenStyle(token: { color?: string }) {
  return token.color ? { color: token.color } : {}
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

    <!--
      代码能比一屏长，所以这一列自己滚，别去撑面板：面板高度上限是定死的，
      撑过头只会让最上面那截被裁掉。两个切换器留在面板上不跟着滚 ——
      换完框架想回头看代码，不该先滑回顶部。
    -->
    <scroll-view
      class="max-h-[40vh]"
      scroll-y
      enhanced
      :show-scrollbar="false"
    >
      <view v-for="block in blocks" :key="block.filename" class="mb-[16rpx]">
        <view
          class="flex items-center justify-between px-[28rpx] py-[26rpx] rounded-[24rpx] press
            bg-[rgba(255,255,255,0.07)] shadow-[inset_0_1rpx_0_rgba(255,255,255,0.08)]"
          hover-class="press--on"
          :hover-stay-time="60"
          @tap="toggle(block.filename)"
        >
          <view class="min-w-0">
            <view class="text-[28rpx] font-500 tracking-[-0.2rpx] text-ink">
              <text>{{ block.filename }}</text>
            </view>
            <view class="mt-[6rpx] text-[21rpx] text-ink-3">
              <text>{{ lines(block.code) }} 行 · {{ kindLabel(block.lang) }}</text>
            </view>
          </view>

          <view class="flex shrink-0 items-center">
            <!--
              展开指示：收起指右、展开落下。位置不动，只有角度在说状态 ——
              同一枚东西换了姿势，比多出一枚新图标更像「这块归你翻」。
            -->
            <view
              class="i-carbon-chevron-down mr-[16rpx] text-[30rpx] text-ink-3 will-change-transform
                [transition:transform_360ms_var(--spring),color_360ms_var(--spring)] motion-reduce:transition-none"
              :class="block.filename === openFile ? 'on:rotate-0 on:text-ink-2' : 'on:-rotate-90'"
            />
            <view
              class="px-[30rpx] py-[12rpx] rounded-full bg-white press"
              hover-class="press--on"
              :hover-stay-time="60"
              @tap.stop="copy(block.code)"
            >
              <text class="text-[24rpx] font-600 text-coal">复制</text>
            </view>
          </view>
        </view>

        <!--
          预览挂在被点的那一行下面：代码从它在列表里的位置长出来，而不是跑到面板另一头。
          高度是算出来的，收起写 0px，展开就是从 0 长到那一条线，回落也走同一个数。
        -->
        <view
          class="overflow-hidden [transition:height_420ms_var(--spring)] motion-reduce:transition-none"
          :style="{ height: block.filename === openFile ? block.height : '0px' }"
        >
          <view class="pt-[16rpx]">
            <!--
              代码不另起一层底色，就和分段控件的轨道用同一块浅色内嵌玻璃（glass-inset）：
              面板上从此只有一种玻璃，代码不再像贴上去的另一套东西。
              代价是亮度会跟着背后的图案走，token 的亮度就是照这个范围调的（见 code-theme）。
            -->
            <view
              class="overflow-hidden font-mono rounded-[24rpx] px-[26rpx] py-[22rpx] glass-inset"
            >
              <!--
                长行走横向滚动而不是折行：一折行，行数就不再等于行高，块高也就没得算了。
                行高钉死在每一行上，滚动区的高度正好是行数 × 行高。
              -->
              <scroll-view
                scroll-x
                enhanced
                :show-scrollbar="false"
                class="w-full [line-height:0]"
                :style="{ height: block.bodyHeight }"
              >
                <view class="inline-block align-top">
                  <view
                    v-for="line in block.lines"
                    :key="line.index"
                    class="whitespace-nowrap"
                    :style="{ height: `${LINE_H}rpx`, lineHeight: `${LINE_H}rpx`, fontSize: `${FONT_SIZE}rpx` }"
                  >
                    <text v-for="(token, i) in line.tokens" :key="i" :style="tokenStyle(token)">{{ token.text }}</text>
                    <text v-if="line.blank">{{ NBSP }}</text>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
