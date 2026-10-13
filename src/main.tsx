import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/serviceWorkerRegistration';

// Register service worker for offline shell and push notifications
registerServiceWorker().catch(() => {});

createRoot(document.getElementById('root')!).render(<App />);
