import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Hide splash screen after React has mounted
const splash = document.getElementById('splash');
if (splash) {
  splash.classList.add('hidden');
  splash.addEventListener('transitionend', () => splash.remove());
}
