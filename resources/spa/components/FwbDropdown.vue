<template>
  <div class="relative inline-block text-left">
    <button
      type="button"
      @click="toggleDropdown"
      class="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white dark:bg-gray-800 dark:border-gray-700"
    >
      <slot name="button">
        <span>Dropdown</span>
        <svg
          class="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </slot>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600"
    >
      <div class="px-4 py-3">
        <p class="text-sm text-gray-900 dark:text-white">
          <span class="font-medium">Bonnie Green</span>
        </p>
        <p class="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
          name@flowbite.com
        </p>
      </div>
      <ul class="py-2">
        <li>
          <a
            href="#"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            Settings
          </a>
        </li>
      </ul>
      <div class="py-2">
        <a
          href="#"
          @click="isOpen = false"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        >
          Sign out
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped></style>
