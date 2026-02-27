<template>
    <div class="fixed bottom-4 right-4 space-y-2 z-50">
        <transition-group name="toast" tag="div">
            <fwb-alert v-for="toast in toasts" :key="toast.id" :type="toast.type" :closable="true" @close="removeToast(toast.id)" class="max-w-sm">
                {{ toast.message }}
            </fwb-alert>
        </transition-group>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Alert as FwbAlert } from 'flowbite-vue'

const toasts = ref([])
let idCounter = 1

function showToast(message, type = 'info', duration = 3000) {
    const id = idCounter++
    toasts.value.push({ id, message, type })
    if (duration > 0) {
        setTimeout(() => removeToast(id), duration)
    }
}

function removeToast(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
}

// expose globally for ease of use across the app
globalThis.showToast = showToast
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
