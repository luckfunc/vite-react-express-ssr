import { hydrateRoot } from 'react-dom/client';
import About from './index';
import { getSsrProps } from '@utils';
import { AboutProps } from '@types';

hydrateRoot(document.getElementById('root')!, <About {...getSsrProps<AboutProps>()} />);
