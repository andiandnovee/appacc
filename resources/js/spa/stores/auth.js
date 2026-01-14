// resources/js/spa/stores/auth.js
import { defineStore } from 'pinia'
import axios from "axios"
import api from "@/utils/axios"   // ← WAJIB ditambahkan
import { registerFcmDeviceIfSupported } from '@/utils/fcm'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    refreshToken: null,
    loaded: false,
    logoutTimer: null, // Timer untuk auto-logout
  }),

  getters: {
    permissions: (state) => state.user?.permissions || [],
    hasPermission: (state) => (perm) => state.permissions.includes(perm),
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // ===========================
    // Simpan token dan set header
    // ===========================
    setToken(token, refreshToken = null) {
      this.token = token
      if (refreshToken) {
        this.refreshToken = refreshToken
        localStorage.setItem('bskm_refresh_token', refreshToken)
      }
      localStorage.setItem('bskm_token', token)

      // header token ke axios asli
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // header token ke axios instance (api) → PENTING
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Daftarkan FCM device secara silent (jika browser mendukung)
      if (typeof window !== 'undefined') {
        registerFcmDeviceIfSupported().catch((e) => {
        })
      }

      // Setup auto-logout timer (12 jam = 43200000 ms)
      this.setupAutoLogoutTimer()
    },

    // ===========================
    // Setup timer untuk auto-logout setelah 12 jam
    // ===========================
    setupAutoLogoutTimer() {
      // Clear timer lama jika ada
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer)
      }

      // Set timer logout: 12 jam
      const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000
      this.logoutTimer = setTimeout(() => {
        console.warn('[AUTH] Token telah expired (12 jam), logout otomatis...')
        this.clearAuth()

        // Redirect ke login jika di browser
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }, TWELVE_HOURS_IN_MS)
    },

    // ===========================
    // Hapus timer dan reset user
    // ===========================
    clearAuth() {
      this.user = null
      this.token = null
      this.loaded = false

      // Clear auto-logout timer
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer)
        this.logoutTimer = null
      }

      // Hapus dari localStorage
      localStorage.removeItem('bskm_token')
      localStorage.removeItem('bskm_refresh_token')
      localStorage.removeItem('bskm_user')

      // Hapus dari axios headers
      delete axios.defaults.headers.common['Authorization']
      delete api.defaults.headers.common['Authorization']

      // Tambahan: pastikan cookie session juga dihapus jika ada
      if (typeof document !== 'undefined') {
        document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = 'LARAVEL_SESSION=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
    },

    // ===========================
    // Ambil data user dari backend
    // ===========================
    async fetchUser() {
      try {
        const res = await api.get('/api/user', {
          headers: { Accept: 'application/json' },
        })

        const data = res.data.user || res.data

        this.user = {
          ...data,
          roles: data.roles || [],
          permissions: data.permissions || [],
        }

        this.loaded = true
        return this.user

      } catch (e) {
        this.clearAuth()
        this.loaded = true
        throw e
      }
    },

    // ===========================
    // Inisialisasi awal dari localStorage
    // ===========================
    initFromStorage() {
      const token = localStorage.getItem('bskm_token')
      const refreshToken = localStorage.getItem('bskm_refresh_token')
      if (token) {
        this.setToken(token, refreshToken)
      }
    },

    // ===========================
    // Refresh token ketika access token akan expired
    // ===========================
    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.clearAuth()
        return false
      }

      try {
        // Set header dengan refresh token untuk request refresh
        const temp = api.defaults.headers.common['Authorization']
        api.defaults.headers.common['Authorization'] = `Bearer ${this.refreshToken}`

        const res = await api.post('/refresh')

        // Restore header
        api.defaults.headers.common['Authorization'] = temp

        if (res.data?.success && res.data?.token) {
          this.setToken(res.data.token, this.refreshToken)
          return true
        }
      } catch (e) {
        console.error('[AUTH] Token refresh gagal:', e.message)
        this.clearAuth()
        return false
      }
    },
  },
})
