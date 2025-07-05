import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || ''),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    server: {
      port: 3000,
      host: true,
      strictPort: true,
      hmr: {
        host: 'localhost'
      }
    },
    preview: {
      port: Number(process.env.PORT) || 4173, // Render will set the PORT env var
      host: true, // Listen on all addresses, including Render's internal network
      strictPort: true,
      allowedHosts: [
        '.onrender.com' // Allows your main Render URL and preview URLs
      ]
    }
  };
});
