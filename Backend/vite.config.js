import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                path.resolve(__dirname, '../Frontend/src/main.tsx'),
                path.resolve(__dirname, '../Frontend/src/css/app.css')
            ],
            refresh: [
                '../Frontend/src/**/*.{js,jsx,ts,tsx}',
                '../Frontend/src/**/*.css'
            ],
            publicDirectory: 'public',
            buildDirectory: 'build',
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../Frontend/src'),
        },
    },
    server: {
        port: 5173,
        host: 'localhost',
        hmr: {
            host: 'localhost',
            port: 5173,
        },
        cors: true,
    },
    build: {
        rollupOptions: {
            external: [],
        },
    },
});
