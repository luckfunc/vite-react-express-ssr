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

添加新页面的流程高度工程化，路径根据目录名自动生成，杜绝了手动失误。

假设要添加一个 `contact` 页面 (对应路径 `/contact`)：

**第 1 步: 创建页面文件**

1.  **创建后端路由文件**: `server/routes/contact/index.tsx`
    -   这个文件现在**只需要导出一个 `router` 函数**即可。

2.  **创建前端入口文件**: `src/pages/contact/client.tsx`
    -   内容和之前一样，用于客户端注水。

**第 2 步: 在路由中心注册新页面**

-   打开 `server/routes/index.ts` 文件。
-   导入你刚刚创建的路由模块，并将其作为一个**属性**添加到 `routes` 对象中。对象的 `key` 将被用作页面的路径名。

    ```typescript
    import * as home from './home/index.tsx';
    import * as about from './about/index.tsx';
    import * as contact from './contact/index.tsx'; // 1. 导入新路由

    export const routes = {
      home,      // -> 路径为 '/'
      about,     // -> 路径为 '/about'
      contact,   // 2. 添加到对象，key 即为路径名
    };
    ```

完成！重启开发服务器 (`pnpm dev`)，新路由就会生效。这是目前最健壮、最清晰的工作流程。

## 从服务端传递数据到客户端 (Props)

在真实的应用里，你肯定需要在服务端获取数据，然后用这些数据渲染页面。这个模板已经内置了让这一切无缝发生的能力，我们管这个叫“状态注水”。为了保证数据在服务端和客户端之间传递时的类型安全，我们约定使用 `src/types/index.ts` 文件来存放所有跨端共享的类型。

**工作流程**

1.  **定义共享类型**: 在 `src/types/index.ts` 中定义你的页面组件需要的 Props 类型。
    ```typescript
    export interface HomePageProps {
      userName: string;
    }
    ```
2.  **服务端获取数据**: 在你的路由文件里 (例如 `server/routes/home/index.tsx`)，导入这个类型，然后获取数据并传递给组件和 `renderPage` 函数。
    ```typescript
    import type { HomePageProps } from '../../../src/types';
    // ...
    const initialData: HomePageProps = { userName: 'Gemini' };
    const pageComponent = <HomePage {...initialData} />;
    const html = renderPage(pageComponent, 'home', initialData);
    // ...
    ```
3.  **客户端接收数据**: 客户端入口文件 (例如 `src/pages/home/client.tsx`) 会自动拿到数据。为了让 TypeScript 知道这份数据的类型，我们也需要导入共享类型并进行断言。
    ```typescript
    import type { HomePageProps } from '../../types';
    // ...
    const initialData = JSON.parse(...) as HomePageProps;
    hydrateRoot(document.getElementById('root')!, <HomePage {...initialData} />);
    ```

通过这个流程，你就拥有了完全端到端类型安全的数据传递。任何不匹配都会被 TypeScript 在编译时发现，非常稳健。
