<script setup lang="ts">
import type { CodeStyleId, FrameworkId, Pattern } from '@backdrop/data'
import { generatePatternCode, PATTERN_CODE_STYLES, PATTERN_FRAMEWORKS } from '@backdrop/data'
import Code from '@uni-helper/highlight'
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
 * 字号和行高写在组件标签上：小程序端这两个属性是继承进组件内部的，
 * 组件自己不写死字号，外面给多少就渲染多少。
 * 行高写成字符串 —— 数字会被拼成 1.7px，整块代码会挤成一条线。
 */
const codeTypography = { fontSize: '24rpx', lineHeight: '1.7' }

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
      这一列不滚：面板上下就这么多东西，滚起来只会让两个切换器钉在原地、列表自己跑，
      手指到底在滚哪一层也说不清。要滚的地方只有一处 —— 代码块内部（见下）。
    -->
    <view>
      <view v-for="file in files" :key="file.filename" class="mb-[16rpx]">
        <view
          class="flex items-center justify-between px-[28rpx] py-[26rpx] rounded-[24rpx] press
            bg-[rgba(255,255,255,0.07)] shadow-[inset_0_1rpx_0_rgba(255,255,255,0.08)]"
          hover-class="press--on"
          :hover-stay-time="60"
          @tap="toggle(file.filename)"
        >
          <view class="min-w-0">
            <view class="text-[28rpx] font-500 tracking-[-0.2rpx] text-ink">
              <text>{{ file.filename }}</text>
            </view>
            <view class="mt-[6rpx] text-[21rpx] text-ink-3">
              <text>{{ lines(file.code) }} 行 · {{ kindLabel(file.lang) }}</text>
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
              :class="file.filename === openFile ? 'on:rotate-0 on:text-ink-2' : 'on:-rotate-90'"
            />
            <view
              class="px-[30rpx] py-[12rpx] rounded-full bg-white press"
              hover-class="press--on"
              :hover-stay-time="60"
              @tap.stop="copy(file.code)"
            >
              <text class="text-[24rpx] font-600 text-coal">复制</text>
            </view>
          </view>
        </view>

        <!--
          展开用网格行的 0fr → 1fr，而不是把高度写死：
          行高由内容自己撑，所以「这块代码有多高」根本不用知道 ——
          跨组件去量高度那件事可以整件不做，<Code> 也就用得回来了。
          矮了就撑多高算多高，高了在下面那块里滚。
        -->
        <view
          class="grid [grid-template-rows:0fr] [transition:grid-template-rows_420ms_var(--spring)]
            motion-reduce:transition-none"
          :class="file.filename === openFile ? 'on:[grid-template-rows:1fr]' : ''"
        >
          <!-- min-h-0 是必需的：网格项默认不肯缩到内容以下，0fr 就压不成 0 -->
          <view class="min-h-0 overflow-hidden">
            <view class="pt-[16rpx]">
              <!--
                代码落在和分段控件轨道同一块浅色内嵌玻璃上（glass-inset）：
                面板上只有一种玻璃，代码不像贴上去的另一套东西。
              -->
              <view
                class="overflow-hidden font-mono rounded-[24rpx] px-[26rpx] py-[22rpx] glass-inset"
              >
                <!--
                  超过这个高度就在块内滚，没超过就自动撑开 ——
                  上限 = 面板的 80vh 减掉它上下那些固定部分，剩下的才是代码能用的高度：
                  标题、两组切换器、文件行加起来 676rpx（两个文件行时最高），
                  再加代码块自己的间距与内边距 60rpx，以及底部安全区。
                  减干净之后面板永远刚好装得下，于是全页只有这一处会滚。
                -->
                <scroll-view
                  scroll-y
                  enhanced
                  :show-scrollbar="false"
                  class="max-h-[calc(80vh_-_736rpx_-_env(safe-area-inset-bottom))]"
                >
                  <Code
                    :code="file.code"
                    :lang="file.lang"
                    :theme="codeTheme"
                    :wrap="false"
                    :tab-size="2"
                    :show-line-numbers="true"
                    :style="codeTypography"
                  />
                </scroll-view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style>
/*
 * H5 / App 上组件根节点自带 13px 字号，标签上的 inline style 落在宿主节点上、
 * 盖不住它内部这条规则，代码会小得读不动。小程序端没有这个问题（字号是继承进去的），
 * 所以这段只在 H5 / App 编译进去。
 */
/* #ifdef H5 || APP-PLUS */
.uh-highlight {
  font-size: 24rpx;
  line-height: 1.7;
}
/* #endif */
</style>
