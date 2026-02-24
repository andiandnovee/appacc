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
        <Card>
            <template #header>
                <h3 class="text-lg font-bold text-gray-900">Recent Registrations</h3>
            </template>
            <div class="overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Email</TableHeadCell>
                        <TableHeadCell>Role</TableHeadCell>
                        <TableHeadCell>Date</TableHeadCell>
                    </TableHead>
                    <TableBody>
                        <TableBodyRow v-for="user in recentUsers" :key="user.id">
                            <TableBodyCell>
                                <div class="flex items-center gap-3">
                                    <img :src="user.avatar || 'https://ui-avatars.com/api/?name=' + user.name"
                                        :alt="user.name" class="w-8 h-8 rounded-full" />
                                    <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
                                </div>
                            </TableBodyCell>
                            <TableBodyCell>{{ user.email }}</TableBodyCell>
                            <TableBodyCell>
                                <Badge type="info">{{ user.roles?.[0] || 'N/A' }}</Badge>
                            </TableBodyCell>
                            <TableBodyCell>{{ formatDate(user.created_at) }}</TableBodyCell>
                        </TableBodyRow>
                    </TableBody>
                </Table>
            </div>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import StatsCard from '@/components/shared/StatsCard.vue'
import { Card, Badge, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from 'flowbite-vue'
        }

const activityResponse = await api.get('/dashboard/activity')
if (activityResponse.data.success) {
    recentUsers.value = activityResponse.data.data
}
    } catch (error) {
    console.error('Failed to load dashboard data:', error)
}
})

const formatDate = (dateString) => {
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
