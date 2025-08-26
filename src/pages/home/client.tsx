import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from '../../components/App';
import Home from './index';

hydrateRoot(document.getElementById('app'), <App page={<Home />} />);
