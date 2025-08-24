import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer as createViteServer } from 'vite';
import { routes } from './routes/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3000;
const isProd = process.env.NODE_ENV === 'production';

async function start() {
  const app = express();

  if (!isProd) {
    // In development, instantiate Vite server and apply as middleware
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        printUrls: false, // Prevent Vite from printing its own URL
      },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve statically built client files
    app.use(express.static(path.join(__dirname, '../client'), { index: false }));
  }

  // Serve public assets
  app.use(express.static(path.join(__dirname, '../../public')));

  // Register all routes from the central registry
  Object.entries(routes).forEach(([name, routeModule]) => {
    // The path is derived from the key in the routes object.
    // 'home' is a special case for the root path.
    const path = name === 'home' ? '/' : `/${name}`;

    if (routeModule.router) {
      app.use(path, routeModule.router());
      console.log(`Registered route: ${path}`);
    } else {
      console.warn(`The route module for '${name}' is missing a router export.`);
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

start();
