// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stdLibBrowser from 'vite-plugin-node-stdlib-browser';

export default defineConfig({
  plugins: [
    react(),
    stdLibBrowser(), // supporte crypto, stream, etc.
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
