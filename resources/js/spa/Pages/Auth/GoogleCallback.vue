<!-- resources/js/spa/Pages/Auth/GoogleCallback.vue -->

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen
           text-gray-700 dark:text-gray-300 p-3 sm:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800"
  >
    <div class="text-center space-y-3 sm:space-y-4">
      <div class="flex justify-center mb-3 sm:mb-4">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
      <h1 class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Menyelesaikan proses login...</h1>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        Harap tunggu sebentar
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/utils/axios'        // ✔ instance api sudah benar

const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  // Matikan router guard sementara
  window.isProcessingCallback = true

  try {
    const token = new URLSearchParams(window.location.search).get('token')

    if (!token) {
      return router.replace({ name: 'Landing' })
    }

    // Simpan token ke localStorage
    localStorage.setItem('bskm_token', token)

    // Simpan token ke store (ini juga men-setup header api & axios)
    auth.setToken(token)
  } catch (err) {
    localStorage.removeItem('bskm_token')
    auth.clearAuth()
    return router.replace({ name: 'Landing' })
  } finally {
    // Mengembalikan router guard
    window.isProcessingCallback = false
    // Redirect ke Landing → guard akan memutuskan halaman selanjutnya
    router.replace({ name: 'Landing' })
  }
})
</script>
