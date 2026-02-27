<template>
    <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Users" :value="stats.total_users" icon="users" :change="0" icon-color="#3b82f6"
                icon-bg-color="#dbeafe" />
            <StatsCard title="Active Users" :value="stats.active_users" icon="users" icon-color="#10b981"
                icon-bg-color="#d1fae5" />
            <StatsCard title="Total Roles" :value="stats.total_roles" icon="roles" icon-color="#f59e0b"
                icon-bg-color="#fef3c7" />
            <StatsCard title="New Today" :value="stats.new_users_today" icon="users" icon-color="#8b5cf6"
                icon-bg-color="#ede9fe" />
        </div>

        <!-- Recent Users -->
        <fwb-card>
            <template #header>
                <h3 class="text-lg font-bold text-gray-900">Recent Registrations</h3>
            </template>

            <div class="overflow-x-auto">
                <fwb-table>
                    <fwb-table-head>
                        <fwb-table-head-cell>Name</fwb-table-head-cell>
                        <fwb-table-head-cell>Email</fwb-table-head-cell>
                        <fwb-table-head-cell>Role</fwb-table-head-cell>
                        <fwb-table-head-cell>Date</fwb-table-head-cell>
                    </fwb-table-head>

                    <fwb-table-body>
                        <fwb-table-body-row v-for="user in recentUsers" :key="user.id">
                            <fwb-table-body-cell>
                                <div class="flex items-center gap-3">
                                    <img :src="user.avatar || 'https://ui-avatars.com/api/?name=' + user.name"
                                        :alt="user.name" class="w-8 h-8 rounded-full" />
                                    <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
                                </div>
                            </fwb-table-body-cell>

                            <fwb-table-body-cell>{{ user.email }}</fwb-table-body-cell>

                            <fwb-table-body-cell>
                                <fwb-badge type="info">{{ user.roles?.[0] || 'N/A' }}</fwb-badge>
                            </fwb-table-body-cell>

                            <fwb-table-body-cell>{{ formatDate(user.created_at) }}</fwb-table-body-cell>
                        </fwb-table-body-row>
                    </fwb-table-body>
                </fwb-table>
            </div>
        </fwb-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import StatsCard from '@/components/shared/StatsCard.vue'
import { TheCard as FwbCard, Badge as FwbBadge, Table as FwbTable, TableHead as FwbTableHead, TableHeadCell as FwbTableHeadCell, TableBody as FwbTableBody, TableRow as FwbTableBodyRow, TableCell as FwbTableBodyCell } from 'flowbite-vue'

const stats = ref({ total_users: 0, active_users: 0, total_roles: 0, new_users_today: 0 })
const recentUsers = ref([])

onMounted(async () => {
    try {
        const statsResp = await api.get('/dashboard/stats')
        if (statsResp.data?.success) stats.value = statsResp.data.data

        const activityResp = await api.get('/dashboard/activity')
        if (activityResp.data?.success) recentUsers.value = activityResp.data.data
    } catch (err) {
        console.error('Failed to load dashboard data:', err)
    }
})

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}
</script>

<style scoped></style>
