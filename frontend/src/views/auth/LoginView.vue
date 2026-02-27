<template>
    <div class="w-full max-w-md">
        <fwb-card>
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p class="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            <!-- Error Message -->
            <fwb-alert v-if="error" type="danger" class="mb-4">
                {{ error }}
            </fwb-alert>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="space-y-4 mb-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <fwb-input id="email" v-model="form.email" type="email" required placeholder="your@email.com"
                        class="mt-1" />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <fwb-input id="password" v-model="form.password" type="password" required placeholder="••••••••"
                        class="mt-1" />
                </div>

                <fwb-button type="submit" :disabled="loading" class="w-full" size="lg">
                    <svg v-if="loading" class="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {{ loading ? 'Signing in...' : 'Sign in' }}
                </fwb-button>
            </form>

            <!-- Divider -->
            <div class="relative mb-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">OR</span>
                </div>
            </div>

            <!-- OAuth Buttons -->
            <div class="space-y-3">
                <fwb-button @click="loginWithGoogle" :disabled="loading" color="light" class="w-full justify-center">
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </fwb-button>

                <fwb-button @click="loginWithFacebook" :disabled="loading" color="light" class="w-full justify-center">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                </fwb-button>
            </div>

            <!-- Demo Credentials -->
            <fwb-alert type="info" class="mt-6">
                <strong>Demo Credentials:</strong><br />
                Email: admin@admin.com<br />
                Password: password
            </fwb-alert>
        </fwb-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { TheCard as FwbCard, Alert as FwbAlert, Button as FwbButton, Input as FwbInput } from 'flowbite-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    email: '',
    password: '',
})
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
    loading.value = true
    error.value = ''

    try {
        await authStore.login(form.value.email, form.value.password)
        router.push('/dashboard')
    } catch (err) {
        error.value = err.response?.data?.message || 'Login failed. Please try again.'
    } finally {
        loading.value = false
    }
}

const loginWithGoogle = async () => {
    try {
        await authStore.loginWithGoogle()
    } catch (err) {
        error.value = 'Google login failed'
    }
}

const loginWithFacebook = async () => {
    try {
        await authStore.loginWithFacebook()
    } catch (err) {
        error.value = 'Facebook login failed'
    }
}
</script>

<style scoped></style>
