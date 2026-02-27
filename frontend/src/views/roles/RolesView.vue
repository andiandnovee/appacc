<template>
    <div class="space-y-6">
        <!-- Header with Add Button -->
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900">Roles</h1>
            <fwb-button v-if="hasPermission('create roles')" @click="showCreateModal = true" color="blue">
                    + Add Role
                </fwb-button>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow">
            <div class="overflow-x-auto">
                <fwb-table>
                    <fwb-table-head>
                        <fwb-table-head-cell>Name</fwb-table-head-cell>
                        <fwb-table-head-cell>Permissions</fwb-table-head-cell>
                        <fwb-table-head-cell>Users</fwb-table-head-cell>
                        <fwb-table-head-cell>Actions</fwb-table-head-cell>
                    </fwb-table-head>
                    <fwb-table-body>
                        <fwb-table-body-row v-for="role in roles" :key="role.id">
                            <fwb-table-body-cell>
                                <span class="text-sm font-medium text-gray-900">{{ role.name }}</span>
                            </fwb-table-body-cell>
                            <fwb-table-body-cell>
                                <div class="flex flex-wrap gap-1">
                                    <fwb-badge v-for="permission in role.permissions.slice(0, 3)" :key="permission" type="info">
                                        {{ permission }}
                                    </fwb-badge>
                                    <fwb-badge v-if="role.permissions.length > 3" type="light">
                                        +{{ role.permissions.length - 3 }}
                                    </fwb-badge>
                                </div>
                            </fwb-table-body-cell>
                            <fwb-table-body-cell>
                                <span class="text-sm text-gray-600">{{ role.users_count }}</span>
                            </fwb-table-body-cell>
                            <fwb-table-body-cell>
                                <div class="flex items-center gap-2">
                                    <fwb-button v-if="hasPermission('edit roles') && role.name !== 'super-admin'" @click="editRole(role)" color="info" size="sm">
                                        Edit
                                    </fwb-button>
                                    <fwb-button v-if="hasPermission('delete roles') && role.name !== 'super-admin'" @click="deleteRole(role)" color="failure" size="sm">
                                        Delete
                                    </fwb-button>
                                </div>
                            </fwb-table-body-cell>
                        </fwb-table-body-row>
                    </fwb-table-body>
                </fwb-table>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <fwb-modal :show="showCreateModal || showEditModal" @close="closeModals" size="md">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div class="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        {{ showEditModal ? 'Edit Role' : 'Add New Role' }}
                    </h3>
                </div>
                <div class="p-6">
                    <form @submit.prevent="handleSaveRole" class="space-y-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700">Role Name</label>
                            <fwb-input id="name" v-model="formData.name" type="text" required />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Permissions</label>
                            <div class="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                <div v-for="permission in allPermissions" :key="permission.id" class="flex items-center">
                                    <fwb-checkbox :id="`perm-${permission.id}`" :value="permission.name" v-model="formData.permissions" />
                                    <label :for="`perm-${permission.id}`" class="ml-2 text-sm text-gray-700">{{ permission.name }}</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="flex items-center justify-end p-6 space-x-3 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <fwb-button type="submit" @click="handleSaveRole" :disabled="formLoading" color="blue">
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
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Delete Role</h3>
                </div>
                <div class="p-6">
                    <p class="text-gray-600 dark:text-gray-400">Are you sure you want to delete this role? This action cannot be undone.</p>
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
import { Modal as FwbModal, Button as FwbButton, Input as FwbInput, Checkbox as FwbCheckbox, Badge as FwbBadge, Table as FwbTable, TableHead as FwbTableHead, TableHeadCell as FwbTableHeadCell, TableBody as FwbTableBody, TableRow as FwbTableBodyRow, TableCell as FwbTableBodyCell } from 'flowbite-vue'
import { usePermission } from '@/composables/usePermission'
const roles = ref([])
const allPermissions = ref([])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const formLoading = ref(false)
const roleToDelete = ref(null)

const formData = ref({
    name: '',
    permissions: [],
})

const loadRoles = async () => {
    try {
        const response = await api.get('/roles')
        if (response.data.success) {
            roles.value = response.data.data
        }
    } catch (error) {
        console.error('Failed to load roles:', error)
    }
}

const loadPermissions = async () => {
    try {
        const response = await api.get('/permissions')
        if (response.data.success) {
            allPermissions.value = response.data.data
        }
    } catch (error) {
        console.error('Failed to load permissions:', error)
    }
}

const editRole = (role) => {
    formData.value = {
        id: role.id,
        name: role.name,
        permissions: role.permissions,
    }
    showEditModal.value = true
}

const handleSaveRole = async () => {
    formLoading.value = true

    try {
        const data = {
            name: formData.value.name,
            permissions: formData.value.permissions,
        }

        if (showEditModal.value) {
            await api.put(`/roles/${formData.value.id}`, data)
            globalThis.showToast?.('Role updated successfully', 'success')
        } else {
            await api.post('/roles', data)
            globalThis.showToast?.('Role created successfully', 'success')
        }

        closeModals()
        loadRoles()
    } catch (error) {
        globalThis.showToast?.(error.response?.data?.message || 'Error saving role', 'error')
    } finally {
        formLoading.value = false
    }
}

const deleteRole = (role) => {
    roleToDelete.value = role
    showDeleteConfirm.value = true
}

const confirmDelete = async () => {
    try {
        await api.delete(`/roles/${roleToDelete.value.id}`)
        globalThis.showToast?.('Role deleted successfully', 'success')
        showDeleteConfirm.value = false
        loadRoles()
    } catch (error) {
        globalThis.showToast?.(error.response?.data?.message || 'Error deleting role', 'error')
    }
}

const closeModals = () => {
    showCreateModal.value = false
    showEditModal.value = false
    formData.value = { name: '', permissions: [] }
}

onMounted(() => {
    loadRoles()
    loadPermissions()
})
</script>

<style scoped></style>
