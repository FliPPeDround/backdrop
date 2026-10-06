import { presetUni } from '@uni-helper/unocss-preset-uni'

import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

/*
 * 小程序端的样式全部落在这一份配置里，模板里只写工具类：
 * - preflights：页面级设计令牌（两条曲线、一套墨色、底色与排印）；
 * - theme：每条动画的名字、时长、曲线与填充模式；
 * - shortcuts：跨组件复用的成套声明（磨砂玻璃、按下反馈）；
 * - variants：状态覆盖 `on:`、无障碍回退（降透明度）与老内核的 backdrop-filter 兜底。
 *
 * 单位：小程序端 presetUni 把 rem 折成 rpx（1rem = 32rpx），一个刻度 = 8rpx。
 * 这套版式是手调出来的，对不齐刻度的值一律写 [36rpx] 这种精确值，保证一格都不动。
 */

/** 降透明度：毛玻璃收成实色，可读性不押在 backdrop-filter 上 */
const REDUCED_TRANSPARENCY = '@media (prefers-reduced-transparency: reduce)'
/** 老内核没有 backdrop-filter：两层都退回实色，别让图案直接透上来 */
const NO_BACKDROP = '@supports not (backdrop-filter: blur(1px))'

/** 每条动画都要落在终态：填 both，省得模板里再写一遍 */
const FILL = { 'animation-fill-mode': 'both' }

export default defineConfig({
  presets: [
    /*
     * attributify 关掉：小程序端我们用不上属性写法，而 presetIcons 会为它额外生成
     * `[i-carbon\:star=""]` 这类属性选择器 —— WXSS 编译不过，整个 app.wxss 都会挂。
     * 图标一律走 class（i-carbon-star 这种短横线写法），生成出来的就只有类选择器。
     */
    presetUni({ attributify: false }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],

  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],

  /*
   * 多出来的 state 图层排在 default 之后：`on:` 变体的工具类一定压得住同一元素上的基础工具类。
   * 小程序端 wxss 的规则顺序由 UnoCSS 按类名字母序排定，选中态和基础态如果只靠先后顺序，
   * 换个值就可能翻过来（比如 bg-white 和 bg-[rgba(...)]）；单独一层就没有这个不确定性。
   */
  layers: {
    state: 1,
  },

  theme: {
    colors: {
      /* 页面底色，和 manifest / pages 里的 backgroundColor 是同一个值 */
      coal: '#16141c',
      /* 双击收藏时炸开的那枚星 */
      star: '#ffd97a',
      /* 三档墨色：正文、次级读数、弱化说明 */
      ink: {
        DEFAULT: 'var(--ink)',
        2: 'var(--ink-2)',
        3: 'var(--ink-3)',
      },
    },

    animation: {
      keyframes: {
        /* —— 首页：换页合焦、双击收藏炸开、降动效时的交叉淡入 —— */
        'materialize': `{
          from { opacity: 0; transform: scale(1.055); filter: blur(14px); }
          99% { filter: blur(0.6px); }
          to { opacity: 1; transform: scale(1); filter: none; }
        }`,
        'burst-mark': `{
          0% { opacity: 0; transform: scale(0.32) rotate(-16deg); }
          24% { opacity: 1; transform: scale(1.08) rotate(0deg); }
          100% { opacity: 0; transform: scale(1.55) rotate(5deg); }
        }`,
        'burst-ring': `{
          0% { opacity: 0.8; transform: scale(0.34); }
          100% { opacity: 1; transform: scale(1.45); }
        }`,
        'fade-in': '{ from { opacity: 0; } to { opacity: 1; } }',

        /* —— 页头：换页时细线上那道扫光、标题的一进一退 —— */
        'rule-sweep-a': `{
          from { opacity: 0; transform: translateX(-100%); }
          30% { opacity: 1; }
          to { opacity: 0; transform: translateX(460%); }
        }`,
        'rule-sweep-b': `{
          from { opacity: 0; transform: translateX(-100%); }
          30% { opacity: 1; }
          to { opacity: 0; transform: translateX(460%); }
        }`,
        /*
         * 同名动画在微信端不重播，所以每条 keyframes 备两份（a/b），
         * 按 turn 的奇偶换 animation-name —— 连续往同一个方向翻十页也都从零起播。
         */
        'head-in-up-a': '{ from { transform: translateY(108%); } to { transform: translateY(0); } }',
        'head-in-up-b': '{ from { transform: translateY(108%); } to { transform: translateY(0); } }',
        'head-in-down-a': '{ from { transform: translateY(-108%); } to { transform: translateY(0); } }',
        'head-in-down-b': '{ from { transform: translateY(-108%); } to { transform: translateY(0); } }',
        'head-out-up-a': '{ from { transform: translateY(0); } to { transform: translateY(-108%); } }',
        'head-out-up-b': '{ from { transform: translateY(0); } to { transform: translateY(-108%); } }',
        'head-out-down-a': '{ from { transform: translateY(0); } to { transform: translateY(108%); } }',
        'head-out-down-b': '{ from { transform: translateY(0); } to { transform: translateY(108%); } }',
        /* 降动效时不做位移，但仍要交代换了内容：换成一次交叉淡入淡出 */
        'head-fade-in': '{ from { opacity: 0; } to { opacity: 1; } }',
        'head-fade-out': '{ from { opacity: 1; } to { opacity: 0; } }',
        'hint-pulse': `{
          0%, 100% { opacity: 0.35; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.1); }
        }`,

        /* —— 收藏：星标弹一下 —— */
        'bump': `{
          0% { transform: scale(0.6); }
          45% { transform: scale(1.28); }
          100% { transform: scale(1); }
        }`,

        /* —— 位置轨：入场、以及整条轨道滚过一格 —— */
        'rail-in': `{
          from { opacity: 0; transform: translateX(16rpx) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }`,
        'rail-roll-a': `{
          from { opacity: var(--dim, 1); transform: translateY(calc(100% * var(--step) * var(--dir))); }
          78% { transform: translateY(calc(100% * var(--step) * var(--dir) / -10)); }
          to { opacity: 1; transform: translateY(0); }
        }`,
        'rail-roll-b': `{
          from { opacity: var(--dim, 1); transform: translateY(calc(100% * var(--step) * var(--dir))); }
          78% { transform: translateY(calc(100% * var(--step) * var(--dir) / -10)); }
          to { opacity: 1; transform: translateY(0); }
        }`,

        /* —— 选择面板：缩略图逐个错开入场 —— */
        'cell-in': `{
          from { opacity: 0; transform: translateY(18rpx) scale(0.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }`,
      },

      durations: {
        'materialize': '620ms',
        'burst-mark': '720ms',
        'burst-ring': '780ms',
        'fade-in': '220ms',
        'rule-sweep-a': '900ms',
        'rule-sweep-b': '900ms',
        'head-in-up-a': '560ms',
        'head-in-up-b': '560ms',
        'head-in-down-a': '560ms',
        'head-in-down-b': '560ms',
        /* 退场比入场短：离开的那一层不该抢新内容的注意力 */
        'head-out-up-a': '360ms',
        'head-out-up-b': '360ms',
        'head-out-down-a': '360ms',
        'head-out-down-b': '360ms',
        'head-fade-in': '220ms',
        'head-fade-out': '160ms',
        'hint-pulse': '2200ms',
        'bump': '460ms',
        'rail-in': '560ms',
        'rail-roll-a': '440ms',
        'rail-roll-b': '440ms',
        'cell-in': '460ms',
      },

      timingFns: {
        'materialize': 'var(--settle)',
        'burst-mark': 'var(--settle)',
        'burst-ring': 'var(--settle)',
        'fade-in': 'ease',
        'rule-sweep-a': 'var(--settle)',
        'rule-sweep-b': 'var(--settle)',
        'head-in-up-a': 'var(--settle)',
        'head-in-up-b': 'var(--settle)',
        'head-in-down-a': 'var(--settle)',
        'head-in-down-b': 'var(--settle)',
        'head-out-up-a': 'var(--press)',
        'head-out-up-b': 'var(--press)',
        'head-out-down-a': 'var(--press)',
        'head-out-down-b': 'var(--press)',
        'head-fade-in': 'ease',
        'head-fade-out': 'ease',
        'hint-pulse': 'ease-in-out',
        'bump': 'var(--spring)',
        'rail-in': 'var(--settle)',
        'rail-roll-a': 'var(--settle)',
        'rail-roll-b': 'var(--settle)',
        'cell-in': 'var(--spring)',
      },

      counts: {
        'hint-pulse': 'infinite',
      },

      properties: {
        'materialize': FILL,
        'burst-mark': FILL,
        'burst-ring': FILL,
        'fade-in': FILL,
        'rule-sweep-a': FILL,
        'rule-sweep-b': FILL,
        'head-in-up-a': FILL,
        'head-in-up-b': FILL,
        'head-in-down-a': FILL,
        'head-in-down-b': FILL,
        'head-out-up-a': FILL,
        'head-out-up-b': FILL,
        'head-out-down-a': FILL,
        'head-out-down-b': FILL,
        'head-fade-in': FILL,
        'head-fade-out': FILL,
        'bump': FILL,
        'cell-in': FILL,
        /* 位置轨比标题晚一点起手：视线先离开文字，右侧这条再跟着出来 */
        'rail-in': { 'animation-fill-mode': 'both', 'animation-delay': '120ms' },
        'rail-roll-a': FILL,
        'rail-roll-b': FILL,
      },
    },
  },

  shortcuts: [
    /*
     * 按下反馈：touch-down 立即响应，不等抬起。
     * 曲线单独留在 --press 里 —— 素材不同、节奏相同，改一处就全站一致。
     */
    ['press', '[transition:transform_140ms_var(--press),opacity_140ms_var(--press)]'],
    ['press--on', 'scale-94 opacity-72 motion-reduce:transform-none motion-reduce:opacity-100'],

    /*
     * 深色磨砂：右侧位置轨、dock 上的圆钮、收藏星共用同一份材质
     * （rgba(28,26,36,0.26) + blur(18px) saturate(160%) + 亮顶边），
     * 浮在图案上的几颗控件不该各是各的玻璃。
     * 最后两项是降透明度时的兜底：这层材质全靠 backdrop-filter 撑着，去掉模糊就得自己压住底。
     */
    ['glass-dark', [
      'bg-[rgba(28,26,36,0.26)]',
      'shadow-[inset_0_1rpx_0_rgba(255,255,255,0.22),0_8rpx_24rpx_rgba(8,7,12,0.18)]',
      'backdrop-blur-[18px]',
      'backdrop-saturate-160',
      'reduce-transparency:bg-[rgba(28,26,36,0.72)]',
      'reduce-transparency:backdrop-filter-none',
    ].join(' ')],

    /*
     * 浅色内嵌玻璃：面板上「凹进去」的那一层 —— 分段控件的轨道和代码块是同一个面。
     * 它不靠 backdrop-filter，只是一层很薄的白加一道内阴影：
     * 两处因此永远同色，不会各自调一个近似的白，久了也不会走散。
     */
    ['glass-inset', 'bg-[rgba(255,255,255,0.09)] shadow-[inset_0_1rpx_3rpx_rgba(0,0,0,0.28)]'],
  ],

  variants: [
    /*
     * 状态覆盖（`on:`）：选中、按下、拖着……这些"这一层说了算"的声明。
     * 落进 state 图层，永远排在基础工具类之后，模板里就不必再操心谁先谁后。
     */
    (matcher) => {
      if (!matcher.startsWith('on:'))
        return matcher
      return {
        matcher: matcher.slice('on:'.length),
        layer: 'state',
      }
    },
    /*
     * 降透明度：毛玻璃是装饰，可读性不是 —— 这时候收成实色。
     * （降动效走 presetUni 内置的 motion-reduce: 变体，不用自己定义。）
     */
    (matcher) => {
      if (!matcher.startsWith('reduce-transparency:'))
        return matcher
      return {
        matcher: matcher.slice('reduce-transparency:'.length),
        parent: REDUCED_TRANSPARENCY,
      }
    },
    /* 老内核没有 backdrop-filter：两层都退回实色 */
    (matcher) => {
      if (!matcher.startsWith('no-backdrop:'))
        return matcher
      return {
        matcher: matcher.slice('no-backdrop:'.length),
        parent: NO_BACKDROP,
      }
    },
  ],

  preflights: [
    {
      getCSS: () => `
/*
 * 全局设计令牌：两条曲线 + 一套排印。
 * --spring 是 iOS 面板曲线（起步快、收尾稳，可反复打断重定向）；
 * --settle 近似临界阻尼弹簧（damping 1.0，不过冲）。
 */
page {
  --spring: cubic-bezier(0.32, 0.72, 0, 1);
  --settle: cubic-bezier(0.22, 1, 0.36, 1);
  --press: cubic-bezier(0.2, 0, 0, 1);
  --ink: #f5f4f7;
  --ink-2: rgba(255, 255, 255, 0.72);
  --ink-3: rgba(255, 255, 255, 0.48);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Helvetica Neue", sans-serif;
  background: #16141c;
}
`,
    },
  ],
})
