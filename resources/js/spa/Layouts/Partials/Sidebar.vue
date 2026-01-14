<script setup>
import { computed } from "vue";
import MenuAdmin from "@/Components/MenuAdmin.vue";
import { useUiStore } from "@/stores/ui";
import { Lock, Unlock } from "lucide-vue-next";

const props = defineProps({
    collapsed: Boolean,
    mobile: { type: Boolean, default: false },
});

const emit = defineEmits(["navigate"]);

const ui = useUiStore();

const handleHover = (expand) => {
    if (props.mobile || ui.sidebarLocked) return;
    ui.sidebarCollapsed = !expand;
};

const handleNavigate = () => {
    emit("navigate");
};

const containerClass = computed(() => {
    if (props.mobile) {
        // Mobile: simple, clean
        return "flex flex-col w-full bg-white dark:bg-gray-900";
    }
    
    // Desktop
    const base = "flex flex-col transition-all duration-300 ease-in-out select-none";
    const desktop = "h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800";
    const widthClass = ui.sidebarCollapsed ? "w-16" : "w-64";

    return [base, desktop, widthClass].join(" ");
});

const basePadding = computed(() => (props.mobile ? "px-4 py-3" : "px-3 py-4"));

const contentClass = computed(() =>
    ui.sidebarCollapsed
        ? "overflow-hidden px-2 py-2"
        : `overflow-y-auto ${basePadding.value}`
);
</script>

<template>
    <aside
        @mouseenter="handleHover(true)"
        @mouseleave="handleHover(false)"
        :class="containerClass"
    >
        <!-- Mobile Header with close button (emitted from parent) -->
        <!-- Hidden karena header sudah di parent DashboardLayout -->

        <!-- Desktop Lock/Unlock button -->
        <div v-if="!mobile" class="px-4 py-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                B
            </div>
            <span v-if="!ui.sidebarCollapsed" class="text-lg font-semibold text-gray-900 dark:text-white">BSKM</span>
        </div>

        <!-- Menu content -->
        <div
            :class="[
                'flex-1 transition-all duration-300 scroll-thin',
                contentClass,
            ]"
            :style="{
                maxHeight: mobile
                    ? 'calc(100vh - 60px)'
                    : 'calc(100vh - 140px)',
            }"
            @click="handleNavigate"
        >
            <MenuAdmin :collapsed="ui.sidebarCollapsed" :mobile="mobile" />
        </div>
    </aside>
</template>

<style scoped>
/* Smooth scrollbar styling */
.scroll-thin::-webkit-scrollbar {
    width: 6px;
}

.scroll-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scroll-thin::-webkit-scrollbar-thumb {
    background-color: rgba(200, 200, 200, 0.4);
    border-radius: 9999px;
    transition: background-color 0.2s ease;
}

.scroll-thin:hover::-webkit-scrollbar-thumb {
    background-color: rgba(150, 150, 150, 0.7);
}

.dark .scroll-thin::-webkit-scrollbar-thumb {
    background-color: rgba(100, 100, 100, 0.4);
}

.dark .scroll-thin:hover::-webkit-scrollbar-thumb {
    background-color: rgba(100, 100, 100, 0.7);
}
</style>
