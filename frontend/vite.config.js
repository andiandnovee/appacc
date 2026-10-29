// vite.config.js
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function firebaseMessagingConfig(config) {
  const body = JSON.stringify(config)
  let workerTemplate
  let root
  let outDir

  const renderWorker = () => workerTemplate.replace('__FIREBASE_CONFIG__', body)

  return {
    name: 'firebase-messaging-config',
    configResolved(resolvedConfig) {
      root = resolvedConfig.root
      outDir = resolvedConfig.build.outDir
      workerTemplate = readFileSync(resolve(root, 'public/firebase-messaging-sw.js'), 'utf8')
    },
    configureServer(server) {
      server.middlewares.use('/firebase-messaging-sw.js', (_request, response) => {
        response.setHeader('Content-Type', 'application/javascript')
        response.setHeader('Cache-Control', 'no-store')
        response.end(renderWorker())
      })

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
    writeBundle() {
      writeFileSync(resolve(root, outDir, 'firebase-messaging-sw.js'), renderWorker())
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