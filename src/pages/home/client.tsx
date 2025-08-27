import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Home from './index'; // 你的页面组件
import { getSsrProps } from '@utils';
import '@types';
import { HomeProps } from '@types';

hydrateRoot(document.getElementById('root')!, <Home {...getSsrProps<HomeProps>()} />);
