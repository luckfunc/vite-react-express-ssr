import fs from 'fs';
import path from 'path';
import express, { Request, Response } from 'express';
import React from 'react';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { renderToHtml } from './ssr-render';
import App from '../src/components/App';
import Home from '../src/pages/home';
import About from '../src/pages/about';
import Contact from '../src/pages/contact';
import { renderTemplate } from './render-template';

const isProd = process.env.NODE_ENV === 'production';
const root = process.cwd();

async function createServer() {
  const app = express();
  let vite: ViteDevServer | undefined;

  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root,
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(root, 'dist/client'), { index: false }));
  }

  // 读取 manifest.json（生产）
  let manifest: Record<string, { file: string }> = {};
  if (isProd) {
    manifest = JSON.parse(fs.readFileSync(path.resolve(root, 'dist/client/.vite/manifest.json'), 'utf-8'));
  }

  // 页面名 → manifest key 映射
  const pageManifestKeyMap: Record<'home' | 'about' | 'contact', string> = {
    home: 'src/pages/home/index.tsx',
    about: 'src/pages/about/index.tsx',
    contact: 'src/pages/contact/index.tsx',
  };

  const renderPage = async (
    req: Request,
    res: Response,
    pageComponent: React.ReactElement,
    pageName: 'home' | 'about' | 'contact',
    title: string
  ) => {
    try {
      const appHtml = renderToHtml(<App page={pageComponent} />);
      let clientScript: string;

      if (isProd) {
        const manifestKey = pageManifestKeyMap[pageName];
        clientScript = '/assets/' + manifest[manifestKey].file;
      } else {
        clientScript = `/src/pages/${pageName}/index.tsx`;
      }

      const html = renderTemplate({ appHtml, clientScript, title });
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      if (vite) vite.ssrFixStacktrace(e as Error);
      console.error(e);
      res.status(500).end((e as Error).stack);
    }
  };

  // 路由
  app.get('/', (req, res) =>
    renderPage(req, res, <Home />, 'home', 'Home Page')
  );
  app.get('/about', (req, res) =>
    renderPage(req, res, <About />, 'about', 'About Us')
  );
  app.get('/contact', (req, res) =>
    renderPage(req, res, <Contact />, 'contact', 'Contact')
  );

  app.use('*', (_req, res) => res.status(404).send('404 Not Found'));

  app.listen(5173, () => console.log('Server listening on http://localhost:5173'));
}

createServer().catch(console.error);
