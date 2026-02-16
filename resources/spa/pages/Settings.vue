<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your application settings</p>
        </div>

        <!-- Settings Tabs -->
        <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button class="px-4 py-2 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400">General</button>
            <button
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Email</button>
            <button
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Security</button>
            <button
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Notifications</button>
        </div>

        <!-- General Settings -->
        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <!-- Application Name -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Application Name</label>
                <input type="text" value="MyApp"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <p class="text-xs text-gray-500 mt-1">This is the name that will be shown throughout the application.
                </p>
            </div>

            <!-- Description -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea rows="4"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">A modern web application built with Laravel, Vue 3, and Flowbite.</textarea>
                <p class="text-xs text-gray-500 mt-1">Write a short description of your application.</p>
            </div>

            <!-- Email Settings -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Support Email</label>
                <input type="email" value="support@myapp.com"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>

            <!-- Timezone -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                <select
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option>UTC</option>
                    <option>Asia/Jakarta</option>
                    <option>Asia/Manila</option>
                    <option>Asia/Singapore</option>
                    <option>Australia/Sydney</option>
                </select>
            </div>

            <!-- Language -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                <select
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option>English</option>
                    <option>Indonesian</option>
                    <option>Filipino</option>
                    <option>Español</option>
                </select>
            </div>

            <!-- Save Button -->
            <div class="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Save Changes
                </button>
                <button
                    class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped></style>
