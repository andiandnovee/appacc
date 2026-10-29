/* global importScripts, firebase, clients, __FIREBASE_CONFIG__ */

importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js");

firebase.initializeApp(__FIREBASE_CONFIG__);
firebase.messaging();

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const route = event.notification.data?.route;
  const destination = typeof route === "string" && route.startsWith("/") && !route.startsWith("//")
    ? new URL(route, self.location.origin)
    : new URL("/", self.location.origin);
  event.waitUntil(clients.openWindow(destination.href));
});
