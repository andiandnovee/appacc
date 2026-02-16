<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Permissions</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">Manage user roles and permissions</p>
            </div>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                + New Role
            </button>
        </div>

        <!-- Roles Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Admin Role -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Admin</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Full system access</p>
                    </div>
                    <button class="text-blue-600 hover:underline text-sm">Edit</button>
                </div>
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="checkbox" checked class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Create Users</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" checked class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Edit Users</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" checked class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Delete Users</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" checked class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">View Reports</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" checked class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">System Settings</span>
                    </label>
                </div>
            </div>

            <!-- User Role -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">User</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Limited access</p>
                    </div>
                    <button class="text-blue-600 hover:underline text-sm">Edit</button>
                </div>
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="checkbox" class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Create Users</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" checked class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Edit Profile</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Delete Users</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" checked class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">View Reports</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">System Settings</span>
                    </label>
                </div>
            </div>

            <!-- Moderator Role -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Moderator</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Moderate content</p>
                    </div>
                    <button class="text-blue-600 hover:underline text-sm">Edit</button>
                </div>
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="checkbox" class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Create Users</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" checked class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Edit Users</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" checked class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Delete Users</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" checked class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">View Reports</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" class="w-4 h-4 rounded" />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">System Settings</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped></style>
