<template>
    <div id="app">
        <component :is="layout" :key="$route.fullPath">
            <RouterView />
        </component>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const layout = computed(() => {
    const layoutMeta = route.meta.layout

    if (layoutMeta === 'auth') {
        return AuthLayout
    }

    if (layoutMeta === 'dashboard') {
        return DashboardLayout
    }

    // Fallback default supaya tidak pernah null
    return DashboardLayout
})

// Proteksi route yang butuh login
watch(
    () => authStore.isAuthenticated,
    (isAuthenticated) => {
        if (!isAuthenticated && route.meta.requiresAuth) {
            router.push('/login')
        }
    },
    { immediate: true }
)
</script>

<style scoped>
#app {
    min-height: 100vh;
}
</style>