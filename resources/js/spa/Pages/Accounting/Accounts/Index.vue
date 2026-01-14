<template>
    <DashboardLayout>
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6">
            <!-- Header -->
            <div class="mb-6">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-4">
                        <div class="p-4 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-lg shadow-lg">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Daftar Akun (Tree View)</h1>
                            <p class="text-gray-600 dark:text-gray-300">Kelola akun berjenjang dan lihat jurnal entries</p>
                        </div>
                    </div>

                    <button v-if="canManage" @click="navigateTo('/accounting/accounts/create')" class="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Akun Baru
                    </button>
                </div>
            </div>

            <!-- Search Card -->
            <BaseCard class="mb-6">
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="flex-1 relative">
                        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input 
                            v-model="searchQuery" 
                            @input="filterAccounts"
                            type="text" 
                            placeholder="Cari kode atau nama akun..."
                            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        >
                    </div>
                    <button 
                        v-if="searchQuery"
                        @click="clearSearch"
                        class="px-4 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold transition-colors whitespace-nowrap"
                    >
                        Bersihkan
                    </button>
                </div>
                <div v-if="searchQuery" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Menampilkan {{ filteredAccounts.length }} dari {{ allAccounts.length }} akun
                </div>
            </BaseCard>

            <!-- Content -->
            <BaseCard>
                <!-- Loading -->
                <div v-if="loading" class="space-y-4">
                    <div v-for="i in 8" :key="i" class="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>

                <!-- Error -->
                <div v-else-if="error" class="text-center py-8">
                    <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
                    <button @click="loadAccounts" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                        Muat Ulang
                    </button>
                </div>

                <!-- Empty -->
                <div v-else-if="filteredAccounts.length === 0" class="text-center py-12">
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                        {{ searchQuery ? 'Tidak ada akun yang cocok dengan pencarian' : 'Tidak ada akun ditemukan' }}
                    </p>
                </div>

                <!-- Tree View -->
                <div v-else class="space-y-1">
                    <AccountTreeNode 
                        v-for="account in filteredAccounts" 
                        :key="account.id"
                        :account="account"
                        :can-manage="canManage"
                        :can-delete="canDelete"
                        @navigate="handleNavigate"
                        @delete="deleteAccount"
                        level="0"
                    />
                </div>
            </BaseCard>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/Layouts/DashboardLayout.vue'
import BaseCard from '@/Components/Base/BaseCard.vue'
import AccountTreeNode from '@/Components/Accounting/AccountTreeNode.vue'
import api from '@/utils/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const allAccounts = ref([])
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)

const canManage = computed(() => authStore.user?.permissions?.includes('Account.Manage'))
const canDelete = computed(() => authStore.user?.permissions?.includes('Account.Delete'))

// Filter accounts berdasarkan search query
const filteredAccounts = computed(() => {
    if (!searchQuery.value.trim()) {
        return allAccounts.value
    }

    const query = searchQuery.value.toLowerCase()
    
    // Fungsi rekursif untuk filter tree dengan parent-child
    const filterTree = (accounts) => {
        return accounts
            .map(account => {
                const accountMatches = 
                    account.kode.toLowerCase().includes(query) ||
                    account.nama.toLowerCase().includes(query)
                
                let filteredChildren = []
                if (account.children && account.children.length > 0) {
                    filteredChildren = filterTree(account.children)
                }
                
                // Include account jika match atau ada child yang match
                if (accountMatches || filteredChildren.length > 0) {
                    return {
                        ...account,
                        children: filteredChildren
                    }
                }
                return null
            })
            .filter(acc => acc !== null)
    }
    
    return filterTree(allAccounts.value)
})

const loadAccounts = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await api.get('/api/v1/accounts/tree')
        allAccounts.value = response.data?.data || []
    } catch (e) {
        error.value = e.response?.data?.message || 'Gagal memuat daftar akun'
        console.error('[ACCOUNTS INDEX]', e)
    }
    loading.value = false
}

const filterAccounts = () => {
    // Real-time filtering, triggered by input
}

const clearSearch = () => {
    searchQuery.value = ''
}

const deleteAccount = async (id) => {
    if (!confirm('Yakin ingin menghapus akun ini?')) return
    
    try {
        await api.delete(`/api/v1/accounts/${id}`)
        alert('Akun berhasil dihapus')
        loadAccounts()
    } catch (e) {
        alert('Gagal menghapus akun: ' + (e.response?.data?.message || e.message))
    }
}

const handleNavigate = (path) => {
    router.push(path)
}

const navigateTo = (path) => {
    router.push(path)
}

onMounted(() => {
    loadAccounts()
})
</script>
