<template>
    <div class="h-full w-64 bg-gray-800 text-white flex flex-col">
        <div class="overflow-y-auto py-4 px-3">
            <ul class="space-y-2">
                <li v-for="item in menuItems" :key="item.path">
                    <RouterLink :to="item.path" :class="[
                        'flex items-center p-2 text-base font-normal rounded-lg transition',
                        route.path === item.path
                            ? 'bg-gray-700 font-semibold'
                            : 'hover:bg-gray-700'
                    ]">
                        <svg class="w-5 h-5 text-gray-400" fill="currentColor" :viewBox="item.icon">
                            <path :d="item.iconPath" />
                        </svg>
                        <span class="ml-3">{{ item.label }}</span>
                    </RouterLink>
                </li>
            </ul>
        </div>

        <div class="mt-auto p-4 border-t border-gray-700">
            <div class="flex items-center gap-3">
                <img :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=' + authStore.user?.name"
                    class="w-10 h-10 rounded-full" />
                <div>
                    <p class="text-sm font-medium">
                        {{ authStore.user?.name }}
                    </p>
                    <span class="text-xs text-gray-400">
                        {{ authStore.user?.roles?.[0] || 'User' }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Sidebar as FwbSidebar } from 'flowbite-vue'
import { useAuthStore } from '@/stores/auth'
import { usePermission } from '@/composables/usePermission'

const authStore = useAuthStore()
const { hasPermission } = usePermission()
const route = useRoute()

const allMenuItems = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: '0 0 24 24',
        iconPath: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h12a1 1 0 001-1v-10',
    },
    {
        path: '/users',
        label: 'Users',
        icon: '0 0 24 24',
        iconPath: 'M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a2 2 0 002 2h14a2 2 0 002-2V9h-6',
        permission: 'view users',
    },
    {
        path: '/roles',
        label: 'Roles',
        icon: '0 0 24 24',
        iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
        permission: 'view roles',
    },
    {
        path: '/settings',
        label: 'Settings',
        icon: '0 0 24 24',
        iconPath: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
        permission: 'view settings',
    },
]

const menuItems = computed(() => {
    return allMenuItems.filter((item) => {
        if (item.permission) {
            return hasPermission(item.permission)
        }
        return true
    })
})

const isActive = (path) => {
    return route.path === path
}
</script>

<style scoped></style>
<style scoped></style>
