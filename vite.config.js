// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const apiBase = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default defineConfig({
  root: path.resolve(__dirname, 'resources/js/spa'),
  envDir: '../../..',
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js/spa'),
    },
  },
  server: {
    host: 'localhost',
    port: 5173,
    proxy: {
      '/api': apiBase,
    },
  },
  build: {
    outDir: '../../../public/spa',
    emptyOutDir: true,
  },
  plugins: [vue()],
})
