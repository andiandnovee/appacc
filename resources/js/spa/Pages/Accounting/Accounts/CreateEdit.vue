<template>
    <DashboardLayout>
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6">
            <!-- Header & Back Button -->
            <div class="mb-6">
                <button @click="goBack" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors mb-4">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Kembali
                </button>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ isEdit ? 'Edit Akun' : 'Buat Akun Baru' }}</h1>
            </div>

            <!-- Form Card -->
            <BaseCard>
                <form @submit.prevent="submitForm" class="space-y-6">
                    <!-- Loading -->
                    <div v-if="loading" class="text-center py-8">
                        <p class="text-gray-600 dark:text-gray-400">Memuat data...</p>
                    </div>

                    <!-- Form -->
                    <div v-else class="space-y-6">
                        <!-- Kode Akun -->
                        <div>
                            <label for="kode" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Kode Akun <span class="text-red-600">*</span>
                            </label>
                            <input
                                id="kode"
                                v-model="form.kode"
                                type="text"
                                placeholder="e.g., 1101"
                                :disabled="isEdit"
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <p v-if="errors.kode" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.kode[0] }}</p>
                        </div>

                        <!-- Nama Akun -->
                        <div>
                            <label for="nama" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Nama Akun <span class="text-red-600">*</span>
                            </label>
                            <input
                                id="nama"
                                v-model="form.nama"
                                type="text"
                                placeholder="e.g., Kas"
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                            <p v-if="errors.nama" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.nama[0] }}</p>
                        </div>

                        <!-- Company Code -->
                        <div>
                            <label for="company_code" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Company Code <span class="text-red-600">*</span>
                            </label>
                            <input
                                id="company_code"
                                v-model="form.company_code"
                                type="text"
                                placeholder="e.g., BSKM"
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                            <p v-if="errors.company_code" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.company_code[0] }}</p>
                        </div>

                        <!-- Parent Account -->
                        <div>
                            <label for="parent_id" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Akun Induk (Opsional)
                            </label>
                            <select
                                id="parent_id"
                                v-model.number="form.parent_id"
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            >
                                <option :value="null">-- Pilih Akun Induk --</option>
                                <option v-for="acc in parentAccounts" :key="acc.id" :value="acc.id">
                                    [{{ acc.kode }}] {{ acc.nama }}
                                </option>
                            </select>
                            <p v-if="errors.parent_id" class="text-red-600 dark:text-red-400 text-sm mt-1">{{ errors.parent_id[0] }}</p>
                        </div>

                        <!-- Buttons -->
                        <div class="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                @click="goBack"
                                class="flex-1 px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                :disabled="submitting"
                                class="flex-1 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {{ submitting ? 'Menyimpan...' : isEdit ? 'Update' : 'Buat' }}
                            </button>
                        </div>
                    </div>
                </form>
            </BaseCard>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardLayout from '@/Layouts/DashboardLayout.vue'
import BaseCard from '@/Components/Base/BaseCard.vue'
import api from '@/utils/axios'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const accountId = route.params.id

const form = ref({
    kode: '',
    nama: '',
    company_code: '',
    parent_id: null,
})

const errors = ref({})
const loading = ref(false)
const submitting = ref(false)
const parentAccounts = ref([])

const loadParentAccounts = async () => {
    try {
        const response = await api.get('/api/v1/accounts')
        parentAccounts.value = response.data?.data?.accounts || []
    } catch (e) {
        console.error('[LOAD PARENT ACCOUNTS]', e)
    }
}

const loadAccount = async () => {
    loading.value = true
    try {
        const response = await api.get(`/api/v1/accounts/${accountId}`)
        const account = response.data?.data?.account || {}
        form.value = {
            kode: account.kode || '',
            nama: account.nama || '',
            company_code: account.company_code || '',
            parent_id: account.parent_id || null,
        }
    } catch (e) {
        alert('Gagal memuat data akun')
        console.error('[LOAD ACCOUNT]', e)
        goBack()
    }
    loading.value = false
}

const submitForm = async () => {
    errors.value = {}
    submitting.value = true
    
    try {
        if (isEdit) {
            await api.put(`/api/v1/accounts/${accountId}`, form.value)
            alert('Akun berhasil diupdate')
        } else {
            await api.post('/api/v1/accounts', form.value)
            alert('Akun berhasil dibuat')
        }
        router.push('/accounting/accounts')
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response?.data?.errors || {}
        } else {
            alert(e.response?.data?.message || 'Gagal menyimpan akun')
        }
        console.error('[SUBMIT ACCOUNT]', e)
    }
    submitting.value = false
}

const goBack = () => {
    router.push('/accounting/accounts')
}

onMounted(() => {
    loadParentAccounts()
    if (isEdit) {
        loadAccount()
    }
})
</script>
