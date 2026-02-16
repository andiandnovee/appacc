<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your profile information</p>
        </div>

        <!-- Profile Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex flex-col md:flex-row gap-6 items-start">
                <!-- Profile Picture -->
                <div class="flex flex-col items-center">
                    <img src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Profile"
                        class="w-32 h-32 rounded-lg object-cover" />
                    <button
                        class="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                        Change Photo
                    </button>
                </div>

                <!-- Profile Form -->
                <div class="flex-1 space-y-4 w-full">
                    <!-- Name -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First
                                Name</label>
                            <input type="text" value="Bonnie"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last
                                Name</label>
                            <input type="text" value="Green"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email
                            Address</label>
                        <input type="email" value="bonnie@flowbite.com"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <!-- Phone -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone
                            Number</label>
                        <input type="tel" value="+1 (555) 000-0000"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <!-- Location -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                            <input type="text" value="New York"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                            <input type="text" value="United States"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                    </div>

                    <!-- Bio -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                        <textarea rows="3"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">Software developer passionate about building great web applications.</textarea>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
            <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Save Profile
            </button>
            <button
                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Cancel
            </button>
        </div>

        <!-- Account Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h2>
            <div class="space-y-4">
                <div
                    class="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                        <p class="font-medium text-gray-900 dark:text-white">Change Password</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Last changed 3 months ago</p>
                    </div>
                    <button
                        class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                        Update
                    </button>
                </div>

                <div
                    class="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                        <p class="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Disabled</p>
                    </div>
                    <button
                        class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                        Enable
                    </button>
                </div>

                <div
                    class="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                        <p class="font-medium text-gray-900 dark:text-white">Delete Account</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Permanently delete your account and all data
                        </p>
                    </div>
                    <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped></style>
