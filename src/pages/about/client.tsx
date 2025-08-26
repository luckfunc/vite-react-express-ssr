import { hydrateRoot } from 'react-dom/client';
import App from '../../components/App';
import About from './index';

hydrateRoot(document.getElementById('app')!, <App page={<About />} />);
