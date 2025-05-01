import { defineConfig, loadEnv } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  const isProduction = mode === 'production';
  const baseUrl = env.VITE_BASE_URL || '/';

  return {
    base: baseUrl,
    plugins: [
      reactPlugin({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3002',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('@radix-ui')) {
                return 'radix';
              }
              if (id.includes('react')) {
                return 'react-vendor';
              }
              return 'vendor';
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        '@emotion/react',
        '@emotion/styled',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu'
      ],
      exclude: ['js-big-decimal'],
    },
    define: {
      'process.env': process.env,
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  };
});