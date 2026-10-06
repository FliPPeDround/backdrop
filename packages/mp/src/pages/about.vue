<script setup lang="ts">
import { gridPatterns } from '@backdrop/data'
import { onLoad, onReady, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '关于',
  },
})

/**
 * 版本号只在这里读一次，和 manifest.config.ts 的 versionName 对齐。
 * 不去问 uni.getAccountInfoSync()：开发工具和体验版给出来的是 0.0.0，
 * 「关于」页上挂一个错版本号，比不挂更糟。
 */
const VERSION = '1.0.0'
const patternCount = gridPatterns.length

// 先按「没入场」的样子渲染，首帧落定后再翻一次：位移和淡入才是过渡出来的，不是直接摆上去的
const revealed = ref(false)
onReady(() => {
  revealed.value = true
})

/*
 * 入场延迟写进 transition 简写里，而不是单独一条 transition-delay ——
 * 简写会把延迟重置回 0，两条分开写谁压谁就全看 WXSS 的输出顺序了。
 * 每一档都写成字面量类名：UnoCSS 扫的是源码文本，拼出来的字符串它扫不到。
 */
const RISE = [
  '[transition:opacity_520ms_var(--settle)_60ms,transform_520ms_var(--settle)_60ms]',
  '[transition:opacity_520ms_var(--settle)_115ms,transform_520ms_var(--settle)_115ms]',
  '[transition:opacity_520ms_var(--settle)_170ms,transform_520ms_var(--settle)_170ms]',
  '[transition:opacity_520ms_var(--settle)_225ms,transform_520ms_var(--settle)_225ms]',
  '[transition:opacity_520ms_var(--settle)_280ms,transform_520ms_var(--settle)_280ms]',
]

/**
 * 一组的入场：往下错开一档起手，整体像一页展签被逐行读出来。
 * 降动效时不位移，只把那 520ms 收成一次短淡入 —— 内容仍要交代「这里换了东西」，
 * 但不该有东西在眼前挪。
 */
function rise(index: number) {
  return [
    RISE[index] ?? '',
    'motion-reduce:transition-[opacity] motion-reduce:transform-none',
    revealed.value ? 'on:opacity-100 on:translate-y-0' : 'opacity-0 translate-y-[22rpx]',
  ]
}

interface AboutRow {
  /** 这一行是什么 */
  label: string
  /** 行里显示的那串字，通常是链接去掉协议头之后的样子 */
  note: string
  /** 点一下复制走的东西 */
  value: string
  /** 复制之后的回执：说清刚拿走的是哪一样 */
  toast: string
}

interface AboutGroup {
  title: string
  /** 这一组想说的话，一行一句 */
  blurbs: string[]
  rows: AboutRow[]
}

const REPO = 'https://github.com/FliPPeDround/backdrop'

const GROUPS: AboutGroup[] = [
  {
    title: '项目',
    blurbs: [
      '这个位置看到的就是真机效果：图案铺满一屏，复制走的代码粘进项目，渲染出来也是这一屏。',
      '渐变、几何、装饰、效果都在这里，全是纯样式 —— 没有图片请求，也不用操心商用授权。',
    ],
    rows: [],
  },
  {
    title: '开源',
    blurbs: ['MIT 协议，个人项目、公司项目都能用，保留版权声明就行。'],
    rows: [
      {
        label: '源码仓库',
        note: 'github.com/FliPPeDround/backdrop',
        value: REPO,
        toast: '仓库链接已复制',
      },
      {
        label: '开源协议',
        note: 'MIT License',
        value: `${REPO}/blob/main/LICENSE`,
        toast: '协议链接已复制',
      },
      {
        label: '在线预览',
        note: 'mpbackdrop.netlify.app',
        value: 'https://mpbackdrop.netlify.app/',
        toast: '网站链接已复制',
      },
    ],
  },
  {
    title: '作者',
    blurbs: ['Backdrop 由 FliPPeDround 开发和维护，图案库还在陆续更新。'],
    rows: [
      {
        label: '作者',
        note: 'FliPPeDround',
        value: 'https://github.com/FliPPeDround',
        toast: '主页链接已复制',
      },
      {
        label: '邮箱',
        note: '734243792@qq.com',
        value: '734243792@qq.com',
        toast: '邮箱已复制',
      },
    ],
  },
  {
    title: '致谢',
    blurbs: ['部分背景样式的灵感来自 pattern-craft，感谢原作者 megh-bari。'],
    rows: [
      {
        label: 'pattern-craft',
        note: 'github.com/megh-bari/pattern-craft',
        value: 'https://github.com/megh-bari/pattern-craft',
        toast: '链接已复制',
      },
    ],
  },
]

/**
 * 小程序里没有「打开外链」这回事，链接只能先复制走。
 * 回执用微信自带的复制 toast 会撞在一起，先盖掉再显示自己的那一条。
 */
function copy(row: AboutRow) {
  uni.setClipboardData({
    data: row.value,
    success: () => {
      uni.hideToast()
      uni.showToast({ title: row.toast, icon: 'none' })
      uni.vibrateShort()
    },
  })
}

onLoad(() => {
  // 朋友圈那个入口只有微信有；H5 预览上这个 API 不存在，直接调用会抛错
  // #ifdef MP-WEIXIN
  uni.showShareMenu({ withShareTicket: false, menus: ['shareAppMessage', 'shareTimeline'] })
  // #endif
})

// 「关于」被转发出去时，接收的人该落到背景库，而不是停在说明书上
onShareAppMessage(() => ({
  title: 'Backdrop · 为小程序打造的开箱即用背景图案库',
  path: '/pages/index',
}))

onShareTimeline(() => ({
  title: 'Backdrop · 为小程序打造的开箱即用背景图案库',
  query: '',
}))
</script>

<template>
  <view class="min-h-100vh px-[36rpx] pt-[44rpx] pb-[calc(72rpx_+_env(safe-area-inset-bottom))] bg-coal">
    <!--
      首屏是首页页头那一行的放大版：同一枚标形、同一根发丝线、同一行带行标的读数。
      点进来的地方和落下来的地方长得一样，这一页才像那一行展开，而不是另开的一页。
      入场走 materialize —— 图案在首页是这么显影的，标形在这里也用同一条。
    -->
    <view class="flex items-center animate-materialize motion-reduce:animate-fade-in">
      <BrandMark size="lg" />
      <text class="text-[52rpx] font-700 tracking-[-1.2rpx] text-white">Backdrop</text>
    </view>

    <view class="relative h-[12rpx] mt-[26rpx]">
      <!-- 发丝线：2rpx 在 2 倍屏上正好一个物理像素，和首页页头是同一根 -->
      <view
        class="absolute top-[5rpx] right-0 left-0 h-[2rpx]
          bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.08)_62%,rgba(255,255,255,0)_100%)]"
      />
    </view>

    <!-- 版本、协议、库的规模：一页说明里最该先被读到的那三个事实 -->
    <view class="flex items-center mt-[28rpx] text-[23rpx] tracking-[0.6rpx] text-ink-2">
      <view class="w-[2rpx] h-[22rpx] mr-[14rpx] bg-[rgba(255,255,255,0.42)]" />
      <text class="font-600">v{{ VERSION }}</text>
      <text class="mx-[10rpx] text-ink-3">·</text>
      <text class="text-[rgba(255,255,255,0.92)]">MIT License</text>
      <text class="mx-[10rpx] text-ink-3">·</text>
      <text class="text-[rgba(255,255,255,0.92)]">{{ patternCount }} 个图案</text>
    </view>

    <view class="mt-[26rpx] text-[30rpx] leading-[1.6] text-ink-2">
      <text>为小程序打造的开箱即用背景图案库</text>
    </view>

    <view
      v-for="(group, g) in GROUPS"
      :key="group.title"
      class="mt-[52rpx]"
      :class="rise(g)"
    >
      <!-- 组标沿用首页读数行的行标：一根竖线加一行字，两页的「小标题」是同一种东西 -->
      <view class="flex items-center mb-[18rpx]">
        <view class="w-[2rpx] h-[22rpx] mr-[14rpx] bg-[rgba(255,255,255,0.42)]" />
        <text class="text-[23rpx] font-600 tracking-[0.6rpx] text-ink-2">{{ group.title }}</text>
      </view>

      <view
        v-for="line in group.blurbs"
        :key="line"
        class="mb-[12rpx] text-[27rpx] leading-[1.72] text-ink-2"
      >
        <text>{{ line }}</text>
      </view>

      <!--
        每一行自己一张卡，和「复制代码」面板里的文件行同一种面：
        rgba(255,255,255,0.07) 加一道内高光，行与行之间靠间距成组，不靠分隔线。
      -->
      <view
        v-for="row in group.rows"
        :key="row.label"
        class="flex items-center justify-between mt-[16rpx] px-[28rpx] py-[26rpx] rounded-[24rpx] press
          bg-[rgba(255,255,255,0.07)] shadow-[inset_0_1rpx_0_rgba(255,255,255,0.08)]"
        hover-class="press--on"
        :hover-stay-time="60"
        @tap="copy(row)"
      >
        <view class="min-w-0 flex-1 mr-[22rpx]">
          <view class="text-[27rpx] font-500 tracking-[-0.2rpx] text-ink">
            <text>{{ row.label }}</text>
          </view>
          <view class="mt-[8rpx] truncate text-[21rpx] text-ink-3">
            <text>{{ row.note }}</text>
          </view>
        </view>
        <!-- 整行只有「复制」一个动作，右侧就用同一枚图标说同一句话 -->
        <view class="i-carbon-copy flex-none text-[30rpx] text-[rgba(255,255,255,0.56)]" />
      </view>
    </view>

    <view class="mt-[64rpx] text-center" :class="rise(4)">
      <text class="text-[22rpx] leading-[1.8] text-ink-3">如果它帮到了你，欢迎到 GitHub 点个 Star。</text>
    </view>
  </view>
</template>
