import path from 'path';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envDir: '../Backend/',
  plugins: [
    laravel({
      input: ['src/main.tsx', 'src/css/app.css'],
      refresh: true,
      publicDirectory: '../Backend/public',
      buildDirectory: 'build',
      ssr: false,
    }),
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  build: {
    outDir: '../Backend/public/build',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    manifest: true
  },
  server: {
    port: 5173,
    host: 'localhost',
    cors: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@inertiajs/react',
      'ziggy-js',
      'sonner',
      'prop-types',
      '@radix-ui/react-select',
    ],
    force: true,
  },
});