import { hydrateRoot } from 'react-dom/client';
import App from '../../components/App';
import Contact from './index';

hydrateRoot(document.getElementById('app')!, <App page={<Contact />} />);
