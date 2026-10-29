import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import api from "../api/axios";

const TOKEN_KEY = "appacc_fcm_web_token";
let foregroundUnsubscribe: (() => void) | null = null;

function firebaseOptions(): FirebaseOptions {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
}

function getFirebaseApp() {
  const options = firebaseOptions();
  const missing = Object.entries(options)
    .filter(([key, value]) => key !== "authDomain" && !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Konfigurasi Firebase web belum lengkap: ${missing.join(", ")}`);
  }

  return getApps()[0] ?? initializeApp(options);
}

export async function enableWebPush(): Promise<"granted" | "denied" | "default" | "unsupported"> {
  if (!(await isSupported()) || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return "unsupported";
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission;

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) throw new Error("VITE_FIREBASE_VAPID_KEY belum dikonfigurasi.");

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  const messaging = getMessaging(getFirebaseApp());
  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });
  if (!token) throw new Error("Firebase tidak mengembalikan web push token.");

  await api.post("/user/devices", {
    device_token: token,
    platform: "web",
    device_name: navigator.userAgent.slice(0, 100),
  });
  localStorage.setItem(TOKEN_KEY, token);

  listenForForegroundMessages(messaging, registration);

  return "granted";
}

export async function initializeForegroundPush(): Promise<void> {
  if (!(await isSupported()) || Notification.permission !== "granted" || !localStorage.getItem(TOKEN_KEY)) {
    return;
  }

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  listenForForegroundMessages(getMessaging(getFirebaseApp()), registration);
}

function listenForForegroundMessages(
  messaging: ReturnType<typeof getMessaging>,
  registration: ServiceWorkerRegistration,
): void {
  foregroundUnsubscribe?.();
  foregroundUnsubscribe = onMessage(messaging, (payload) => {
    void registration.showNotification(payload.notification?.title ?? "APPACC", {
      body: payload.notification?.body,
      data: payload.data,
      icon: "/favicon.png",
    });
  });
}

export async function disableWebPush(): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return;

  try {
    await api.delete("/user/devices", { data: { device_token: token } });
    if (await isSupported()) await deleteToken(getMessaging(getFirebaseApp()));
    foregroundUnsubscribe?.();
    foregroundUnsubscribe = null;
  } finally {
    localStorage.removeItem(TOKEN_KEY);
  }
}
