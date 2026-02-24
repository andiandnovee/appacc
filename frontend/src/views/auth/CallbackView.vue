<template>
    <div class="flex flex-col items-center justify-center min-h-screen">
        <div class="text-center">
            <svg class="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8h-2c0-3.309-2.691-6-6-6v2c3.314 0 6 2.686 6 6h2c0-4.418-3.582-8-8-8v2zm0 0v6m0-6H0m0 6v-6h2m0 6h18v2H4z" />
            </svg>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Completing your login...</h2>
            <p class="text-gray-600">Please wait while we redirect you.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
    try {
        // Get token from query params
        const token = new URLSearchParams(window.location.search).get('token')

        if (!token) {
            router.push('/login?error=Missing token')
            return
        }

        // Set token in auth store
        authStore.setToken(token)

        // Fetch user data
        await authStore.fetchMe()

        // Redirect to dashboard
        router.push('/dashboard')
    } catch (error) {
        console.error('OAuth callback error:', error)
        router.push('/login?error=Authentication failed')
    }
})
</script>

<style scoped></style>
