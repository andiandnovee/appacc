<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your dashboard overview.</p>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Stat Card 1 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Total Users</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">2.4K</p>
                        <p class="text-green-500 text-sm mt-2">↑ 12% from last month</p>
                    </div>
                    <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                        <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4.354a4 4 0 110 8.048M12 4.354A4 4 0 018.646 8.646"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Stat Card 2 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">$12.5K</p>
                        <p class="text-red-500 text-sm mt-2">↓ 2% from last month</p>
                    </div>
                    <div class="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                        <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Stat Card 3 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Active Sessions</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">573</p>
                        <p class="text-green-500 text-sm mt-2">↑ 8% from last month</p>
                    </div>
                    <div class="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                        <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Stat Card 4 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Conversion Rate</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">3.24%</p>
                        <p class="text-green-500 text-sm mt-2">↑ 0.5% from last month</p>
                    </div>
                    <div class="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                        <svg class="w-6 h-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Revenue Chart -->
            <div
                class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h2>
                <div
                    class="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded flex items-center justify-center">
                    <p class="text-gray-500 dark:text-gray-400">Chart placeholder - Connect to backend API</p>
                </div>
            </div>

            <!-- Top Products -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h2>
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-700 dark:text-gray-300">Product A</p>
                        <span
                            class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-300">245
                            sales</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-700 dark:text-gray-300">Product B</p>
                        <span
                            class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-900 dark:text-green-300">189
                            sales</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-700 dark:text-gray-300">Product C</p>
                        <span
                            class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded dark:bg-purple-900 dark:text-purple-300">156
                            sales</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-700 dark:text-gray-300">Product D</p>
                        <span
                            class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded dark:bg-orange-900 dark:text-orange-300">142
                            sales</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Activity Table -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" class="px-6 py-3">User</th>
                            <th scope="col" class="px-6 py-3">Action</th>
                            <th scope="col" class="px-6 py-3">Date</th>
                            <th scope="col" class="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">John Doe</td>
                            <td class="px-6 py-4">Login</td>
                            <td class="px-6 py-4">2026-02-16 10:30</td>
                            <td class="px-6 py-4"><span
                                    class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs dark:bg-green-900 dark:text-green-300">Success</span>
                            </td>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">Jane Smith</td>
                            <td class="px-6 py-4">Purchase</td>
                            <td class="px-6 py-4">2026-02-16 09:15</td>
                            <td class="px-6 py-4"><span
                                    class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs dark:bg-green-900 dark:text-green-300">Success</span>
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">Bob Johnson</td>
                            <td class="px-6 py-4">Export</td>
                            <td class="px-6 py-4">2026-02-16 08:45</td>
                            <td class="px-6 py-4"><span
                                    class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs dark:bg-yellow-900 dark:text-yellow-300">Pending</span>
                            </td>
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
