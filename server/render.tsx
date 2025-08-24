import { renderToString } from 'react-dom/server';
import React from 'react';
import fs from 'fs';
import path from 'path';
import { PROT } from './constants/index.js';

const isProd = process.env.NODE_ENV === 'production';

// --- Manifest Loading ---
const manifestPath = path.join(process.cwd(), 'dist/client/.vite/manifest.json');
const manifest = isProd ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) : {};

// --- Document Component ---
interface DocumentProps {
  title: string;
  appHtml: string;
  initialDataScript: string;
  clientScriptSrc: string;
}

function Document({ title, appHtml, initialDataScript, clientScriptSrc }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>

        {/* 开发环境添加 React Refresh 脚本 */}
        {!isProd && (
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `
                import RefreshRuntime from 'http://localhost:${PROT}/@react-refresh'
                RefreshRuntime.injectIntoGlobalHook(window)
                window.$RefreshReg$ = () => {}
                window.$RefreshSig$ = () => (type) => type
                window.__vite_plugin_react_preamble_installed__ = true
              `,
          }}
        />
        )}
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: appHtml }} />
        <script
          id="__INITIAL_DATA__"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: initialDataScript }}
        />

        {/* 开发环境需要额外的 Vite 客户端脚本 */}
        {!isProd && (
        <script type="module" src={`http://localhost:${PROT}/@vite/client`} />
        )}

        <script type="module" src={clientScriptSrc} />
      </body>
    </html>
  );
}

// --- Render Function ---
interface RenderOptions {
  pageComponent: React.ReactElement;
  pageName: string;
  initialData?: object;
  title?: string;
}

const DEFAULT_TITLE = 'Vite React Express SSR';

export function renderPage({ pageComponent, pageName, initialData, title = DEFAULT_TITLE }: RenderOptions) {
  // 1. Render the main React component to an HTML string.
  const appHtml = renderToString(pageComponent);

  // 2. Prepare the initial data script content.
  const initialDataScript = JSON.stringify(initialData || {}).replace(/</g, '\u003c');

  // 3. Determine the client script source path.
  let clientScriptSrc = '';
  if (isProd) {
    const entryKey = `src/pages/${pageName}/client.tsx`;
    clientScriptSrc = manifest[entryKey] ? `/${manifest[entryKey].file}` : '';
  } else {
    // 开发环境使用 Vite 开发服务器的 URL
    clientScriptSrc = `http://localhost:${PROT}/src/pages/${pageName}/client.tsx`;
  }

  if (!clientScriptSrc) {
    console.warn(`Client script for page '${pageName}' not found.`);
  }

  // 4. Render the full HTML document using our Document component.
  const documentHtml = renderToString(
    <Document
      title={title}
      appHtml={appHtml}
      initialDataScript={initialDataScript}
      clientScriptSrc={clientScriptSrc}
    />,
  );

  // 5. Prepend the doctype and return the full HTML.
  return `<!DOCTYPE html>${documentHtml}`;
}
