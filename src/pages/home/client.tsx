import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import HomePage from './index';
import type { HomePageProps } from '../../types';

// 1. Grab the initial data injected by the server
const initialDataElement = document.getElementById('__INITIAL_DATA__');
const initialData = JSON.parse(initialDataElement?.textContent || '{}') as HomePageProps;

// 2. Hydrate the component with the initial data
hydrateRoot(
  document.getElementById('root')!,
  <HomePage {...initialData} />
);
