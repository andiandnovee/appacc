<!-- resources/js/spa/Components/Base/InfoRow.vue -->
<script setup>
const props = defineProps({
    label: String,
    value: [String, Number],
});
</script>

<template>
    <div class="grid grid-cols-3 gap-2 py-1">
        <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ label }}
        </div>

        <div
            class="col-span-2 text-sm font-semibold text-gray-900 dark:text-gray-100"
        >
            <slot>{{ value ?? "-" }}</slot>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 1024px) {
    .grid {
        max-width: 550px;
    }
}
</style>
