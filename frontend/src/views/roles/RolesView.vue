<template>
    <div class="space-y-6">
        <!-- Header with Add Button -->
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900">Roles</h1>
            <Button v-if="hasPermission('create roles')" @click="showCreateModal = true" color="blue">
                + Add Role
            </Button>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow">
            <div class="overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Permissions</TableHeadCell>
                        <TableHeadCell>Users</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableHead>
                    <TableBody>
                        <TableBodyRow v-for="role in roles" :key="role.id">
                            <TableBodyCell>
                                <span class="text-sm font-medium text-gray-900">{{ role.name }}</span>
                            </TableBodyCell>
                            <TableBodyCell>
                                <div class="flex flex-wrap gap-1">
                                    <Badge v-for="permission in role.permissions.slice(0, 3)" :key="permission"
                                        type="info">
                                        {{ permission }}
                                    </Badge>
                                    <Badge v-if="role.permissions.length > 3" type="light">
                                        +{{ role.permissions.length - 3 }}
                                    </Badge>
                                </div>
                            </TableBodyCell>
                            <TableBodyCell>
                                <span class="text-sm text-gray-600">{{ role.users_count }}</span>
                            </TableBodyCell>
                            <TableBodyCell>
                                <div class="flex items-center gap-2">
                                    <Button v-if="hasPermission('edit roles') && role.name !== 'super-admin'"
                                        @click="editRole(role)" color="info" size="sm">
                                        Edit
                                    </Button>
                                    <Button v-if="hasPermission('delete roles') && role.name !== 'super-admin'"
                                        @click="deleteRole(role)" color="failure" size="sm">
                                        Delete
                                    </Button>
                                </div>
                            </TableBodyCell>
                        </TableBodyRow>
                    </TableBody>
                </Table>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Modal :show="showCreateModal || showEditModal" @close="closeModals" size="md">
            <ModalHeader>
                {{ showEditModal ? 'Edit Role' : 'Add New Role' }}
            </ModalHeader>
            <ModalBody>
                <form @submit.prevent="handleSaveRole" class="space-y-4">
                    <div>
                        <Label for="name" value="Role Name" />
                        <TextInput id="name" v-model="formData.name" type="text" required />
                    </div>

                    <div>
                        <Label value="Permissions" />
                        <div class="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                            <div v-for="permission in allPermissions" :key="permission.id" class="flex items-center">
                                <Checkbox :id="`perm-${permission.id}`" :value="permission.name"
                                    v-model="formData.permissions" />
                                <Label :for="`perm-${permission.id}`" value="" class="ml-2 text-sm text-gray-700">
                                    {{ permission.name }}
                                </Label>
                            </div>
                        </div>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button type="submit" @click="handleSaveRole" :disabled="formLoading" color="blue">
                    {{ formLoading ? 'Saving...' : 'Save' }}
                </Button>
                <Button color="light" @click="closeModals">
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>

        <!-- Delete Confirmation Modal -->
        <Modal :show="showDeleteConfirm" @close="showDeleteConfirm = false" size="sm">
            <ModalHeader>Delete Role</ModalHeader>
            <ModalBody>
                Are you sure you want to delete this role? This action cannot be undone.
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
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Button, Label, TextInput, Checkbox, Badge,
    Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell
} from 'flowbite-vue'
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
