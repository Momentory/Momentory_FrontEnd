import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(), basicSsl()],
  define: {
    global: 'globalThis',
  },
  server: {
    host: true,
    //https: true, // HTTPS 활성화 (Web Share API 필수)
    proxy: {
      '/api': {
        target: 'https://www.momentory.store',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
