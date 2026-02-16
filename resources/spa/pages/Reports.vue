<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">Generate and manage your reports</p>
            </div>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                + New Report
            </button>
        </div>

        <!-- Reports List -->
        <div class="space-y-4">
            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 md:items-center gap-4">
                <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Sales Report 2026</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Generated on Feb 16, 2026</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-green-600">$125K</p>
                    <p class="text-xs text-gray-500">Total Revenue</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-blue-600">1.2K</p>
                    <p class="text-xs text-gray-500">Orders</p>
                </div>
                <div class="flex gap-2">
                    <button
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">View</button>
                    <button
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Download</button>
                </div>
            </div>

            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 md:items-center gap-4">
                <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">User Activity Report</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Generated on Feb 15, 2026</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-purple-600">573</p>
                    <p class="text-xs text-gray-500">Active Users</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-orange-600">92%</p>
                    <p class="text-xs text-gray-500">Engagement</p>
                </div>
                <div class="flex gap-2">
                    <button
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">View</button>
                    <button
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Download</button>
                </div>
            </div>

            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 md:items-center gap-4">
                <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Performance Report</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Generated on Feb 14, 2026</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-green-600">98%</p>
                    <p class="text-xs text-gray-500">Uptime</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-blue-600">245ms</p>
                    <p class="text-xs text-gray-500">Avg Response</p>
                </div>
                <div class="flex gap-2">
                    <button
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">View</button>
                    <button
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Download</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped></style>
