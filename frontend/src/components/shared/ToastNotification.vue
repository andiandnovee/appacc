<template>
    <div class="fixed bottom-4 right-4 space-y-2 z-50">
        <transition-group name="toast" tag="div">
            <Alert v-for="toast in toasts" :key="toast.id" :type="toastType(toast.type)" :closable="true"
                @close="removeToast(toast.id)" class="max-w-sm">
                {{ toast.message }}
            </Alert>
        </transition-group>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Alert } from 'flowbite-vue'

const toasts = ref([])
let toastId = 0

const toastType = (type) => {
    switch (type) {
        case 'success':
            return 'success'
        case 'error':
            return 'danger'
        case 'warning':
            return 'warning'
        case 'info':
        default:
            return 'info'
    }
}
toasts.value.push({ id, message, type })

setTimeout(() => {
    removeToast(id)
}, duration)
}

const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
}

// Make available globally in app
if (window) {
    window.showToast = showToast
}

// Export for use in other components
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
