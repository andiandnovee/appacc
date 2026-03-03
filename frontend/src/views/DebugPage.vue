<template>
    <div class="p-8 bg-white min-h-screen">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold mb-8">🔍 Permission & Auth Debug</h1>

            <!-- LocalStorage Check -->
            <div class="mb-8 p-6 bg-gray-100 rounded-lg">
                <h2 class="text-xl font-bold mb-4">📦 LocalStorage Data</h2>
                <div class="space-y-4">
                    <div class="bg-white p-4 rounded border-l-4 border-blue-500">
                        <p class="font-mono text-sm break-all">
                            <strong>token:</strong> {{ storageToken ? storageToken.substring(0, 50) + '...' : 'NULL' }}
                        </p>
                    </div>
                    <div class="bg-white p-4 rounded border-l-4 border-green-500">
                        <p class="font-mono text-sm"><strong>user (full):</strong></p>
                        <pre class="mt-2 text-xs overflow-auto bg-gray-50 p-2 rounded">{{ storageUser }}</pre>
                    </div>
                </div>
            </div>

            <!-- Auth Store Check -->
            <div class="mb-8 p-6 bg-gray-100 rounded-lg">
                <h2 class="text-xl font-bold mb-4">🏪 Auth Store State</h2>
                <div class="space-y-4">
                    <div class="bg-white p-4 rounded">
                        <p><strong>isAuthenticated:</strong> <span
                                :class="authStore.isAuthenticated ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">{{
                                authStore.isAuthenticated }}</span></p>
                    </div>
                    <div class="bg-white p-4 rounded">
                        <p><strong>user:</strong></p>
                        <pre
                            class="mt-2 text-xs overflow-auto bg-gray-50 p-2 rounded">{{ JSON.stringify(authStore.user, null, 2) }}</pre>
                    </div>
                    <div class="bg-white p-4 rounded">
                        <p><strong>userRoles:</strong> <code class="text-sm">{{ authStore.userRoles }}</code></p>
                    </div>
                    <div class="bg-white p-4 rounded bg-yellow-50 border-l-4 border-yellow-500">
                        <p><strong>userPermissions:</strong></p>
                        <div class="mt-2 grid grid-cols-2 gap-2">
                            <div v-if="authStore.userPermissions.length === 0"
                                class="col-span-2 text-red-600 font-bold">
                                ❌ EMPTY! Permissions tidak ada di store
                            </div>
                            <div v-else v-for="perm in authStore.userPermissions" :key="perm"
                                class="bg-blue-100 p-2 rounded text-sm">
                                ✓ {{ perm }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Permission Check -->
            <div class="mb-8 p-6 bg-gray-100 rounded-lg">
                <h2 class="text-xl font-bold mb-4">🔐 Permission Check</h2>
                <div class="space-y-2">
                    <div v-for="perm in testPermissions" :key="perm"
                        class="bg-white p-3 rounded flex items-center justify-between">
                        <span class="font-mono text-sm">{{ perm }}</span>
                        <span :class="hasPermission(perm) ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
                            class="px-3 py-1 rounded text-sm font-bold">
                            {{ hasPermission(perm) ? '✓ YES' : '✗ NO' }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- AppSidebar Menu Check -->
            <div class="mb-8 p-6 bg-gray-100 rounded-lg">
                <h2 class="text-xl font-bold mb-4">📋 AppSidebar Menu Items</h2>
                <div class="space-y-3">
                    <div v-for="item in allMenuItems" :key="item.path"
                        class="bg-white p-4 rounded flex items-center justify-between border-l-4"
                        :class="isMenuVisible(item) ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'">
                        <div>
                            <p class="font-bold">{{ item.label }}</p>
                            <p class="text-xs text-gray-600">{{ item.path }}</p>
                            <p v-if="item.permission" class="text-xs text-gray-600">Permission:
                                <code>{{ item.permission }}</code></p>
                        </div>
                        <span :class="isMenuVisible(item) ? 'bg-green-500' : 'bg-red-500'"
                            class="text-white px-3 py-1 rounded font-bold">
                            {{ isMenuVisible(item) ? '✓ VISIBLE' : '✗ HIDDEN' }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Router Links Test -->
            <div class="mb-8 p-6 bg-gray-100 rounded-lg">
                <h2 class="text-xl font-bold mb-4">🔗 Router Links</h2>
                <div class="space-y-2 bg-white p-4 rounded">
                    <p class="font-mono text-sm"><strong>Dashboard:</strong>
                        <RouterLink to="/dashboard" class="text-blue-600 hover:underline">/dashboard</RouterLink>
                    </p>
                    <p class="font-mono text-sm"><strong>Users:</strong>
                        <RouterLink v-if="hasPermission('view users')" to="/users"
                            class="text-blue-600 hover:underline">/users</RouterLink><span v-else class="text-red-600">❌
                            No permission</span>
                    </p>
                    <p class="font-mono text-sm"><strong>Roles:</strong>
                        <RouterLink v-if="hasPermission('view roles')" to="/roles"
                            class="text-blue-600 hover:underline">/roles</RouterLink><span v-else class="text-red-600">❌
                            No permission</span>
                    </p>
                    <p class="font-mono text-sm"><strong>Settings:</strong>
                        <RouterLink v-if="hasPermission('view settings')" to="/settings"
                            class="text-blue-600 hover:underline">/settings</RouterLink><span v-else
                            class="text-red-600">❌ No permission</span>
                    </p>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mb-8 p-6 bg-gray-100 rounded-lg">
                <h2 class="text-xl font-bold mb-4">⚙️ Actions</h2>
                <div class="space-y-2">
                    <button @click="refreshAuth" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Refresh Auth (fetchMe)
                    </button>
                    <button @click="clearAuth" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        Clear Auth & Logout
                    </button>
                    <button @click="logConsole" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                        Log to Console (Ctrl+Shift+J)
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermission } from '@/composables/usePermission'

const authStore = useAuthStore()
const { hasPermission } = usePermission()

const storageToken = localStorage.getItem('token')
const storageUser = localStorage.getItem('user')

const testPermissions = [
    'view users',
    'view roles',
    'view settings',
    'view dashboard',
    'create users',
]

const allMenuItems = [
    { path: '/dashboard', label: 'Dashboard', permission: null },
    { path: '/users', label: 'Users', permission: 'view users' },
    { path: '/roles', label: 'Roles', permission: 'view roles' },
    { path: '/settings', label: 'Settings', permission: 'view settings' },
]

const isMenuVisible = (item) => {
    if (item.permission) {
        return hasPermission(item.permission)
    }
    return true
}

const refreshAuth = async () => {
    try {
        await authStore.fetchMe()
        alert('✓ Auth refreshed!')
        window.location.reload()
    } catch (error) {
        alert('✗ Error: ' + error.message)
    }
}

const clearAuth = () => {
    authStore.logout()
    alert('Logged out. Redirecting...')
    window.location.href = '/login'
}

const logConsole = () => {
    console.clear()
    console.log('%c=== AUTO DEBUG INFO ===', 'font-size: 16px; font-weight: bold;')
    console.log('User:', authStore.user)
    console.log('Roles:', authStore.userRoles)
    console.log('Permissions:', authStore.userPermissions)
    console.log('localStorage user:', JSON.parse(localStorage.getItem('user') || '{}'))
    alert('✓ Check console (Ctrl+Shift+J)')
}
</script>

<style scoped></style>
