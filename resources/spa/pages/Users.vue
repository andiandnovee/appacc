<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">Manage user accounts and access</p>
            </div>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                + Add User
            </button>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Search users..."
                    class="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <select
                    class="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>User</option>
                    <option>Moderator</option>
                </select>
                <select
                    class="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Suspended</option>
                </select>
            </div>
        </div>

        <!-- Users Table -->
        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" class="px-6 py-3">User</th>
                            <th scope="col" class="px-6 py-3">Email</th>
                            <th scope="col" class="px-6 py-3">Role</th>
                            <th scope="col" class="px-6 py-3">Status</th>
                            <th scope="col" class="px-6 py-3">Joined</th>
                            <th scope="col" class="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">John Doe</td>
                            <td class="px-6 py-4">john@example.com</td>
                            <td class="px-6 py-4"><span
                                    class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs dark:bg-blue-900 dark:text-blue-300">Admin</span>
                            </td>
                            <td class="px-6 py-4"><span
                                    class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs dark:bg-green-900 dark:text-green-300">Active</span>
                            </td>
                            <td class="px-6 py-4">Jan 15, 2026</td>
                            <td class="px-6 py-4"><button class="text-blue-600 hover:underline">Edit</button></td>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">Jane Smith</td>
                            <td class="px-6 py-4">jane@example.com</td>
                            <td class="px-6 py-4"><span
                                    class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs dark:bg-gray-600 dark:text-gray-300">User</span>
                            </td>
                            <td class="px-6 py-4"><span
                                    class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs dark:bg-green-900 dark:text-green-300">Active</span>
                            </td>
                            <td class="px-6 py-4">Feb 01, 2026</td>
                            <td class="px-6 py-4"><button class="text-blue-600 hover:underline">Edit</button></td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">Bob Johnson</td>
                            <td class="px-6 py-4">bob@example.com</td>
                            <td class="px-6 py-4"><span
                                    class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs dark:bg-purple-900 dark:text-purple-300">Moderator</span>
                            </td>
                            <td class="px-6 py-4"><span
                                    class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs dark:bg-yellow-900 dark:text-yellow-300">Inactive</span>
                            </td>
                            <td class="px-6 py-4">Feb 10, 2026</td>
                            <td class="px-6 py-4"><button class="text-blue-600 hover:underline">Edit</button></td>
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
