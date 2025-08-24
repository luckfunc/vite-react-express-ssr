import React from 'react';
import { Router } from 'express';
import { renderPage } from '../../render.js';
import About from '../../../src/pages/about/index.js';

export function router() {
  const router = Router();

  router.get('/', (req, res) => {
    const html = renderPage(<About />, 'about');
    res.send(html);
  });

  return router;
}
