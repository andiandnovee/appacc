<template>
  <DashboardLayout>
    <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <router-link
          :to="{ name: 'accounting.journal.index' }"
          class="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
        >
          <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Kembali
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900">Detail Jurnal</h1>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Content -->
    <div v-else-if="entry && lines" class="space-y-4">
      <!-- Entry Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <p class="text-lg font-semibold text-gray-900">{{ formatDate(entry.date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <p class="text-lg font-semibold text-gray-900">{{ entry.description }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              entry.status === 'posted'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            ]">
              {{ entry.status === 'posted' ? 'Posted' : 'Parked' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Lines Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Jurnal Details</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kode Akun</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nama Akun</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Debit</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Kredit</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="line in lines" :key="line.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-900 font-mono">
                  {{ line.account_code }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ line.account_name }}
                </td>
                <td class="px-6 py-4 text-sm text-right text-gray-900">
                  {{ line.debit > 0 ? formatCurrency(line.debit) : '-' }}
                </td>
                <td class="px-6 py-4 text-sm text-right text-gray-900">
                  {{ line.kredit > 0 ? formatCurrency(line.kredit) : '-' }}
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 border-t-2 border-gray-300">
              <tr class="font-semibold">
                <td colspan="2" class="px-6 py-4 text-sm text-gray-900">Total</td>
                <td class="px-6 py-4 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.debit) }}
                </td>
                <td class="px-6 py-4 text-sm text-right text-gray-900">
                  {{ formatCurrency(totals.kredit) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Balance Check -->
      <div :class="[
        'rounded-lg p-4 flex items-center gap-3',
        totals.balance === 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      ]">
        <div>
          <svg v-if="totals.balance === 0" class="w-6 h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <p :class="[
            'font-semibold',
            totals.balance === 0 ? 'text-green-900' : 'text-red-900'
          ]">
            {{ totals.balance === 0 ? 'Jurnal seimbang' : 'Jurnal tidak seimbang' }}
          </p>
          <p :class="[
            'text-sm',
            totals.balance === 0 ? 'text-green-700' : 'text-red-700'
          ]">
            Selisih: {{ formatCurrency(Math.abs(totals.balance)) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Jurnal tidak ditemukan</h3>
    </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/axios'
import DashboardLayout from '@/Layouts/DashboardLayout.vue'

const route = useRoute()
const loading = ref(false)
const entry = ref(null)
const lines = ref(null)

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

// Computed totals
const totals = computed(() => {
  if (!lines.value || lines.value.length === 0) {
    return { debit: 0, kredit: 0, balance: 0 }
  }

  const debit = lines.value.reduce((sum, line) => sum + line.debit, 0)
  const kredit = lines.value.reduce((sum, line) => sum + line.kredit, 0)
  const balance = debit - kredit

  return { debit, kredit, balance }
})

// Fetch journal detail
const fetchJournal = async () => {
  loading.value = true
  try {
    const response = await api.get(`/v1/journal/${route.params.id}`)
    const journalData = response.data.data
    entry.value = journalData.entry || {}
    lines.value = journalData.lines || []
  } catch (error) {
    console.error('Failed to fetch journal:', error)
  } finally {
    loading.value = false
  }
}

// Fetch on mount
onMounted(() => {
  fetchJournal()
})
</script>
