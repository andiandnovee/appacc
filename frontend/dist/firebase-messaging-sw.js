/* global importScripts, firebase, clients */

importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js");

const configUrl = new URL("/firebase-messaging-config.json", self.location.origin);

const initializeMessaging = fetch(configUrl)
  .then((response) => {
    if (!response.ok) throw new Error("Firebase web messaging configuration is missing.");
    return response.json();
  })
  .then((config) => {
    firebase.initializeApp(config);
    firebase.messaging();
  })
  .catch((error) => {
    console.error("Firebase messaging service worker failed to initialize.", error);
    throw error;
  });

self.addEventListener("install", (event) => {
  event.waitUntil(initializeMessaging.then(() => self.skipWaiting()));
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
