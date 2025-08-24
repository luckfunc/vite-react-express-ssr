import { renderToString } from 'react-dom/server';
import React from 'react';
import fs from 'fs';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

// 1. 缓存 HTML 模板和 manifest
// 在生产环境中，路径是相对于 dist/server 的
const templatePath = path.join(process.cwd(), isProd ? './public/index.html' : 'public/index.html');
const manifestPath = path.join(process.cwd(), 'dist/client/manifest.json');

let template = '';
try {
  template = fs.readFileSync(templatePath, 'utf-8');
} catch (e) {
  console.error(`HTML template not found at ${templatePath}. Please ensure 'public/index.html' exists.`);
  // 在没有模板的情况下，提供一个非常基础的后备模板
  template = `<!DOCTYPE html><html><head><title>Vite React Express SSR</title></head><body><div id="root"></div></body></html>`;
}

const manifest = isProd ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) : {};

export function renderPage(pageComponent: React.ReactElement, pageName: string) {
  // 2. 渲染 React 组件为字符串
  const appHtml = renderToString(pageComponent);

  // 3. 根据环境决定客户端脚本路径
  let clientScript = '';
  if (isProd) {
    // 生产环境：从 manifest 获取带 hash 的文件名
    // vite.config.ts 中的入口是 `home`，对应 `src/pages/home/client.tsx`
    // manifest 的 key 是相对于 root 的源文件路径
    const entryKey = `src/pages/${pageName}/client.tsx`;
    if (manifest[entryKey]) {
      clientScript = `<script type="module" src="/${manifest[entryKey]['file']}"></script>`;
    } else {
      console.warn(`Manifest entry not found for ${entryKey}`);
    }
  } else {
    // 开发环境：直接指向源文件，由 Vite Dev Server 处理
    clientScript = `<script type="module" src="/src/pages/${pageName}/client.tsx"></script>`;
  }

  // 4. 注入内容和脚本到 HTML 模板
  const html = template
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace('</body>', `${clientScript}</body>`);

  return html;
}
