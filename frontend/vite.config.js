import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const PORT = Number(process.env.PORT) || 4173; // Node.js env variable

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: PORT,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: PORT,
    strictPort: true,
    allowedHosts: ['blog-app-1-kvkp.onrender.com'], // your Render URL
  },
});

