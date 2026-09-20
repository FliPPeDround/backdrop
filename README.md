<p align="center">
  <img src="./brand/backdrop/icon-dark.svg" width="96" height="96" alt="Backdrop logo" />
</p>

<h1 align="center">Backdrop</h1>

<p align="center">为小程序打造的开箱即用背景图案库。</p>

精选渐变、光晕、网格等背景图案，在线预览真机效果，一键复制适配代码，无缝集成到你的小程序项目中。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## 特性

- 精选背景图案：渐变、光晕、网格等多种风格，持续更新
- 多框架代码生成：支持微信原生、uni-app、Taro、Wevu，可选样式分离、内联或 Tailwind 类名
- 在线预览：Web 端实时预览，手机模拟框查看小程序真实效果
- 本地收藏：常用图案一键收藏，数据保存在本地
- MCP 端点：把整个图案库接给 AI 助手，用中文描述就能拿到可粘贴代码

## 项目结构

| 包                                    | 说明                                        |
| ------------------------------------- | ------------------------------------------- |
| [@backdrop/data](./packages/data)     | 图案数据与代码生成核心                      |
| [@backdrop/shared](./packages/shared) | 各端共用的筛选、收藏与存储逻辑              |
| [@backdrop/web](./packages/web)       | 在线预览与复制代码（Vue 3 + Vite + UnoCSS） |
| [@backdrop/mp](./packages/mp)         | 小程序端演示（uni-app）                     |
| [@backdrop/mcp](./packages/mcp)       | HTTP MCP 服务，随 Web 站一起部署在 Netlify  |

## 快速开始

```bash
pnpm install

# 启动 Web 预览站
pnpm web

# 启动小程序（配合微信开发者工具）
pnpm mp

# 本地跑 MCP 服务（默认 http://localhost:8788/mcp）
pnpm mcp:dev

# MCP 检索与代码生成测试
pnpm mcp:test
```

## MCP 接入

线上端点即本站的 `/mcp` 无需密钥。把它加进支持远程 MCP 的客户端：

```json
{
  "mcpServers": {
    "backdrop": {
      "url": "https://mpbackdrop.netlify.app/mcp"
    }
  }
}
```

提供两个工具：

- `search_backdrops`：按中文或英文描述检索，返回候选的 `id` / `name` / `nameZh` / `category`，不含代码。颜色会同时与图案真实的 CSS 值比对，所以「柔和一点的蓝色渐变」能命中名字里没有 blue 的 `Azure Depths`。
- `get_backdrop_code`：按 `id`（或完整英文名）取单个图案的代码，`framework` 选微信原生 / uni-app / Taro / Wevu，`style` 选内联 / 样式分离 / Tailwind。关键词歧义时返回候选列表而不是猜测。

## License

[MIT](./LICENSE) © FliPPeDround

## 致谢

项目的灵感与背景样式来源于 [pattern-craft](https://github.com/megh-bari/pattern-craft)，感谢 [@megh-bari](https://github.com/megh-bari) 的出色工作。
