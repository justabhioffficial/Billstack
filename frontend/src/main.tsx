import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Background self-warming ping to ensure Render backend is warm and fast
const warmBackend = () => {
  const backendHealthUrl = 'https://mybillstack.onrender.com/api/v1/health';
  fetch(backendHealthUrl, { mode: 'no-cors', cache: 'no-cache' }).catch(() => {});
};
warmBackend();
setInterval(warmBackend, 3 * 60 * 1000);

// Register PWA Service Worker for Mobile & Desktop App Experience
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
