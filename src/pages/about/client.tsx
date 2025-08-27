import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import About from './index';
import { getSsrProps } from '@utils';
import '@types';
import { AboutProps } from '@types';

hydrateRoot(document.getElementById('root')!, <About {...getSsrProps<AboutProps>()} />);
