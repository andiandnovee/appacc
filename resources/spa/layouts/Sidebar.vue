<template>
    <aside :class="[
        'w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]" class="fixed md:static top-0 left-0 h-full z-30 md:z-auto mt-14 md:mt-0">
        <nav class="px-4 py-6 space-y-2 overflow-y-auto h-full">
            <!-- Dashboard Section -->
            <div class="mb-6">
                <h3 class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Main
                </h3>
                <ul class="space-y-1">
                    <li>
                        <router-link to="/dashboard"
                            active-class="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-l-4 border-blue-600"
                            class="flex items-center px-4 py-2.5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4m0 0H8">
                                </path>
                            </svg>
                            <span>Dashboard</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/components"
                            active-class="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-l-4 border-blue-600"
                            class="flex items-center px-4 py-2.5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z">
                                </path>
                            </svg>
                            <span>Components</span>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- Analytics Section -->
            <div class="mb-6">
                <h3 class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Analytics
                </h3>
                <ul class="space-y-1">
                    <li>
                        <router-link to="/analytics"
                            active-class="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-l-4 border-blue-600"
                            class="flex items-center px-4 py-2.5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                                </path>
                            </svg>
                            <span>Analytics</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/reports"
                            active-class="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-l-4 border-blue-600"
                            class="flex items-center px-4 py-2.5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4">
                                </path>
                            </svg>
                            <span>Reports</span>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- Users Section -->
            <div class="mb-6">
                <h3 class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Users
                </h3>
                <ul class="space-y-1">
                    <li>
                        <router-link to="/users"
                            active-class="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-l-4 border-blue-600"
                            class="flex items-center px-4 py-2.5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4.354a4 4 0 110 8.048M12 4.354A4 4 0 008.646 8.646a4 4 0 010 8.708A4 4 0 0112 19.354a4 4 0 003.354-3.354A4 4 0 0012 4.354zM8 12H4m12 0h4">
                                </path>
                            </svg>
                            <span>Users</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/permissions"
                            active-class="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-l-4 border-blue-600"
                            class="flex items-center px-4 py-2.5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                                </path>
                            </svg>
                            <span>Permissions</span>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- Settings Section -->
            <div class="mb-6">
                <h3 class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Settings
                </h3>
                <ul class="space-y-1">
                    <li>
                        <router-link to="/settings"
                            active-class="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-l-4 border-blue-600"
                            class="flex items-center px-4 py-2.5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                                </path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>Settings</span>
                        </router-link>
                    </li>
                    <li>
                        <a href="#"
                            class="flex items-center px-4 py-2.5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                                </path>
                            </svg>
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </aside>
</template>

<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        default: true,
    },
})
</script>

<style scoped></style>
