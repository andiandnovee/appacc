import { reactive } from 'vue'

export const notifyState = reactive({
  show: false,
  message: '',
  type: 'info', // success | error | info
  timeout: 3000,
})

// --- NOTIFIKASI SUKSES ---
export function notifySuccess(message, timeout = 3000) {
  notifyState.show = true
  notifyState.type = 'success'
  notifyState.message = message
  notifyState.timeout = timeout

  setTimeout(() => (notifyState.show = false), timeout)
}

// --- NOTIFIKASI ERROR ---
export function notifyError(message, timeout = 4000) {
  notifyState.show = true
  notifyState.type = 'error'
  notifyState.message = message
  notifyState.timeout = timeout

  setTimeout(() => (notifyState.show = false), timeout)
}

// --- NOTIFIKASI INFO ---
export function notifyInfo(message, timeout = 3000) {
  notifyState.show = true
  notifyState.type = 'info'
  notifyState.message = message
  notifyState.timeout = timeout

  setTimeout(() => (notifyState.show = false), timeout)
}

export default {
  success: notifySuccess,
  error: notifyError,
  info: notifyInfo,
}
