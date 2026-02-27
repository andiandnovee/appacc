<template>
    <div class="space-y-6">
        <!-- Header with Add Button -->
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900">Users</h1>
            <fwb-button v-if="hasPermission('create users')" @click="showCreateModal = true" color="blue">
                + Add User
            </fwb-button>
        </div>

        <!-- Table -->
        <DataTable :columns="columns" :data="users" :meta="meta" @search="handleSearch" @page-change="handlePageChange">
            <template #filters>
                <fwb-select v-model="filters.role" @change="handleRoleFilter">
                    <option value="">All Roles</option>
                    <option v-for="role in availableRoles" :key="role" :value="role">
                        {{ role }}
                    </option>
                </fwb-select>
            </template>

            <template #cell-avatar="{ row }">
                <img :src="row.avatar || 'https://ui-avatars.com/api/?name=' + row.name" :alt="row.name"
                    class="w-10 h-10 rounded-full" />
            </template>

            <template #cell-is_active="{ row }">
                <fwb-badge v-if="row.is_active" type="success">Active</fwb-badge>
                <fwb-badge v-else type="danger">Inactive</fwb-badge>
            </template>

            <template #cell-roles="{ row }">
                <fwb-badge v-if="row.roles?.[0]" type="info">{{ row.roles[0] }}</fwb-badge>
            </template>

            <template #actions="{ row }">
                <div class="flex items-center gap-2">
                    <fwb-button v-if="hasPermission('edit users')" @click="editUser(row)" color="info" size="sm">
                        Edit
                    </fwb-button>
                    <fwb-button v-if="hasPermission('delete users')" @click="deleteUser(row)" color="failure" size="sm">
                        Delete
                    </fwb-button>
                </div>
            </template>
        </DataTable>

        <!-- Create/Edit Modal -->
        <fwb-modal :show="showCreateModal || showEditModal" @close="closeModals">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div class="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        {{ showEditModal ? 'Edit User' : 'Add New User' }}
                    </h3>
                </div>
                <div class="p-6">
                    <form @submit.prevent="handleSaveUser" class="space-y-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                            <fwb-input id="name" v-model="formData.name" type="text" required />
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                            <fwb-input id="email" v-model="formData.email" type="email" required />
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">{{ `Password ${showEditModal ? "(Leave blank to keep current)" : ""}` }}</label>
                            <fwb-input id="password" v-model="formData.password" type="password" :required="!showEditModal" />
                        </div>

                        <div>
                            <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                            <fwb-select id="role" v-model="formData.role">
                                <option value="">Select a role</option>
                                <option v-for="role in availableRoles" :key="role" :value="role">
                                    {{ role }}
                                </option>
                            </fwb-select>
                        </div>

                        <div v-if="showEditModal" class="flex items-center gap-2">
                            <fwb-checkbox id="is_active" v-model="formData.is_active" />
                            <label for="is_active" class="ml-2 text-sm font-medium text-gray-700">Active</label>
                        </div>
                    </form>
                </div>
                <div class="flex items-center justify-end p-6 space-x-3 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <fwb-button type="submit" @click="handleSaveUser" :disabled="formLoading" color="blue">
                        {{ formLoading ? 'Saving...' : 'Save' }}
                    </fwb-button>
                    <fwb-button color="light" @click="closeModals">
                        Cancel
                    </fwb-button>
                </div>
            </div>
        </fwb-modal>

        <!-- Delete Confirmation Modal -->
        <fwb-modal :show="showDeleteConfirm" @close="showDeleteConfirm = false" size="sm">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div class="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Delete User</h3>
                </div>
                <div class="p-6">
                    <p class="text-gray-600 dark:text-gray-400">Are you sure you want to delete this user? This action cannot be undone.</p>
                </div>
                <div class="flex items-center justify-end p-6 space-x-3 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <fwb-button @click="confirmDelete" color="failure">Delete</fwb-button>
                    <fwb-button color="light" @click="showDeleteConfirm = false">Cancel</fwb-button>
                </div>
            </div>
        </fwb-modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import DataTable from '@/components/shared/DataTable.vue'
import { Modal as FwbModal, Button as FwbButton, Input as FwbInput, Select as FwbSelect, Badge as FwbBadge, Checkbox as FwbCheckbox } from 'flowbite-vue'

const columns = [
    { key: 'avatar', label: 'Avatar' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'roles', label: 'Role' },
    { key: 'is_active', label: 'Status' },
]

const users = ref([])
const meta = ref({ current_page: 1, last_page: 1, total: 0, per_page: 15 })
const filters = ref({ role: '', search: '' })
const availableRoles = ref([])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const formLoading = ref(false)
const userToDelete = ref(null)

const formData = ref({
    name: '',
    email: '',
    password: '',
    role: '',
    is_active: true,
})

const loadUsers = async (page = 1) => {
    try {
        const response = await api.get('/users', {
            params: {
                page,
                search: filters.value.search,
                role: filters.value.role,
            },
        })

        if (response.data.success) {
            users.value = response.data.data
            meta.value = response.data.meta
        }
    } catch (error) {
        console.error('Failed to load users:', error)
    }
}

const loadRoles = async () => {
    try {
        const response = await api.get('/roles')
        if (response.data.success) {
            availableRoles.value = response.data.data.map((r) => r.name)
        }
    } catch (error) {
        console.error('Failed to load roles:', error)
    }
}

const handleSearch = (query) => {
    filters.value.search = query
    loadUsers(1)
}

const handleRoleFilter = () => {
    loadUsers(1)
}

const handlePageChange = (page) => {
    loadUsers(page)
}

const editUser = (user) => {
    formData.value = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: '',
        role: user.roles?.[0] || '',
        is_active: user.is_active,
    }
    showEditModal.value = true
}

const handleSaveUser = async () => {
    formLoading.value = true

    try {
        const data = {
            name: formData.value.name,
            email: formData.value.email,
            is_active: formData.value.is_active,
        }

        if (formData.value.password) {
            data.password = formData.value.password
        }

        if (showEditModal.value) {
            await api.put(`/users/${formData.value.id}`, data)
            if (formData.value.role) {
                await api.post(`/users/${formData.value.id}/assign-role`, { role: formData.value.role })
            }
            globalThis.showToast?.('User updated successfully', 'success')
        } else {
            data.password = formData.value.password
            const response = await api.post('/users', data)
            if (formData.value.role) {
                await api.post(`/users/${response.data.data.id}/assign-role`, { role: formData.value.role })
            }
            globalThis.showToast?.('User created successfully', 'success')
        }

        closeModals()
        loadUsers()
    } catch (error) {
        globalThis.showToast?.(error.response?.data?.message || 'Error saving user', 'error')
    } finally {
        formLoading.value = false
    }
}

const deleteUser = (user) => {
    userToDelete.value = user
    showDeleteConfirm.value = true
}

const confirmDelete = async () => {
    try {
        await api.delete(`/users/${userToDelete.value.id}`)
        globalThis.showToast?.('User deleted successfully', 'success')
        showDeleteConfirm.value = false
        loadUsers()
    } catch (error) {
        globalThis.showToast?.(error.response?.data?.message || 'Error deleting user', 'error')
    }
}

const closeModals = () => {
    showCreateModal.value = false
    showEditModal.value = false
    formData.value = { name: '', email: '', password: '', role: '', is_active: true }
}

onMounted(() => {
    loadUsers()
    loadRoles()
})
</script>

<style scoped></style>
