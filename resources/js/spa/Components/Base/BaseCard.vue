<!-- resources/js/spa/Components/Base/BaseCard.vue -->
<template>
    <div :class="fullClass" v-bind="attrs">
        <slot />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useAttrs } from "vue";

const props = defineProps({
    hover: { type: Boolean, default: false },
    padding: { type: String, default: "p-5" },
    borderClass: { type: String, default: null },
    extraClass: { type: String, default: "" },
});

const attrs = useAttrs();

const fullClass = computed(() => {
    return [
        // padding
        props.padding,

        // radius
        "rounded-[var(--radius-lg)]",

        // background clean
        "bg-[var(--color-card-light)] dark:bg-[var(--color-card-light)]",

        // smooth border
        props.borderClass ??
            "border border-[var(--color-border-light)]/70 dark:border-[var(--color-border-light)]/50",

        // shadow subtle
        "shadow-[var(--shadow-soft)] dark:shadow-none",

        // hover effect optional
        props.hover
            ? "transition-all duration-200 hover:shadow-md hover:-translate-y-[2px]"
            : "transition-shadow duration-200",

        // props.extraClass
        props.extraClass,
    ].join(" ");
});
</script>

<style>
:root {
    --color-card-dark: #1f2937;
}
</style>
