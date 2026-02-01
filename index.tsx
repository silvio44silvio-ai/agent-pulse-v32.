
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Registro do Service Worker Rodney Alpha
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('Rodney Protocol: Service Worker registrado com sucesso:', registration.scope);
    }).catch(err => {
      console.log('Rodney Error: Falha no registro do Service Worker:', err);
    });
  });
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Rodney Error: Root container not found. Check index.html.");
}
