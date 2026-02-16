<template>
    <div class="max-w-4xl mx-auto text-center">
        <div class="bg-white rounded-lg shadow-md dark:bg-gray-800 p-8">
            <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                404
            </h1>
            <h2 class="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Page Not Found
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-lg mb-8">
                The page you are looking for doesn't exist.
            </p>
            <router-link to="/"
                class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
                Back to Home
            </router-link>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped></style>
