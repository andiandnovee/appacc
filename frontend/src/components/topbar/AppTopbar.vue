<template>
    <fwb-navbar class="bg-white border-b border-gray-200">
        <template #default="{ isOpen }">
            <div class="w-full flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h2>

                <div class="flex items-center gap-4">
                    <!-- Notifications Button -->
                    <fwb-button color="light" class="relative">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </fwb-button>

                    <!-- User Dropdown -->
                    <fwb-dropdown :arrowIcon="false" :inline="true">
                        <template #trigger>
                            <fwb-button color="light" class="flex items-center gap-2">
                                <img :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=' + authStore.user?.name"
                                    class="w-8 h-8 rounded-full" />
                                <span class="text-sm font-medium text-gray-700">{{ authStore.user?.name }}</span>
                            </fwb-button>
                        </template>
                        <div class="py-1">
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                            <div class="border-t my-1"></div>
                            <button @click="logout"
                                class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                        </div>
                    </fwb-dropdown>
                </div>
            </div>
        </template>
    </fwb-navbar>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Navbar as FwbNavbar, Button as FwbButton, Dropdown as FwbDropdown } from 'flowbite-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const pageTitle = computed(() => {
    const titles = {
        '/dashboard': 'Dashboard',
        '/users': 'Users',
        '/roles': 'Roles',
        '/settings': 'Settings',
    }
    return titles[route.path] || 'Dashboard'
})

const logout = async () => {
    await authStore.logout()
    router.push('/login')
}
</script>

<style scoped></style>
