import React from 'react';
import ReactDOM from 'react-dom/client';
import HomePage from './index';

if (typeof window !== 'undefined') {
  ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <React.StrictMode>
      <HomePage />
    </React.StrictMode>
  );
}
