import fs from 'fs';
import path from 'path';
import express, { Request, Response } from 'express';
import React from 'react';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { renderToHtml } from './ssr-render';
import Home from '../src/pages/home';
import About from '../src/pages/about';
import Contact from '../src/pages/contact';
import { renderTemplate } from './render-template';
import { PageProps, HomeProps, AboutProps, ContactProps } from '@types';

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

  const renderPage = async <T extends {}>(
    req: Request,
    res: Response,
    PageComponent: React.ComponentType<PageProps<T>>,
    pageName: 'home' | 'about' | 'contact',
    title: string,
    ssrProps: PageProps<T> = {}
  ) => {
    try {
      // Create the component with props before rendering
      const pageComponent = <PageComponent {...ssrProps} />;
      const appHtml = renderToHtml(pageComponent);

      let clientScript: string;
      if (isProd) {
        const manifestKey = pageManifestKeyMap[pageName];
        clientScript = '/' + manifest[manifestKey].file;
      } else {
        clientScript = `/src/pages/${pageName}/client.tsx`;
      }
      console.log ('ssrProps', ssrProps)

      const html = renderTemplate({
        appHtml,
        clientScript,
        title,
        pageName,
        ssrProps,
      });

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      if (vite) vite.ssrFixStacktrace(e as Error);
      console.error(e);
      res.status(500).end((e as Error).stack);
    }
  };


  // 路由
  app.get('/', (req, res) =>
    renderPage<HomeProps>(req, res, Home, 'home', 'Home Page', { data: { title: 'Home Page' } })
  );
  app.get('/about', (req, res) =>
    renderPage<AboutProps>(req, res, About, 'about', 'About Us', { data: { title: 'About Us', description: 'This is the about page.' } })
  );
  app.get('/contact', (req, res) =>
    renderPage<ContactProps>(req, res, Contact, 'contact', 'Contact', { data: { email: 'test@example.com', phone: '123-456-7890' } })
  );

  // app.use('*', (_req, res) => res.status(404).send('404 Not Found'));

  app.listen(5173, () => console.log('Server listening on http://localhost:5173'));
}

createServer().catch(console.error);
