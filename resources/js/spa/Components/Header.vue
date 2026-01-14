<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { theme } from "@/config/theme";

defineProps({
    title: { type: String, default: "BSKM" },
    logo: String,
});

const isDark = ref(false);
const detectDark = () =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

let observer = null;

onMounted(() => {
    isDark.value = detectDark();
    observer = new MutationObserver(() => {
        isDark.value = detectDark();
    });
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });
});

onBeforeUnmount(() => {
    observer?.disconnect();
});

const headerStyle = computed(() => {
    const isDarkMode = isDark.value;

    return {
        background: isDarkMode
            ? `linear-gradient(
                  135deg,
                  rgba(6, 8, 17, 0.96),
                  rgba(15, 118, 110, 0.28)
              )`
            : `linear-gradient(
                  135deg,
                  rgba(238, 228, 216, 0.96),
                  rgba(217, 201, 185, 0.85)
              )`,
        borderColor: isDarkMode
            ? theme.colors.headerBorderDark
            : theme.colors.headerBorderLight,
        color: isDarkMode ? "#f8fafc" : "var(--color-text-light)",
        backdropFilter: "blur(20px)",
        boxShadow: isDarkMode
            ? "0 12px 35px rgba(2,6,23,0.55)"
            : "0 18px 38px rgba(15,23,42,0.18)",
    };
});
</script>

<template>
    <header
        class="glass-panel flex items-center justify-between gap-4 px-5 py-3 sticky top-4 md:top-5 z-40 w-full border shadow-none"
        :style="headerStyle"
    >
        <div class="flex items-center gap-3 select-none flex-shrink-0">
            <div
                class="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-400 flex items-center justify-center shadow-md shadow-cyan-500/30 text-white font-semibold text-sm uppercase tracking-wide"
            >
                <img
                    v-if="logo"
                    :src="logo"
                    alt="Logo"
                    class="w-6 h-6 object-contain"
                />
                <span v-else>B</span>
            </div>

            <div>
                <p
                    class="text-xs uppercase tracking-[0.4em] text-gray-600 dark:text-gray-400 font-semibold"
                >
                    Dashboard
                </p>
                <h1
                    class="text-lg font-semibold text-gray-900 dark:text-gray-50"
                >
                    {{ title }}
                </h1>
            </div>
        </div>

        <div class="flex items-center gap-2 ml-auto">
            <slot />
        </div>
    </header>
</template>
