# Backdrop

为小程序打造的开箱即用背景图案库。精选渐变、光晕、网格等背景图案，在线预览真机效果，一键复制适配代码，无缝集成到你的小程序项目中。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## 特性

- 精选背景图案：渐变、光晕、网格等多种风格，持续更新
- 多框架代码生成：支持微信原生、uni-app、Taro、Wevu，可选样式分离或内联
- 在线预览：Web 端实时预览，手机模拟框查看小程序真实效果
- 本地收藏：常用图案一键收藏，数据保存在本地

## 项目结构

| 包                                | 说明                                        |
| --------------------------------- | ------------------------------------------- |
| [@backdrop/data](./packages/data) | 图案数据与代码生成核心                      |
| [@backdrop/web](./packages/web)   | 在线预览与复制代码（Vue 3 + Vite + UnoCSS） |
| [@backdrop/mp](./packages/mp)     | 小程序端演示（uni-app + wot-design-uni）    |

## 快速开始

```bash
pnpm install

# 启动 Web 预览站
pnpm web

# 启动小程序（配合微信开发者工具）
pnpm mp
```

## License

[MIT](./LICENSE) © FliPPeDround

## 致谢

项目的灵感与背景样式来源于 [pattern-craft](https://github.com/megh-bari/pattern-craft)，感谢 [@megh-bari](https://github.com/megh-bari) 的出色工作。
