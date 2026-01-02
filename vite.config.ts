import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      proxy: {
        '/auth': 'http://localhost:8000',
        '/orders': 'http://localhost:8000',
        '/deliveries': 'http://localhost:8000',
        '/analytics': 'http://localhost:8000',
        '/exports': 'http://localhost:8000',
        '/admin': 'http://localhost:8000',
       },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
