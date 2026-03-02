import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
    // Initialize token and user from localStorage
    const token = ref(localStorage.getItem('token') || null)
    const storedUser = localStorage.getItem('user')
    const user = ref(storedUser ? JSON.parse(storedUser) : null)

    const isAuthenticated = computed(() => !!token.value)

    const userRoles = computed(() => user.value?.roles || [])

    const userPermissions = computed(() => user.value?.permissions || [])

    async function login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password })

            if (response.data.success) {
                token.value = response.data.data.token
                user.value = response.data.data.user
                localStorage.setItem('token', token.value)
                localStorage.setItem('user', JSON.stringify(user.value))
                return response.data
            }
        } catch (error) {
            throw error
        }
    }

    async function loginWithGoogle() {
        try {
            const response = await api.get('/auth/google/redirect')
            if (response.data.success) {
                window.location.href = response.data.data.redirect_url
            }
        } catch (error) {
            throw error
        }
    }

    async function loginWithFacebook() {
        try {
            const response = await api.get('/auth/facebook/redirect')
            if (response.data.success) {
                window.location.href = response.data.data.redirect_url
            }
        } catch (error) {
            throw error
        }
    }

    async function logout() {
        try {
            await api.post('/auth/logout')
        } finally {
            token.value = null
            user.value = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    }

    async function fetchMe() {
        try {
            const response = await api.get('/auth/me')
            if (response.data.success) {
                user.value = response.data.data
                localStorage.setItem('user', JSON.stringify(user.value))
                return response.data
            }
        } catch (error) {
            token.value = null
            localStorage.removeItem('token')
            throw error
        }
    }

    function setToken(value) {
        token.value = value
        if (value) {
            localStorage.setItem('token', value)
        } else {
            localStorage.removeItem('token')
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        userRoles,
        userPermissions,
        login,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        fetchMe,
        setToken,
    }
})
