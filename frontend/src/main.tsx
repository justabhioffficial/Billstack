import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Background self-warming ping to ensure Render backend is warm and fast
const warmBackend = () => {
  const apiBase = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE_URL || 'https://mybillstack.onrender.com/api/v1';
  const cleanBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
  const backendHealthUrl = cleanBase.endsWith('/health') ? cleanBase : `${cleanBase}/health`;
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
