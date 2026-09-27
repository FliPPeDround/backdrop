import { presetUni } from '@uni-helper/unocss-preset-uni'

import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

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
})
