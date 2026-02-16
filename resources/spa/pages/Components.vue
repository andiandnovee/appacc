<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Flowbite Components</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Custom Vue 3 components styled with Flowbite & Tailwind CSS</p>
    </div>

    <!-- Buttons Example -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Buttons</h2>
      <div class="flex flex-wrap gap-4">
        <button class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Primary Button
        </button>
        <button class="px-5 py-2.5 border border-gray-300 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          Secondary Button
        </button>
        <button class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Success Button
        </button>
        <button class="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Danger Button
        </button>
      </div>
    </div>

    <!-- Alerts Example -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Alerts</h2>
      <div class="space-y-4">
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900 dark:border-blue-700">
          <p class="text-blue-800 dark:text-blue-300"><span class="font-bold">Info:</span> This is an informational alert</p>
        </div>
        <div class="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900 dark:border-green-700">
          <p class="text-green-800 dark:text-green-300"><span class="font-bold">Success:</span> Your action was successful</p>
        </div>
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900 dark:border-yellow-700">
          <p class="text-yellow-800 dark:text-yellow-300"><span class="font-bold">Warning:</span> Please be careful</p>
        </div>
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900 dark:border-red-700">
          <p class="text-red-800 dark:text-red-300"><span class="font-bold">Error:</span> Something went wrong</p>
        </div>
      </div>
    </div>

    <!-- Badges Example -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Badges & Tags</h2>
      <div class="flex flex-wrap gap-3">
        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold dark:bg-blue-900 dark:text-blue-300">
          Blue
        </span>
        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold dark:bg-green-900 dark:text-green-300">
          Green
        </span>
        <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold dark:bg-purple-900 dark:text-purple-300">
          Purple
        </span>
        <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold dark:bg-red-900 dark:text-red-300">
          Red
        </span>
        <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold dark:bg-orange-900 dark:text-orange-300">
          Orange
        </span>
      </div>
    </div>

    <!-- Custom Component Example -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Custom Dropdown Component</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Click the dropdown below (built with Vue 3 + Flowbite CSS)</p>
      <FwbDropdown />
    </div>

    <!-- Input Fields Example -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Form Inputs</h2>
      <div class="space-y-4 max-w-md">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text Input</label>
          <input type="text" placeholder="Enter text..." class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Input</label>
          <input type="email" placeholder="example@example.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select</label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Code Example -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">How to Use Flowbite Components</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Flowbite components are built using Tailwind CSS utility classes. You can create custom Vue components using these classes:
      </p>
      <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto text-sm"><code>&lt;template&gt;
  &lt;button 
    class="px-5 py-2.5 bg-blue-600 text-white rounded-lg 
           hover:bg-blue-700 transition"
  &gt;
    Click Me
  &lt;/button&gt;
&lt;/template&gt;

&lt;script setup&gt;
// No special component needed - just CSS!
&lt;/script&gt;</code></pre>
    </div>
  </div>
</template>

<script setup>
import FwbDropdown from '@/components/FwbDropdown.vue'
</script>

<style scoped></style>
