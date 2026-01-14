// resources/js/spa/utils/fcm.js
import api from '@/utils/axios'

let messagingInstance = null
let initialized = false

async function getMessagingInstance() {
  if (initialized) {
    return messagingInstance
  }

  if (typeof window === 'undefined') {
    return null
  }

  try {
    const { initializeApp } = await import('firebase/app')
    const { getMessaging, isSupported } = await import('firebase/messaging')

    const supported = await isSupported()
    if (!supported) {
      initialized = true
      messagingInstance = null
      return null
    }

    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }

    if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.messagingSenderId || !firebaseConfig.appId) {
      initialized = true
      messagingInstance = null
      return null
    }

    const app = initializeApp(firebaseConfig)
    messagingInstance = getMessaging(app)
    initialized = true
    return messagingInstance
  } catch (e) {
    initialized = true
    messagingInstance = null
    return null
  }
}

/**
 * Minta izin browser dan daftar device token ke backend.
 * Dipanggil otomatis setelah token API terset.
 */
export async function registerFcmDeviceIfSupported() {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return
  }

  if (!('serviceWorker' in navigator)) {
    return
  }

  try {
    const messaging = await getMessagingInstance()
    if (!messaging) {
      return
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      return
    }

    const { getToken } = await import('firebase/messaging')
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY

    // Daftarkan service worker secara eksplisit, lalu gunakan pada getToken
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

    // Pastikan service worker sudah aktif sebelum subscribe push
    if (!registration.active) {
      await new Promise((resolve) => {
        const maxWait = 10000
        const start = Date.now()
        const check = () => {
          if (registration.active || Date.now() - start > maxWait) {
            resolve()
          } else {
            setTimeout(check, 200)
          }
        }
        check()
      })
    }

    const deviceToken = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration: registration,
    })

    if (!deviceToken) {
      return
    }

    // Kirim ke backend (akan disimpan di user_devices)
    await api.post('/api/v1/user/devices', {
      device_token: deviceToken,
      platform: 'web',
      device_name: navigator.userAgent.slice(0, 100),
    })
  } catch (e) {
  }
}
