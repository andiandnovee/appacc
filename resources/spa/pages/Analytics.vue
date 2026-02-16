<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Track your application metrics and performance</p>
        </div>

        <!-- Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
                    <select
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Last 1 year</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Metric</label>
                    <select
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option>Page Views</option>
                        <option>Sessions</option>
                        <option>Users</option>
                        <option>Bounce Rate</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Analytics Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Page Views Chart -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Page Views</h2>
                <div
                    class="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded flex items-center justify-center">
                    <p class="text-gray-500 dark:text-gray-400">Chart - Connect to backend API</p>
                </div>
            </div>

            <!-- User Sessions Chart -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Sessions</h2>
                <div
                    class="w-full h-64 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded flex items-center justify-center">
                    <p class="text-gray-500 dark:text-gray-400">Chart - Connect to backend API</p>
                </div>
            </div>
        </div>

        <!-- Analytics Table -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Pages</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" class="px-6 py-3">Page</th>
                            <th scope="col" class="px-6 py-3">Views</th>
                            <th scope="col" class="px-6 py-3">Unique Users</th>
                            <th scope="col" class="px-6 py-3">Bounce Rate</th>
                            <th scope="col" class="px-6 py-3">Avg. Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4">/dashboard</td>
                            <td class="px-6 py-4">1,234</td>
                            <td class="px-6 py-4">891</td>
                            <td class="px-6 py-4">23%</td>
                            <td class="px-6 py-4">2m 34s</td>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4">/products</td>
                            <td class="px-6 py-4">892</td>
                            <td class="px-6 py-4">654</td>
                            <td class="px-6 py-4">18%</td>
                            <td class="px-6 py-4">3m 12s</td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800">
                            <td class="px-6 py-4">/settings</td>
                            <td class="px-6 py-4">456</td>
                            <td class="px-6 py-4">412</td>
                            <td class="px-6 py-4">12%</td>
                            <td class="px-6 py-4">1m 45s</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped></style>
