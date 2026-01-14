import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import path from 'path'

export default defineConfig({
  appType: 'spa',
  root: path.resolve(__dirname, 'resources/js/spa'), // ✅ sudah absolut
  envDir: '../../..',
  base: '/',
  plugins: [
    laravel({
      input: ['app.js'],
      refresh: true,
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js/spa'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    cors: true,
    strictPort: true,
    fs: {
      // ✅ gunakan path absolut, bukan relatif
      allow: [path.resolve(__dirname, 'resources/js/spa')],
    },
  },
  build: {
    outDir: '../../../public/spa',
    emptyOutDir: true,
  },
})
