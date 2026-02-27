<template>
    <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">Settings</h1>

        <fwb-card class="max-w-2xl">
            <form @submit.prevent="handleSaveSettings" class="space-y-6">
                <div>
                    <label for="app_name" class="block text-sm font-medium text-gray-700">Application Name</label>
                    <fwb-input v-model="formData.app_name" id="app_name" placeholder="My App" class="mt-1" />
                </div>

                <div>
                    <label for="app_url" class="block text-sm font-medium text-gray-700">Application URL</label>
                    <fwb-input v-model="formData.app_url" id="app_url" type="url" placeholder="https://example.com"
                        class="mt-1" />
                </div>

                <div>
                    <label for="timezone" class="block text-sm font-medium text-gray-700">Timezone</label>
                    <fwb-select v-model="formData.timezone" id="timezone" class="mt-1">
                        <option value="">Select a timezone</option>
                        <option v-for="tz in timezones" :key="tz" :value="tz">
                            {{ tz }}
                        </option>
                    </fwb-select>
                </div>

                <div class="flex items-center gap-3 py-3">
                    <fwb-checkbox v-model="formData.maintenance_mode" id="maintenance" />
                    <label for="maintenance" class="ml-2 text-sm font-medium text-gray-700">Maintenance Mode</label>
                    <p class="text-xs text-gray-500">disable access to the application for regular users</p>
                </div>

                <div class="flex gap-3 pt-4 border-t border-gray-200">
                    <fwb-button type="submit" :disabled="formLoading" color="blue" class="flex-1 max-w-xs">
                        {{ formLoading ? 'Saving...' : 'Save Settings' }}
                    </fwb-button>
                </div>
            </form>
        </fwb-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import { TheCard as FwbCard, Input as FwbInput, Select as FwbSelect, Checkbox as FwbCheckbox, Button as FwbButton } from 'flowbite-vue'

const formData = ref({ app_name: '', app_url: '', timezone: 'UTC', maintenance_mode: false })
const formLoading = ref(false)

const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'Asia/Singapore',
    'Asia/Dubai',
    'Australia/Sydney',
]

const loadSettings = async () => {
    try {
        const response = await api.get('/settings')
        if (response.data.success) {
            formData.value = {
                app_name: response.data.data.app_name || '',
                app_url: response.data.data.app_url || '',
                timezone: response.data.data.timezone || 'UTC',
                maintenance_mode: response.data.data.maintenance_mode === 'true' || response.data.data.maintenance_mode === true,
            }
        }
    } catch (error) {
        console.error('Failed to load settings:', error)
    }
}

const handleSaveSettings = async () => {
    formLoading.value = true
    try {
        await api.put('/settings', formData.value)
        globalThis.showToast?.('Settings updated successfully', 'success')
    } catch (error) {
        globalThis.showToast?.(error.response?.data?.message || 'Error saving settings', 'error')
    } finally {
        formLoading.value = false
    }
}

onMounted(() => {
    loadSettings()
})
</script>

<style scoped></style>
