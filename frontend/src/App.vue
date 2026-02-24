<template>
    <div id="app">
        <component v-if="layout" :is="layout">
            <RouterView />
        </component>
        <RouterView v-else />
    </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const layout = computed(() => {
    const currentRoute = router.currentRoute.value

    if (currentRoute.meta.layout === 'auth') {
        return AuthLayout
    } else if (currentRoute.meta.layout === 'dashboard' || authStore.isAuthenticated) {
        return DashboardLayout
    }

    return null
})

// Initialize auth on app load
watch(
    () => authStore.isAuthenticated,
    (isAuthenticated) => {
        if (!isAuthenticated && router.currentRoute.value.meta.requiresAuth) {
            router.push('/login')
        }
    }
)
</script>

<style scoped>
#app {
    min-height: 100vh;
}
</style>
