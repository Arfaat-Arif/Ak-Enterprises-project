/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react/')
          ) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/axios')) {
            return 'axios';
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.tsx'],
    globals: true,
  },
});
