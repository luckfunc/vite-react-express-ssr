import { Router } from 'express';
import { renderPage } from '../../render.ts';
import React from 'react';

export const path = '/about';

function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is a new page created to demonstrate the template's functionality.</p>
      <a href="/">Go back to Home</a>
    </div>
  );
}

export function router() {
  const router = Router();

  router.get('/', (req, res) => {
    const html = renderPage(<About />, 'about');
    res.send(html);
  });

  return router;
}
