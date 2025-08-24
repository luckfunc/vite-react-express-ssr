中文 · [English](./README_en.md) 

# vite-react-express-ssr (中文版)

这是一个使用 React、Vite 和 Express 构建服务器端渲染 (SSR) 应用的模板。

它为开发人员提供了出色的体验，包括对服务器和客户端代码的热重载，并为生产环境构建进行了优化。

## 功能特性

-   **React 19**: 使用最新的 React 功能。
-   **Vite**: 用于快速的客户端打包和优秀的开发体验。
-   **Express**: 一个健壮的 Node.js 服务器，用于处理 SSR。
-   **TypeScript**: 为整个技术栈提供类型安全。
-   **热重载**: `nodemon` 用于服务器，Vite 的 HMR 用于客户端。

## 环境要求

-   [Node.js](https://nodejs.org/) (v18 或更高版本)
-   [pnpm](https://pnpm.io/) (你也可以根据需要将其命令调整为 npm/yarn)

## 安装

1.  克隆本仓库。
2.  使用 pnpm 安装依赖：

    ```bash
    pnpm install
    ```

## 可用脚本

### `pnpm dev`

启动开发服务器。

-   客户端资源由 Vite 开发服务器处理。
-   Express 服务器由 `nodemon` 监视，`server/` 目录中的任何更改都将导致服务重启。
-   应用将在 `http://localhost:3000` 上可用。

### `pnpm build`

为生产环境构建应用。

-   使用 Vite 将客户端代码编译到 `dist/client` 目录。
-   将服务器端 TypeScript 代码编译到 `dist/server` 目录。

### `pnpm start`

在生产模式下启动应用。

-   从 `dist/` 目录提供预构建的资源。
-   **注意**: 在运行此命令之前，你必须先运行 `pnpm build`。

### `pnpm type-check`

运行 TypeScript 编译器以检查项目中的任何类型错误。

## 项目结构

```
.
├── dist/         # 生产环境的编译输出
├── server/       # Express 服务器源代码
│   ├── routes/   # 页面路由和组件
│   └── index.ts  # 服务器入口文件
├── src/          # 客户端源代码
│   └── pages/    # 页面客户端入口 (用于注水/hydration)
├── public/       # 静态资源
├── package.json
└── vite.config.ts
```

## 如何添加新页面

得益于“约定优于配置”的原则，添加新页面现在非常简单，**无需修改任何配置文件**。

假设要添加一个 `contact` 页面，路径为 `/contact`：

1.  **创建后端路由文件**:
    -   在 `server/routes/` 下创建一个新文件夹，例如 `contact`。
    -   在 `server/routes/contact/` 中创建一个 `index.tsx` 文件。
    -   此文件必须导出两个东西：
        -   `path` (字符串): 页面的 URL 路径 (例如: `export const path = '/contact';`)
        -   `router` (函数): Express 的路由处理函数 (例如: `export function router() { ... }`)

2.  **创建前端入口文件**:
    -   在 `src/pages/` 下创建一个对应的文件夹，例如 `contact`。
    -   在 `src/pages/contact/` 中创建一个 `client.tsx` 文件，用于客户端的注水操作。

完成！重启开发服务器 (`pnpm dev`)，新的 `/contact` 路由就会被自动发现并生效。
