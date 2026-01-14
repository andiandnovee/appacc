<template>
  <DashboardLayout>
    <div class="space-y-4">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Jurnal</h1>
        <p class="mt-2 text-sm text-gray-600">Daftar seluruh entri jurnal</p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow p-4 space-y-4">
      <!-- Row 1: Search & Status -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Cari deskripsi
          </label>
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Cari jurnal..."
              @keyup.enter="fetchJournal()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            v-model="filters.status"
            @change="fetchJournal"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua</option>
            <option value="parked">Parked</option>
            <option value="posted">Posted</option>
          </select>
        </div>
      </div>

      <!-- Row 2: Date Range -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Dari tanggal
          </label>
          <input
            v-model="filters.startDate"
            type="date"
            @change="fetchJournal"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Sampai tanggal
          </label>
          <input
            v-model="filters.endDate"
            type="date"
            @change="fetchJournal"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Row 3: Accounts Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Filter Akun (opsional)
        </label>
        <div class="relative">
          <input
            v-model="accountSearch"
            type="text"
            placeholder="Cari & pilih akun (kode atau nama)..."
            @focus="showAccountDropdown = true"
            @blur="handleAccountInputBlur"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <!-- Account Dropdown -->
          <div v-show="showAccountDropdown" class="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            <div v-if="accounts.length === 0" class="px-4 py-2 text-gray-500 text-sm">
              Memuat akun... (atau tidak ada akun tersedia)
            </div>
            <div v-else-if="filteredAccounts.length === 0" class="px-4 py-2 text-gray-500 text-sm">
              Tidak ada akun ditemukan untuk "{{ accountSearch }}"
            </div>
            <div
              v-for="account in filteredAccounts"
              :key="account.id"
              @click="toggleAccount(account)"
              :class="[
                'px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm',
                isAccountSelected(account.id) ? 'bg-blue-100' : ''
              ]"
            >
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="isAccountSelected(account.id)"
                  class="mr-2"
                />
                <span class="font-mono text-gray-600">{{ account.code }}</span>
                <span class="ml-2 text-gray-900">{{ account.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Accounts Tags -->
        <div v-if="selectedAccounts.length > 0" class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="account in selectedAccounts"
            :key="account.id"
            class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            <span>{{ account.code }}</span>
            <button
              @click="removeAccount(account.id)"
              class="font-bold hover:text-blue-900"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Row 4: Per Page & Actions -->
      <div class="flex items-end gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Per halaman
          </label>
          <select
            v-model.number="filters.perPage"
            @change="fetchJournal"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
        <button
          @click="resetFilters"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Table -->
    <div v-else-if="entries.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tanggal</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Deskripsi</th>
              <th class="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
              <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Debit</th>
              <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Kredit</th>
              <th class="px-6 py-3 text-center text-sm font-semibold text-gray-900">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="entry in entries" :key="entry.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {{ formatDate(entry.date) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ entry.description }}
              </td>
              <td class="px-6 py-4 text-sm text-center">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  entry.status === 'posted'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ entry.status === 'posted' ? 'Posted' : 'Parked' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-right text-gray-900">
                {{ formatCurrency(entry.total_debit) }}
              </td>
              <td class="px-6 py-4 text-sm text-right text-gray-900">
                {{ formatCurrency(entry.total_kredit) }}
              </td>
              <td class="px-6 py-4 text-sm text-center">
                <router-link
                  :to="{ name: 'accounting.journal.show', params: { id: entry.id } }"
                  class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  Lihat
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada jurnal</h3>
      <p class="mt-1 text-sm text-gray-500">Belum ada data jurnal yang tersedia</p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.last_page > 1" class="flex items-center justify-between bg-white rounded-lg shadow p-4">
      <p class="text-sm text-gray-600">
        Menampilkan halaman {{ pagination.current_page }} dari {{ pagination.last_page }} ({{ pagination.total }} total)
      </p>
      <div class="flex gap-2">
        <button
          @click="fetchJournal(pagination.current_page - 1)"
          :disabled="pagination.current_page <= 1"
          class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sebelumnya
        </button>
        <div class="flex items-center gap-2">
          <span v-for="page in pageNumbers" :key="page">
            <button
              v-if="page === '...'"
              disabled
              class="px-2 py-2 text-gray-500"
            >
              {{ page }}
            </button>
            <button
              v-else
              @click="fetchJournal(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-lg',
                page === pagination.current_page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </span>
        </div>
        <button
          @click="fetchJournal(pagination.current_page + 1)"
          :disabled="pagination.current_page >= pagination.last_page"
          class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Berikutnya
        </button>
      </div>
    </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/utils/axios'
import DashboardLayout from '@/Layouts/DashboardLayout.vue'

const loading = ref(false)
const entries = ref([])
const pagination = ref(null)
const accounts = ref([])
const selectedAccounts = ref([])
const accountSearch = ref('')
const showAccountDropdown = ref(false)

// Get first and last date of current month
const getMonthDateRange = () => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  return {
    start: firstDay.toISOString().split('T')[0],
    end: lastDay.toISOString().split('T')[0]
  }
}

const filters = ref({
  search: '',
  status: 'all',
  startDate: getMonthDateRange().start,
  endDate: getMonthDateRange().end,
  perPage: 15
})

// Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper to format currency
const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Filter accounts based on search
const filteredAccounts = computed(() => {
  if (!accountSearch.value) {
    return accounts.value
  }
  
  const search = accountSearch.value.toLowerCase()
  const filtered = accounts.value.filter(acc => 
    acc.code.toLowerCase().includes(search) ||
    acc.name.toLowerCase().includes(search)
  )
  return filtered
})

// Check if account is selected
const isAccountSelected = (accountId) => {
  return selectedAccounts.value.some(acc => acc.id === accountId)
}

// Toggle account selection
const toggleAccount = (account) => {
  if (isAccountSelected(account.id)) {
    selectedAccounts.value = selectedAccounts.value.filter(acc => acc.id !== account.id)
  } else {
    selectedAccounts.value.push(account)
  }
  // Dont fetchJournal here - let dropdown stay open for multiple selections
  // User can select multiple accounts before closing dropdown
}

// Handle account input blur with delay
const handleAccountInputBlur = () => {
  setTimeout(() => {
    showAccountDropdown.value = false
    // Auto fetch when dropdown closes if accounts were selected
    if (selectedAccounts.value.length > 0) {
      fetchJournal()
    }
  }, 200)
}

// Remove account from selection (from tags)
const removeAccount = (accountId) => {
  selectedAccounts.value = selectedAccounts.value.filter(acc => acc.id !== accountId)
  fetchJournal()  // Fetch when removing from tags to show updated results
}

// Reset all filters
const resetFilters = () => {
  const range = getMonthDateRange()
  filters.value = {
    search: '',
    status: 'all',
    startDate: range.start,
    endDate: range.end,
    perPage: 15
  }
  selectedAccounts.value = []
  accountSearch.value = ''
  fetchJournal()
}

// Compute page numbers for pagination
const pageNumbers = computed(() => {
  if (!pagination.value) return []
  const { current_page, last_page } = pagination.value
  const pages = []
  const range = 2

  pages.push(1)

  if (current_page - range > 2) {
    pages.push('...')
  }

  for (let i = Math.max(2, current_page - range); i <= Math.min(last_page - 1, current_page + range); i++) {
    pages.push(i)
  }

  if (current_page + range < last_page - 1) {
    pages.push('...')
  }

  if (last_page > 1) {
    pages.push(last_page)
  }

  return pages
})

// Fetch journal entries
const fetchJournal = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      per_page: filters.value.perPage,
      page: page
    }

    if (filters.value.search) {
      params.search = filters.value.search
    }
    if (filters.value.status && filters.value.status !== 'all') {
      params.status = filters.value.status
    }
    if (filters.value.startDate) {
      params.start_date = filters.value.startDate
    }
    if (filters.value.endDate) {
      params.end_date = filters.value.endDate
    }
    if (selectedAccounts.value.length > 0) {
      params.account_ids = selectedAccounts.value.map(acc => acc.id).join(',')
    }

    const response = await api.get('/v1/journal', { params })
    const journalData = response.data.data
    entries.value = journalData.entries || []
    pagination.value = journalData.pagination || {}
  } catch (error) {
    console.error('Failed to fetch journal:', error)
  } finally {
    loading.value = false
  }
}

// Fetch accounts list for filter
const fetchAccounts = async () => {
  try {
    console.log('[DEBUG] Fetching accounts...')
    const response = await api.get('/v1/accounts')
    console.log('[DEBUG] Accounts response:', response.data)
    
    const accountsData = Array.isArray(response.data.data) ? response.data.data : []
    console.log('[DEBUG] Processed accounts count:', accountsData.length)
    
    accounts.value = accountsData.map(acc => ({
      id: acc.id,
      code: acc.kode,
      name: acc.nama
    }))
    
    console.log('[DEBUG] Accounts mapped:', accounts.value.length)
  } catch (error) {
    console.error('Failed to fetch accounts:', error)
    console.error('Error response:', error.response?.data)
    accounts.value = []
  }
}

// Fetch on mount
onMounted(() => {
  fetchAccounts()
  fetchJournal()
})
</script>
