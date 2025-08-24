import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import About from './index.tsx';

hydrateRoot(document.getElementById('root')!, <About />);
