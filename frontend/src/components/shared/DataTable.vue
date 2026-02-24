<template>
    <div class="bg-white rounded-lg shadow">
        <!-- Search Bar -->
        <div class="p-4 border-b border-gray-200">
            <div class="flex gap-4 flex-wrap">
                <TextInput v-model="searchQuery" @input="onSearch" type="text" placeholder="Search..."
                    class="flex-1 min-w-64" />
                <slot name="filters" />
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <Table>
                <TableHead>
                    <TableHeadCell v-for="column in columns" :key="column.key">
                        {{ column.label }}
                    </TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                </TableHead>
                <TableBody>
                    <TableBodyRow v-for="row in data" :key="row.id">
                        <TableBodyCell v-for="column in columns" :key="column.key">
                            <slot :name="`cell-${column.key}`" :row="row">
                                {{ getNestedValue(row, column.key) }}
                            </slot>
                        </TableBodyCell>
                        <TableBodyCell>
                            <slot name="actions" :row="row" />
                        </TableBodyCell>
                    </TableBodyRow>
                </TableBody>
            </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 border-t border-gray-200">
            <div class="text-sm text-gray-600">
                Showing {{ (meta.current_page - 1) * meta.per_page + 1 }} to {{ Math.min(meta.current_page *
                    meta.per_page, meta.total) }} of {{ meta.total }}
            </div>
            <div class="flex gap-2">
                <Button size="sm" :disabled="meta.current_page === 1" @click="previousPage" color="light">
                    Previous
                </Button>
                <Button v-for="page in pageNumbers" :key="page" size="sm" @click="goToPage(page)"
                    :color="page === meta.current_page ? 'blue' : 'light'">
                    {{ page }}
                </Button>
                <Button size="sm" :disabled="meta.current_page === meta.last_page" @click="nextPage" color="light">
                    Next
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Button, TextInput } from 'flowbite-vue'
const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    data: {
        type: Array,
        required: true,
    },
    meta: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['search', 'page-change'])

const searchQuery = ref('')
let searchTimeout

const onSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        emit('search', searchQuery.value)
    }, 300)
}

const pageNumbers = computed(() => {
    const pages = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, props.meta.current_page - 2)
    let endPage = Math.min(props.meta.last_page, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    return pages
})

const previousPage = () => {
    if (props.meta.current_page > 1) {
        emit('page-change', props.meta.current_page - 1)
    }
}

const nextPage = () => {
    if (props.meta.current_page < props.meta.last_page) {
        emit('page-change', props.meta.current_page + 1)
    }
}

const goToPage = (page) => {
    emit('page-change', page)
}

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj)
}
</script>

<style scoped></style>
