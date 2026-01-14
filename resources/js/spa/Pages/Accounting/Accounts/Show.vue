<template>
    <DashboardLayout>
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6">
            <!-- Header & Back Button -->
            <div class="mb-6 flex items-center justify-between">
                <button @click="goBack" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Kembali
                </button>
                
                <div v-if="canManage" class="space-x-2">
                    <button @click="goToEdit" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors">
                        Edit
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="space-y-4">
                <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div class="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
                {{ error }}
            </div>

            <!-- Content -->
            <div v-else class="space-y-6">
                <!-- Account Info Card -->
                <BaseCard>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Kode Akun</label>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white font-mono">{{ account.kode }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Nama Akun</label>
                            <p class="text-lg text-gray-900 dark:text-white">{{ account.nama }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Company Code</label>
                            <p class="text-gray-700 dark:text-gray-300">{{ account.company_code }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Parent ID</label>
                            <p class="text-gray-700 dark:text-gray-300">{{ account.parent_id || 'Tidak ada' }}</p>
                        </div>
                    </div>
                </BaseCard>

                <!-- Journal Entries -->
                <div>
                    <div class="mb-4">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Jurnal Entries</h2>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">Total: {{ journalPagination.total }} entries</p>
                    </div>

                    <BaseCard>
                        <!-- Empty -->
                        <div v-if="journalEntries.length === 0" class="text-center py-12">
                            <p class="text-gray-600 dark:text-gray-400">Belum ada jurnal entries untuk akun ini</p>
                        </div>

                        <!-- Table -->
                        <div v-else class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="border-b border-gray-300 dark:border-gray-600">
                                        <th class="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Tanggal</th>
                                        <th class="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Deskripsi</th>
                                        <th class="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Debit</th>
                                        <th class="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Kredit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="entry in journalEntries" :key="entry.id" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td class="px-4 py-3 font-mono text-gray-900 dark:text-white">{{ formatDate(entry.tanggal) }}</td>
                                        <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ entry.deskripsi }}</td>
                                        <td class="px-4 py-3 text-right font-semibold" :class="entry.debit > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'">
                                            {{ formatCurrency(entry.debit) }}
                                        </td>
                                        <td class="px-4 py-3 text-right font-semibold" :class="entry.kredit > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'">
                                            {{ formatCurrency(entry.kredit) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div v-if="journalEntries.length > 0" class="mt-6 flex justify-between items-center">
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                Halaman {{ journalPagination.current_page }} dari {{ journalPagination.last_page }}
                            </div>
                            <div class="space-x-2">
                                <button @click="previousJournalPage" :disabled="journalPagination.current_page === 1" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    Sebelumnya
                                </button>
                                <button @click="nextJournalPage" :disabled="journalPagination.current_page >= journalPagination.last_page" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    </BaseCard>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardLayout from '@/Layouts/DashboardLayout.vue'
import BaseCard from '@/Components/Base/BaseCard.vue'
import api from '@/utils/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const account = ref({})
const journalEntries = ref([])
const loading = ref(false)
const error = ref(null)
const journalPage = ref(1)
const journalPagination = ref({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
})

const canManage = computed(() => authStore.user?.permissions?.includes('Account.Manage'))

const loadAccount = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await api.get(`/api/v1/accounts/${route.params.id}`, {
            params: {
                page: journalPage.value,
                per_page: 10,
            },
        })
        
        account.value = response.data?.data?.account || {}
        journalEntries.value = response.data?.data?.journal_entries || []
        journalPagination.value = response.data?.data?.pagination || {}
    } catch (e) {
        error.value = e.response?.data?.message || 'Gagal memuat detail akun'
        console.error('[ACCOUNT SHOW]', e)
    }
    loading.value = false
}

const previousJournalPage = () => {
    if (journalPage.value > 1) {
        journalPage.value--
        loadAccount()
    }
}

const nextJournalPage = () => {
    if (journalPage.value < journalPagination.value.last_page) {
        journalPage.value++
        loadAccount()
    }
}

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

const goBack = () => {
    router.push('/accounting/accounts')
}

const goToEdit = () => {
    router.push(`/accounting/accounts/${route.params.id}/edit`)
}

onMounted(() => {
    loadAccount()
})
</script>
