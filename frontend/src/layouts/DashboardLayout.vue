<template>
    <div class="flex h-screen bg-gray-100">
        <AppSidebar />
        <div class="flex-1 flex flex-col">
            <AppTopbar />
            <main class="flex-1 overflow-auto p-6">
                <slot />
            </main>
        </div>
        <ToastNotification />
    </div>
</template>

<script setup>
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import AppTopbar from '@/components/topbar/AppTopbar.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'
</script>

<style scoped></style>
