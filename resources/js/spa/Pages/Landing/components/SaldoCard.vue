<template>
    <div
        class="rounded-lg sm:rounded-2xl p-3 sm:p-6 shadow-lg sm:shadow-xl border border-cyan-200 dark:border-cyan-700 bg-gradient-to-br from-cyan-50 via-emerald-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-200 hover:scale-[1.03] hover:shadow-emerald-200/30 flex flex-col gap-2"
    >
        <div class="flex items-start sm:items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div class="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow flex-shrink-0">
                <svg class="w-4 sm:w-6 h-4 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-cyan-700 dark:text-cyan-300 break-words">{{ title }}</h3>
        </div>
        <p class="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-2 break-words">
            Rp {{ formatRupiah(amount) }}
        </p>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    amount: Number,
});

function formatRupiah(value) {
    return value.toLocaleString("id-ID");
}
</script>
