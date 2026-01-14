// resources/js/spa/firebase-messaging-sw.js
// Service worker untuk Firebase Cloud Messaging (WEB) - gunakan SDK compat
// Catatan: file ini dilayani apa adanya oleh Vite, jadi tidak bisa memakai import ES module atau import.meta.

/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyDKRj9fz7iiGVN9CT4li74hW4tQK5CBHCU',
  authDomain: 'bskm-notif.firebaseapp.com',
  projectId: 'bskm-notif',
  messagingSenderId: '1021504898770',
  appId: '1:1021504898770:web:021d79658d84b1a8984f0b',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {}
  const title = notification.title || 'Notifikasi'
  const options = {
    body: notification.body || '',
    icon: '/favicon.ico',
    data: payload.data || {},
  }

  self.registration.showNotification(title, options)
})

// Fallback handler untuk push event langsung dari FCM HTTP v1
// Berguna jika payload tidak diproses oleh firebase.messaging()
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
