import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(), basicSsl()],
  define: {
    global: 'globalThis',
  },
  server: {
    host: true,
    // @ts-expect-error vite https config issue
    https: true, // SSL 활성화
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://www.momentory.store', // 백엔드 주소
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // '/api' 제거
      },
    },
  },
});
