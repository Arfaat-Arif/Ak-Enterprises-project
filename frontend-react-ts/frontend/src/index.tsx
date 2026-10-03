import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { reportWebVitals } from './reportWebVitals';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found — check public/index.html for <div id="root"></div>.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Pass a function to log results (e.g. reportWebVitals(console.log))
// or send to an analytics endpoint.
reportWebVitals();
