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

});
