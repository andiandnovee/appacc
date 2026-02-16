<template>
    <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />

        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar -->
            <Sidebar :is-open="sidebarOpen" />

            <!-- Main Content Area -->
            <main class="flex-1 overflow-auto">
                <div class="p-4 md:p-8">
                    <router-view />
                </div>
            </main>
        </div>

        <!-- Footer -->
        <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div class="max-w-full px-4 py-6 md:flex md:items-center md:justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                    © 2026 <a href="#" class="text-blue-600 hover:underline dark:text-blue-400">MyApp</a>. All rights
                    reserved.
                </span>
                <div class="flex mt-4 space-x-5 sm:justify-center md:mt-0">
                    <a href="#" class="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M8.29 20v-7.21h-2.3V9.25h2.3V7.31c0-2.3 1.4-3.55 3.45-3.55 1.05 0 1.95.08 2.2.11v2.57h-1.5c-1.2 0-1.48.57-1.48 1.4v1.83h2.95l-2.3 3.54h2.3V20h-2.3">
                            </path>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'

const sidebarOpen = ref(true)
</script>

<style scoped></style>
