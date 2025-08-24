import React from 'react';
import express from 'express';
import { renderPage } from '../../render.js';
import HomePage from '../../../src/pages/home/index.js';
import type { HomePageProps } from '../../../src/types/index.js';

export function router() {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      // 1. Simulate fetching data on the server.
      // In a real app, this could be a database query or an API call.
      const initialData: HomePageProps = { userName: 'Gemini' };

      // 2. Pass the data to the component for server-side rendering.
      const pageComponent = <HomePage {...initialData} />;

      // 3. Pass all options to the renderPage function.
      const html = renderPage({
        pageComponent,
        pageName: 'home',
        initialData,
        title: 'Home Page | SSR Template',
      });

      res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (error) {
      console.error('Home route error:', error);
      res.status(500).send('Server Error');
    }
  });

  return router;
}
