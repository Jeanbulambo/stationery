// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';
import App from './App.jsx';

// 👉 Import du registre du service worker
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// 👉 Active le Service Worker (PWA)
const updateSW = registerSW({
  onNeedRefresh() {
    // Alerte si une nouvelle version est dispo
    if (confirm("Une nouvelle version est disponible. Voulez-vous l’actualiser ?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    // Alerte lorsque l’app est prête offline
    alert("✅ L’application est prête à fonctionner hors-ligne !");
  },
});
