import React from 'react';
import { Router } from 'express';
import { renderPage } from '../../render.js';
import About from '../../../src/pages/about/index.js';

export function router() {
  const router = Router();

  router.get('/', (req, res) => {
    const html = renderPage({
      pageComponent: <About />,
      pageName: 'about',
      title: 'About Us | SSR Template',
    });
    res.send(html);
  });

  return router;
}
