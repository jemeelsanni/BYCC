import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (dev/prod)
  const env = loadEnv(mode, process.cwd(), '');

  // Determine API URL based on environment
  const apiUrl = mode === 'development'
    ? 'http://localhost:3002' // Local backend during development
    : env.VITE_API_URL || 'https://byc-backend-tt0z.onrender.com'; // Render backend URL

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '') // Remove /api prefix if backend doesn't expect it
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode !== 'production', // Disable sourcemaps in production
      chunkSizeWarningLimit: 1600, // Larger chunks for better optimization
    },
    // Use Render's URL as base path in production
    base: mode === 'production' ? env.VITE_BASE_PATH || '/' : '/',
  };
});