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

  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const nid = id.replace(/\\/g, '/');
          // عزل بيانات المنهج الكاملة الكبيرة (300 كيلوبايت) لتُحمل بالطلب فقط
          if (nid.includes('/src/data/curriculumData') || nid.includes('/src/data/curriculumEnglish')) {
            return 'curriculum-data';
          }
          if (nid.includes('/node_modules/')) {
            // عزل مكتبة سوبابيز الثقيلة (208 كيلوبايت) لتُحمل بالطلب فقط
            if (nid.includes('/@supabase/')) {
              return 'vendor-supabase';
            }
            // عزل أدوات المؤثرات (كونفيتي وباركود) لتُحمل بالطلب فقط
            if (nid.includes('/canvas-confetti/') || nid.includes('/qrcode/')) {
              return 'vendor-utils';
            }
          }
        }
      }
    }
  }
})

