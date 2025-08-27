import { renderToStaticMarkup } from 'react-dom/server';
import { IS_PRODUCTION } from './constants';

interface TemplateProps {
  appHtml: string;
  clientScript: string;
  cssFiles?: string[];
  title: string;
  pageName: string;
  ssrProps?: any;
}

export function renderTemplate({ appHtml, clientScript, cssFiles, title, pageName, ssrProps }: TemplateProps) {
  console.log('clientScript', clientScript);
  return (
    `<!DOCTYPE html>${
      renderToStaticMarkup(
        <html lang="en" data-page={pageName}>
          <head>
            <meta charSet="UTF-8" />
            <title>{title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            {/* 生产环境使用 link，支持缓存 */}
            {cssFiles?.map(file => <link rel="stylesheet" href={file} key={file} />)}
          </head>
          <body>
            <section id="root" dangerouslySetInnerHTML={{ __html: appHtml }} />
            {/* 只在开发环境引入 React Refresh */}
            {!IS_PRODUCTION && (
            <script
              type="module"
              dangerouslySetInnerHTML={{
                __html: `
                  import RefreshRuntime from 'http://localhost:5173/@react-refresh'
                  RefreshRuntime.injectIntoGlobalHook(window)
                  window.$RefreshReg$ = () => {}
                  window.$RefreshSig$ = () => (type) => type
                  window.__vite_plugin_react_preamble_installed__ = true
                `,
              }}
            />
            )}
            {ssrProps ? (
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.__SSR_PROPS__ = ${JSON.stringify(ssrProps)};`,
                }}
              />
            ) : null}
            <script type="module" src={clientScript} />
            <script type="module" />
          </body>
        </html>,
      )}`
  );
}
