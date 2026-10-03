import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const nid = id.replace(/\\/g, '/');
          if (nid.includes('/src/data/curriculum')) {
            return 'curriculum-data';
          }
          if (nid.includes('/node_modules/')) {
            if (nid.includes('/react/') || nid.includes('/react-dom/')) {
              return 'vendor-react';
            }
            if (nid.includes('/@supabase/')) {
              return 'vendor-supabase';
            }
            if (nid.includes('/lucide-react/')) {
              return 'vendor-icons';
            }
            if (nid.includes('/canvas-confetti/') || nid.includes('/qrcode/')) {
              return 'vendor-utils';
            }
            return 'vendor-misc';
          }
        }
      }
    }
  }
})

