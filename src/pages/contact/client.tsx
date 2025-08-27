import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Contact from './index';
import { getSsrProps } from '@utils';
import { ContactProps } from '@types';

hydrateRoot(document.getElementById('root')!, <Contact {...getSsrProps<ContactProps>()} />);
