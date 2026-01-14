<template>
    <RouterLink
        :to="route"
        :class="[
            'flex items-center gap-4 w-full px-6 py-4 transition-colors',
            'text-[17px] font-medium',
            active
                ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold border-r-4 border-teal-600'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700',
        ]"
        :aria-current="active ? 'page' : null"
    >
        <!-- Icon -->
        <component
            :is="icon"
            :class="[
                'h-6 w-6 flex-shrink-0',
                active
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-gray-500 dark:text-gray-400',
            ]"
        />

        <!-- Label -->
        <span v-if="!collapsed" class="truncate">
            {{ name }}
        </span>
    </RouterLink>
</template>

<script setup>
defineProps({
    name: String,
    route: [String, Object],
    icon: [Object, Function],
    active: Boolean,
    collapsed: Boolean,
});
</script>

<style scoped>
/* Active state styling for dark/light modes */
[aria-current="page"] {
    color: var(--color-text-light);
}

.dark [aria-current="page"] {
    color: #f8fafc;
}
</style>
