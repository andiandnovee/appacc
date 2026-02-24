import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
    const isOpen = ref(true)

    function toggleSidebar() {
        isOpen.value = !isOpen.value
    }

    return {
        isOpen,
        toggleSidebar,
    }
})
