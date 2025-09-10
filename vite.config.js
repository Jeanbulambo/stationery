// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stdLibBrowser from 'vite-plugin-node-stdlib-browser';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    stdLibBrowser(), // supporte crypto, stream, etc.
    VitePWA({
      registerType: 'autoUpdate', // met à jour automatiquement le service worker
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Facturation Walikale to World',
        short_name: 'Facturation WTW',
        description: 'Application de facturation utilisable offline',
        theme_color: '#0066cc',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB
      },
    }),
  ],
  define: {
    global: 'globalThis', // nécessaire pour certains modules comme idb
  },
  resolve: {
    alias: {
      stream: 'node-stdlib-browser/stream',
      buffer: 'node-stdlib-browser/buffer',
      crypto: 'node-stdlib-browser/crypto',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'stream', 'crypto'],
  },
});

