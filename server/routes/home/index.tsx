import express from 'express';
import { renderPage } from '../../render.ts';
import HomePage from '../../../src/pages/home/index.tsx';

export const path = '/';

export function router() {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      const html = renderPage(<HomePage />, 'home');
      res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (error) {
      console.error('Home route error:', error);
      res.status(500).send('Server Error');
    }
  });

  return router;
}
