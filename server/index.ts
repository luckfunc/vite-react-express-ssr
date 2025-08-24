import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer as createViteServer } from 'vite';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3000;
const isProd = process.env.NODE_ENV === 'production';

async function start() {
  const app = express();

  if (!isProd) {
    // In development, instantiate Vite server and apply as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve statically built client files
    app.use(express.static(path.join(__dirname, '../client'), { index: false }));
  }

  // Serve public assets
  app.use(express.static(path.join(__dirname, '../../public')));

  // Dynamically import and register routes
  const routeFiles = await glob('./routes/**/index.tsx', { cwd: __dirname });
  for (const file of routeFiles) {
    const routeModule = await import(file);
    if (routeModule.path && routeModule.router) {
      app.use(routeModule.path, routeModule.router());
      console.log(`Registered route: ${routeModule.path}`);
    } else {
      console.warn(`Could not register route from ${file}: missing path or router export.`);
    }
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

start();
