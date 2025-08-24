import React from 'react';
import express from 'express';
import { renderPage } from '../../render.ts';
import HomePage from '../../../src/pages/home/index.tsx';
import type { HomePageProps } from '../../../src/types';

export function router() {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      // 1. Simulate fetching data on the server.
      // In a real app, this could be a database query or an API call.
      const initialData: HomePageProps = { userName: 'Gemini' };

      // 2. Pass the data to the component for server-side rendering.
      const pageComponent = <HomePage {...initialData} />;

      // 3. Pass the data AGAIN to renderPage so it can be injected into the HTML for the client.
      const html = renderPage(pageComponent, 'home', initialData);

      res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (error) {
      console.error('Home route error:', error);
      res.status(500).send('Server Error');
    }
  });

  return router;
}
