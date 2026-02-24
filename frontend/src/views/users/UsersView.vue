<template>
    <div class="space-y-6">
        <!-- Header with Add Button -->
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900">Users</h1>
            <Button v-if="hasPermission('create users')" @click="showCreateModal = true" color="blue">
                + Add User
            </Button>
        </div>

        <!-- Table -->
        <DataTable :columns="columns" :data="users" :meta="meta" @search="handleSearch" @page-change="handlePageChange">
            <template #filters>
                <Select v-model="filters.role" @change="handleRoleFilter">
                    <option value="">All Roles</option>
                    <option v-for="role in availableRoles" :key="role" :value="role">
                        {{ role }}
                    </option>
                </Select>
            </template>

            <template #cell-avatar="{ row }">
                <img :src="row.avatar || 'https://ui-avatars.com/api/?name=' + row.name" :alt="row.name"
                    class="w-10 h-10 rounded-full" />
            </template>

            <template #cell-is_active="{ row }">
                <Badge v-if="row.is_active" type="success">Active</Badge>
                <Badge v-else type="danger">Inactive</Badge>
            </template>

            <template #cell-roles="{ row }">
                <Badge v-if="row.roles?.[0]" type="info">{{ row.roles[0] }}</Badge>
            </template>

            <template #actions="{ row }">
                <div class="flex items-center gap-2">
                    <Button v-if="hasPermission('edit users')" @click="editUser(row)" color="info" size="sm">
                        Edit
                    </Button>
                    <Button v-if="hasPermission('delete users')" @click="deleteUser(row)" color="failure" size="sm">
                        Delete
                    </Button>
                </div>
            </template>
        </DataTable>

        <!-- Create/Edit Modal -->
        <Modal :show="showCreateModal || showEditModal" @close="closeModals">
            <ModalHeader>
                {{ showEditModal ? 'Edit User' : 'Add New User' }}
            </ModalHeader>
            <ModalBody>
                <form @submit.prevent="handleSaveUser" class="space-y-4">
                    <div>
                        <Label for="name" value="Name" />
                        <TextInput id="name" v-model="formData.name" type="text" required />
                    </div>

                    <div>
                        <Label for="email" value="Email" />
                        <TextInput id="email" v-model="formData.email" type="email" required />
                    </div>

                    <div>
                        <Label for="password"
                            :value="`Password ${showEditModal ? '(Leave blank to keep current)' : ''}`" />
                        <TextInput id="password" v-model="formData.password" type="password"
                            :required="!showEditModal" />
                    </div>

                    <div>
                        <Label for="role" value="Role" />
                        <Select id="role" v-model="formData.role">
                            <option value="">Select a role</option>
                            <option v-for="role in availableRoles" :key="role" :value="role">
                                {{ role }}
                            </option>
                        </Select>
                    </div>

                    <div v-if="showEditModal" class="flex items-center gap-2">
                        <Checkbox id="is_active" v-model="formData.is_active" />
                        <Label for="is_active" value="Active" />
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button type="submit" @click="handleSaveUser" :disabled="formLoading" color="blue">
                    {{ formLoading ? 'Saving...' : 'Save' }}
                </Button>
                <Button color="light" @click="closeModals">
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>

        <!-- Delete Confirmation Modal -->
        <Modal :show="showDeleteConfirm" @close="showDeleteConfirm = false" size="sm">
            <ModalHeader>Delete User</ModalHeader>
            <ModalBody>
                Are you sure you want to delete this user? This action cannot be undone.
            </ModalBody>
            <ModalFooter>
                <Button @click="confirmDelete" color="failure">Delete</Button>
                <Button color="light" @click="showDeleteConfirm = false">Cancel</Button>
            </ModalFooter>
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import DataTable from '@/components/shared/DataTable.vue'
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Button, Label, TextInput, Select, Badge, Checkbox
} from 'flowbite-vue'
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
