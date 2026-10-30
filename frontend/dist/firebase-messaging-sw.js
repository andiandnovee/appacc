/* global importScripts, firebase, clients, {"apiKey":"AIzaSyCaC1Czc1T7OwLNIS5q9Ajx86rVsrudSUc","authDomain":"appacc-8a457.firebaseapp.com","projectId":"appacc-8a457","messagingSenderId":"667599806434","appId":"1:667599806434:web:7e92d958d92938cf7ca3bb"} */

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
