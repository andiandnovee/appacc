<template>
    <fwb-card>
        <div class="flex items-start justify-between">
            <div>
                <p class="text-sm font-medium text-gray-600">{{ title }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ value }}</p>
                <div v-if="change" class="flex items-center gap-1 mt-2"
                    :class="changePositive ? 'text-green-600' : 'text-red-600'">
                    <svg v-if="changePositive" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 8l3.293 3.293a1 1 0 01-1.414 1.414l-4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 12l-3.293-3.293a1 1 0 011.414-1.414l4 4z"
                            clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-medium">{{ change }}%</span>
                </div>
            </div>
            <div class="p-3 rounded-lg" :style="{ backgroundColor: iconBgColor }">
                <svg class="w-6 h-6" :style="{ color: iconColor }" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="icon === 'users'"
                        d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V6.5m-11-2v2m3-2v2m3-2v2M3.5 9.5h13M5 14.5h2M5 16.5h2" />
                </svg>
            </div>
        </div>
    </fwb-card>
</template>

<script setup>
import { computed } from 'vue'
import { TheCard as FwbCard } from 'flowbite-vue'
const props = defineProps({
    title: String,
    value: [String, Number],
    change: [String, Number],
    icon: {
        type: String,
        default: 'users',
    },
    iconColor: {
        type: String,
        default: '#3b82f6',
    },
    iconBgColor: {
        type: String,
        default: '#dbeafe',
    },
})

const changePositive = computed(() => {
    return parseInt(props.change) >= 0
})
</script>

<style scoped></style>
