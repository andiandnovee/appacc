import axios from "axios"
import notify from "@/utils/notify"
import { useAuthStore } from "@/stores/auth"

const api = axios.create({
  baseURL: '/api'
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  isRefreshing = false
  failedQueue = []
}

api.interceptors.response.use(
    (response) => {
        const msg = response.data?.message
        const total = response.data?.meta?.total

        if (response.data?.success && msg) {
            if (typeof total !== "undefined") {
                notify.success(`${msg} ( ${total} records)`)
            } else {
                notify.success(msg)
            }
        }

        return response
    },
    (error) => {
        const originalRequest = error.config
        const data = error.response?.data

        // Handle 401 Unauthorized - coba refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                  failedQueue.push({ resolve, reject })
                }).then(token => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`
                  return api(originalRequest)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            const authStore = useAuthStore()
            return authStore.refreshAccessToken().then(success => {
                if (success) {
                    processQueue(null, authStore.token)
                    originalRequest.headers['Authorization'] = `Bearer ${authStore.token}`
                    return api(originalRequest)
                } else {
                    processQueue(error, null)
                    return Promise.reject(error)
                }
            }).catch(err => {
                processQueue(err, null)
                return Promise.reject(err)
            })
        }

        // Handle other errors
        const backendErrors = data?.errors
        const backendMessage = data?.message

        let msg = "Terjadi kesalahan"

        if (typeof backendErrors === "string") {
            msg = backendErrors
        }
        else if (typeof backendErrors === "object") {
            msg = Object.values(backendErrors).flat().join(", ")
        }
        else if (backendMessage) {
            msg = backendMessage
        }

        notify.error(msg)
        return Promise.reject(error)
    }
)

export default api
