<script setup>
const props = defineProps({
    title: String,
    amount: [Number, String],
    periode: { type: String, default: "sekali" },
    dateStart: String,
    dateEnd: String,
    description: String,
});

function colorClass(periode) {
    switch (periode) {
        case "bulanan":
            return "border-blue-400 dark:border-blue-500";
        case "tahunan":
            return "border-green-400 dark:border-green-500";
        default:
            return "border-orange-400 dark:border-orange-500";
    }
}
</script>

<template>
    <div
        :class="[
            'rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between border-l-4',
            colorClass(periode),
            'bg-white dark:bg-[#1e1f22]',
            'text-[var(--color-text-light)] dark:text-gray-200',
        ]"
    >
        <div>
            <div class="flex justify-between items-start">
                <h2
                    class="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                    {{ title }}
                </h2>

                <span
                    class="text-xs px-2 py-1 rounded-full border bg-[var(--color-menu-active-light)] dark:bg-[#2a2d33] text-gray-800 dark:text-gray-300 border-[var(--color-border-light)] dark:border-[#3d3f43]"
                >
                    {{ periode }}
                </span>
            </div>

            <p class="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                Rp {{ Number(amount).toLocaleString("id-ID") }}
            </p>

            <p
                v-if="dateStart || dateEnd"
                class="text-sm text-[var(--color-text-light)] dark:text-gray-400 mt-1"
            >
                {{ dateStart || "-" }} - {{ dateEnd || "-" }}
            </p>

            <p
                v-if="description"
                class="text-sm text-[var(--color-text-light)] dark:text-gray-400 mt-2 leading-tight"
            >
                {{ description }}
            </p>
        </div>

        <slot name="actions"></slot>
    </div>
</template>
