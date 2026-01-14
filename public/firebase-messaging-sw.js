// public/firebase-messaging-sw.js
// Service worker minimal untuk Firebase Cloud Messaging (web push).
// Anda bisa menyesuaikan handler ini sesuai kebutuhan UI. 9e

self.addEventListener('push', function (event) {
  if (!event.data) {
    return
  }

  let payload = {}
  try {
    payload = event.data.json()
  } catch (e) {
    payload = { notification: { title: 'Notifikasi', body: event.data.text() } }
  }

  const notification = payload.notification || {}
  const title = notification.title || 'Notifikasi'
  const options = {
    body: notification.body || '',
    icon: '/favicon.ico',
    data: payload.data || {},
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

