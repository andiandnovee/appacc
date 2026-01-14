<template>
    <div class="select-none">
        <!-- Account Item -->
        <div
            :style="{ paddingLeft: `${parseInt(level) * 1.5}rem` }"
            class="px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
            <!-- Header Row: Collapse button + Account Info -->
            <div class="flex items-center gap-2">
                <!-- Collapse/Expand Button -->
                <button
                    v-if="account.children && account.children.length > 0"
                    @click="expanded = !expanded"
                    class="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                >
                    <svg
                        :class="expanded ? 'rotate-90' : ''"
                        class="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <div v-else class="w-6 flex-shrink-0"></div>

                <!-- Account Info -->
                <div class="flex-1 min-w-0">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                        <span class="font-mono font-semibold text-gray-900 dark:text-white text-sm">
                            {{ account.kode }}
                        </span>
                        <span class="text-gray-700 dark:text-gray-300 text-sm">
                            {{ account.nama }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons Row (Mobile: Full width, Desktop: Inline) -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 mt-2 sm:mt-0 sm:ml-8">
                <button
                    @click.stop="$emit('navigate', `/accounting/accounts/${account.id}`)"
                    class="w-full sm:w-auto px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors whitespace-nowrap text-center"
                >
                    Lihat
                </button>
                <button
                    v-if="canManage"
                    @click.stop="$emit('navigate', `/accounting/accounts/${account.id}/edit`)"
                    class="w-full sm:w-auto px-2 py-1 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 rounded hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors whitespace-nowrap text-center"
                >
                    Edit
                </button>
                <button
                    v-if="canDelete"
                    @click.stop="$emit('delete', account.id)"
                    class="w-full sm:w-auto px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors whitespace-nowrap text-center"
                >
                    Hapus
                </button>
            </div>
        </div>

        <!-- Children (collapsed/expanded) -->
        <template v-if="expanded && account.children && account.children.length > 0">
            <AccountTreeNode
                v-for="child in account.children"
                :key="child.id"
                :account="child"
                :can-manage="canManage"
                :can-delete="canDelete"
                :level="parseInt(level) + 1"
                @navigate="$emit('navigate', $event)"
                @delete="$emit('delete', $event)"
            />
        </template>
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    account: {
        type: Object,
        required: true,
    },
    canManage: {
        type: Boolean,
        default: false,
    },
    canDelete: {
        type: Boolean,
        default: false,
    },
    level: {
        type: [String, Number],
        default: '0',
    },
})

defineEmits(['navigate', 'delete'])

const expanded = ref(true)
</script>
