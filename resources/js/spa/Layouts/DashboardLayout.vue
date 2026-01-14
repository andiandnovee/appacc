<script setup>
import Sidebar from "./Partials/Sidebar.vue";
import Header from "@/Components/Header.vue";
import UserDropdown from "@/Components/UserDropdown.vue";
import Notification from "@/Components/Notification.vue";
import ConfirmBox from "@/Components/ConfirmBox.vue";
import { ref, onMounted, watch, Transition } from "vue";
import {
    MoonIcon,
    SunIcon,
    MenuIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-vue-next";
import TopbarMenu from "@/Components/TopbarMenu.vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();
const isDarkMode = ref(false);

const controlButtonClass =
    "p-2.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors";

const layoutButtonClass =
    "p-2.5 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors hidden md:inline-flex items-center justify-center";

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle("dark", isDarkMode.value);
    localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
};

onMounted(() => {
    const saved = localStorage.getItem("theme");
    isDarkMode.value = saved === "dark";
    document.documentElement.classList.toggle("dark", isDarkMode.value);
});

watch(
    () => ui.mobileSidebarOpen,
    (isOpen) => {
        if (isOpen) {
            ui.sidebarCollapsed = false;
        }
    }
);
</script>

<template>
    <!-- GLOBAL WRAPPER -->
    <div
        class="min-h-screen flex flex-col bg-[var(--color-light-bg)] dark:bg-[var(--color-dark-bg)] text-[var(--color-text-light)] transition-colors duration-300"
    >
        <!-- ====================================== -->
        <!--            MODE TOPBAR                -->
        <!-- ====================================== -->
        <Header v-if="ui.layoutMode === 'topbar'" title="BSKM">
            <!-- Hamburger menu for mobile (show topbar menu) -->
            <button
                @click="ui.mobileTopbarMenuOpen = !ui.mobileTopbarMenuOpen"
                :class="['md:hidden', controlButtonClass]"
                title="Buka menu"
            >
                <MenuIcon class="h-5 w-5" />
            </button>

            <!-- Topbar Menu (hidden on mobile by default) -->
            <TopbarMenu
                v-show="!ui.mobileTopbarMenuOpen"
                class="hidden md:flex"
            />

            <!-- Dark mode toggle -->
            <button
                @click="toggleDarkMode"
                :class="controlButtonClass"
                :title="isDarkMode ? 'Mode terang' : 'Mode gelap'"
            >
                <MoonIcon v-if="!isDarkMode" class="h-5 w-5" />
                <SunIcon v-else class="h-5 w-5" />
            </button>

            <!-- Toggle layout -->
            <button
                @click="ui.toggleLayout()"
                :class="layoutButtonClass"
                title="Tukar mode layout"
            >
                <span class="flex flex-col gap-0.5">
                    <span class="w-4 h-0.5 bg-white rounded-full"></span>
                    <span class="w-4 h-0.5 bg-white/80 rounded-full"></span>
                </span>
            </button>

            <UserDropdown />
        </Header>

        <!-- TOPBAR MENU: Two row layout for mobile -->
        <div
            v-if="ui.layoutMode === 'topbar' && ui.mobileTopbarMenuOpen"
            class="block md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 space-y-2 max-h-48 overflow-y-auto"
        >
            <TopbarMenu />
        </div>

        <!-- ====================================== -->
        <!--            MODE SIDEBAR               -->
        <!-- ====================================== -->

        <div class="flex flex-1 min-h-0 relative overflow-hidden">
            <!-- Desktop Sidebar (visible only on md+) -->
            <aside
                v-if="ui.layoutMode === 'sidebar'"
                :class="[
                    'hidden md:flex flex-col h-full transition-all duration-300 bg-[var(--color-light-bg)] dark:bg-[var(--color-card-light)]',
                    ui.sidebarCollapsed ? 'w-16' : 'w-64',
                ]"
            >
                <Sidebar :collapsed="ui.sidebarCollapsed" />
            </aside>

            <!-- Mobile Sidebar: Hidden Completely, Donut Toggle -->
            <div
                v-if="ui.layoutMode === 'sidebar' && !ui.mobileSidebarOpen"
                class="fixed bottom-5 right-5 z-50 md:hidden"
            >
                <!-- Floating Menu Button -->
                <button
                    @click="ui.mobileSidebarOpen = true"
                    class="w-14 h-14 rounded-full bg-teal-600 shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                    title="Buka menu"
                >
                    <MenuIcon class="w-7 h-7 text-white" />
                </button>
            </div>

            <!-- Mobile Sidebar Overlay - tidak perlu karena fullscreen -->
            <div v-if="false" class="hidden"></div>

            <!-- Mobile Sidebar Slide Panel - FULLSCREEN -->
            <Transition
                enter-active-class="transition-opacity duration-200"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-150"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
            <div
                v-if="ui.mobileSidebarOpen && ui.layoutMode === 'sidebar'"
                class="fixed inset-0 z-50 md:hidden bg-white dark:bg-gray-900 flex flex-col"
            >
                <!-- Header dengan close button -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                            B
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-900 dark:text-white">BSKM</h2>
                            <p class="text-sm text-gray-500">RT 007</p>
                        </div>
                    </div>
                    <button
                        @click="ui.mobileSidebarOpen = false"
                        class="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Tutup menu"
                    >
                        <svg class="w-7 h-7 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Menu items - scrollable -->
                <div class="flex-1 overflow-y-auto py-4">
                    <Sidebar
                        :collapsed="false"
                        mobile
                        @navigate="ui.mobileSidebarOpen = false"
                    />
                </div>
            </div>
            </Transition>

            <!-- CONTENT AREA -->
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                <!-- Internal header (sidebar mode) -->
                <Header
                    v-if="ui.layoutMode === 'sidebar'"
                    title="BSKM"
                    :flush-with-sidebar="true"
                    :mobile="true"
                >
                    <!-- Collapse toggle (desktop only) -->
                    <button
                        @click="ui.sidebarCollapsed = !ui.sidebarCollapsed"
                        :class="['hidden md:block', controlButtonClass]"
                        title="Toggle sidebar"
                    >
                        <ChevronLeftIcon
                            v-if="!ui.sidebarCollapsed"
                            class="w-5 h-5"
                        />
                        <ChevronRightIcon v-else class="w-5 h-5" />
                    </button>

                    <!-- Dark mode -->
                    <button
                        @click="toggleDarkMode"
                        :class="controlButtonClass"
                        :title="isDarkMode ? 'Mode terang' : 'Mode gelap'"
                    >
                        <MoonIcon v-if="!isDarkMode" class="h-5 w-5" />
                        <SunIcon v-else class="h-5 w-5" />
                    </button>

                    <!-- Layout switch -->
                    <button
                        @click="ui.toggleLayout()"
                        :class="layoutButtonClass"
                        title="Tukar mode layout"
                    >
                        <span class="flex flex-col gap-0.5">
                            <span
                                class="w-4 h-0.5 bg-white rounded-full"
                            ></span>
                            <span
                                class="w-4 h-0.5 bg-white/80 rounded-full"
                            ></span>
                        </span>
                    </button>

                    <UserDropdown />
                </Header>

                <!-- MAIN CONTENT -->
                <main
                    class="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-6 bg-gray-50 dark:bg-gray-950"
                >
                    <slot />
                </main>
            </div>
        </div>

        <Notification />
        <ConfirmBox />
    </div>
</template>
