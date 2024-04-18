import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const fallbackPort = 5143;
  const env = loadEnv(mode, '../');
  const API_URL = `${env.VITE_BASE_API_URL ?? `http://localhost:${fallbackPort}`}`;
  const PORT = parseInt(`${env.VITE_FRONTEND_PORT ?? `${fallbackPort}`}`);

  return {
    plugins: [react()],
    envDir: '../',
    resolve: {
      alias: {
        '@': '/src',
        '@assets': '/public/assets',
      },
    },
    server: {
      '/api': API_URL,
      port: PORT,
    },
  };
});
