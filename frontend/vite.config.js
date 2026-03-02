import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { resolve } from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
    base: '/',
    plugins: [vue()],
    server: {
        port: 5173,
        host: true,
        middlewareMode: false,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
})
