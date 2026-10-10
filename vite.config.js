import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function nonBlockingCssPlugin() {
  return {
    name: 'non-blocking-css-plugin',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\.?\/assets\/index-[^"]+\.css)">/g,
        '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
      );
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nonBlockingCssPlugin()],
  base: './',
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const nid = id.replace(/\\/g, '/');
          if (nid.includes('/src/data/curriculumMeta')) {
            return 'curriculum-meta';
          }
          if (nid.includes('/src/data/curriculumData') || nid.includes('/src/data/curriculumEnglish')) {
            return 'curriculum-data';
          }
          if (nid.includes('/node_modules/')) {
            if (nid.includes('/preact/')) {
              return 'vendor-framework';
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

