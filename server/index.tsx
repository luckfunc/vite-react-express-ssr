import fs from 'fs';
import path from 'path';
import express, { Request, Response } from 'express';
import React from 'react';
import { createServer as createViteServer, Manifest, ViteDevServer } from 'vite';
import { renderToHtml } from './ssr-render';
import Home from '@pages/home';
import About from '@pages/about';
import Contact from '@pages/contact';
import { renderTemplate } from './render-template';
import { IS_PRODUCTION } from './constants';
import { PageProps, HomeProps, AboutProps, ContactProps } from '@types';

const root = process.cwd();

async function createServer() {
  const app = express();
  let vite: ViteDevServer | undefined;

  if (!IS_PRODUCTION) {
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
  let manifest: Manifest | null = null;
  if (IS_PRODUCTION) {
    try {
      manifest = JSON.parse(
        fs.readFileSync(path.resolve(process.cwd(), 'dist/client/.vite/manifest.json'), 'utf-8'),
      );
    } catch (e) {
      console.error(`[SSR] Failed to read manifest.json. Did you build the client?`, e);
    }
  }

  const renderPage = async <T extends {}>(
    req: Request,
    res: Response,
    PageComponent: React.ComponentType<PageProps<T>>,
    pageName: 'home' | 'about' | 'contact',
    title: string,
    ssrProps: PageProps<T> = {},
  ) => {
    try {
      const appHtml = renderToHtml(<PageComponent {...ssrProps} />);

      let clientScript: string = '';
      let cssFiles: string[] | undefined;

      if (IS_PRODUCTION && manifest) {
        const manifestKey = `src/pages/${pageName}/client.tsx`; // Standardized client entry
        const entry = manifest[manifestKey];
        if (entry) {
          clientScript = `/${entry.file}`;
          cssFiles = entry.css?.map(file => `/${file}`) || [];
        } else {
          console.error(`[SSR] Entry not found in manifest for page: ${pageName} (key: ${manifestKey})`);
        }
      } else {
        // Dev environment: Vite handles it
        clientScript = `/src/pages/${pageName}/client.tsx`;
        // In dev, CSS is injected by Vite, but we can link the source for consistency if needed
        // cssFiles = [`/src/pages/${pageName}/style.less`];
      }

      const html = renderTemplate({
        appHtml,
        clientScript,
        cssFiles,
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
    renderPage<HomeProps>(req, res, Home, 'home', 'Home Page', { data: { title: 'Home Page' } }));
  app.get('/about', (req, res) =>
    renderPage<AboutProps>(req, res, About, 'about', 'About Us', { data: { title: 'About Us', description: 'This is the about page.' } }));
  app.get('/contact', (req, res) =>
    renderPage<ContactProps>(req, res, Contact, 'contact', 'Contact', { data: { email: 'test@example.com', phone: '123-456-7890' } }));

  app.listen(5173, () => console.log('Server listening on http://localhost:5173'));
}

createServer().catch(console.error);
