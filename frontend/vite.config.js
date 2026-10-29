// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function firebaseMessagingConfig(config) {
  const body = JSON.stringify(config)

  return {
    name: 'firebase-messaging-config',
    configureServer(server) {
      server.middlewares.use('/firebase-messaging-config.json', (_request, response) => {
        response.setHeader('Content-Type', 'application/json')
        response.setHeader('Cache-Control', 'no-store')
        response.end(body)
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'firebase-messaging-config.json',
        source: body,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [
      react(),
      firebaseMessagingConfig({
        apiKey: env.VITE_FIREBASE_API_KEY ?? '',
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
        projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
        appId: env.VITE_FIREBASE_APP_ID ?? '',
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  }
})