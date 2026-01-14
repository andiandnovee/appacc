<script setup>
const props = defineProps({
  variant: { type: String, default: "default" },
  size: { type: String, default: "sm" },
})

const classes = {
  default: `border border-gray-400 text-gray-700 dark:text-gray-300 
            dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800`,

  warning: `border border-yellow-500 text-yellow-700 
            dark:text-yellow-300 dark:border-yellow-400
            hover:bg-yellow-50 dark:hover:bg-yellow-500/20`,

  danger: `border border-red-500 text-red-600
           dark:text-red-300 dark:border-red-400
           hover:bg-red-50 dark:hover:bg-red-500/20`,
}

const sizeClasses = {
  xs: "px-2 py-1 text-[0.7rem]",
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-sm",
}
</script>

<template>
  <button
    class="rounded-md transition-colors duration-150"
    :class="[classes[variant], sizeClasses[size] || sizeClasses.sm]"
  >
    <slot />
  </button>
</template>
