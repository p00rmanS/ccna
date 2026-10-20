import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import { Sentry, initMonitoring } from './utils/monitoring';

initMonitoring();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p style={{ padding: 24 }}>Something went wrong. Reload the page; your progress is saved in this browser.</p>}>
      <HashRouter>
        <App />
      </HashRouter>
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
