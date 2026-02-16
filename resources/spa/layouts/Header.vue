<template>
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <nav class="px-4 py-3 lg:px-6">
            <div class="flex flex-wrap justify-between items-center">
                <!-- Logo and Menu Toggle -->
                <div class="flex items-center justify-start">
                    <button type="button"
                        class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        @click="emit('toggle-sidebar')">
                        <span class="sr-only">Open sidebar</span>
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" fill-rule="evenodd"
                                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                            </path>
                        </svg>
                    </button>

                    <a href="#" class="flex ml-2 md:mr-24">
                        <svg class="h-8 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 2L1 21h22L12 2zm0 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z">
                            </path>
                        </svg>
                        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                            MyApp
                        </span>
                    </a>
                </div>

                <!-- Header Right Items -->
                <div class="flex items-center lg:order-2">
                    <!-- Search -->
                    <div class="hidden md:inline relative mr-4">
                        <input type="text" placeholder="Search..."
                            class="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>

                    <!-- Notifications -->
                    <button type="button"
                        class="p-2.5 text-gray-500 rounded-full hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                            </path>
                        </svg>
                        <span
                            class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                            3
                        </span>
                    </button>

                    <!-- Theme Toggle -->
                    <button type="button"
                        class="p-2.5 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 ml-2"
                        @click="toggleDarkMode">
                        <svg v-if="!isDarkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                        </svg>
                        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zm.464 4.536a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zm-2.828-2.828l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414zM13 11a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM9 7a1 1 0 011-1h1a1 1 0 110 2H9a1 1 0 01-1-1zm4 6a1 1 0 1 0 0 2h1a1 1 0 100-2h-1z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>

                    <!-- Profile Dropdown -->
                    <button type="button"
                        class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 ml-2"
                        @click="showProfileMenu = !showProfileMenu">
                        <span class="sr-only">Open user menu</span>
                        <img class="w-8 h-8 rounded-full"
                            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                    </button>

                    <!-- Profile Menu -->
                    <div v-if="showProfileMenu"
                        class="absolute right-4 mt-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600 z-50">
                        <div class="px-4 py-3">
                            <span class="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                            <span class="block text-sm text-gray-500 truncate dark:text-gray-400">
                                bonnie@flowbite.com
                            </span>
                        </div>
                        <ul class="py-2">
                            <li>
                                <router-link to="/profile"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                    Profile
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/settings"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                    Settings
                                </router-link>
                            </li>
                            <li>
                                <a href="#"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                    Earnings
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    @click="logout">
                                    Sign out
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['toggle-sidebar'])
const showProfileMenu = ref(false)
const isDarkMode = ref(false)

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.classList.toggle('dark')
}

const logout = () => {
    console.log('Logging out...')
    showProfileMenu.value = false
}
</script>

<style scoped></style>
