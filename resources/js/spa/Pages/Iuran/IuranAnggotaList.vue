<!-- resources/js/spa/Pages/Iuran/IuranAnggotaList.vue -->
<template>
    <DashboardLayout>
        <div class="p-3 sm:p-6 transition-colors duration-500 bg-[var(--color-light-bg)] dark:bg-[var(--color-dark-bg)]">
            <div class="max-w-6xl mx-auto space-y-4 sm:space-y-8">
                <!-- Header Modern -->
                <div class="rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg p-3 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4 mb-2">
                    <div class="flex items-start sm:items-center gap-2 sm:gap-4 flex-shrink-0">
                        <div class="p-2 sm:p-3 bg-white/20 rounded-full flex-shrink-0">
                            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <h1 class="text-xl sm:text-3xl font-bold text-white drop-shadow-lg mb-1 sm:mb-2 break-words">Iuran Anggota</h1>
                            <p class="text-cyan-100 text-xs sm:text-base">Kelola dan lihat rincian iuran semua anggota dalam organisasi Anda.</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0 w-full md:w-auto">
                        <input v-model="searchQuery" placeholder="Cari nama / no induk..." class="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs sm:text-base shadow focus:ring-2 focus:ring-blue-500 focus:border-transparent transition flex-1 md:w-64" />
                    </div>
                </div>

                <!-- SKELETON LOADING -->
                <div v-if="isLoading" class="space-y-2 sm:space-y-4 animate-pulse">
                    <div class="h-8 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
                        <div v-for="i in 6" :key="i" class="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>

                <!-- ERROR MESSAGE -->
                <div v-else-if="loadError" class="mt-3 sm:mt-6">
                    <BaseCard class="p-3 sm:p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
                        <p class="text-red-600 dark:text-red-200 text-xs sm:text-base">{{ loadError }}</p>
                    </BaseCard>
                </div>

                <!-- KOSONG -->
                <div v-else-if="filteredAnggotas.length === 0" class="text-center py-6 sm:py-12">
                    <BaseCard class="p-6 sm:p-8">
                        <div class="text-gray-500 dark:text-gray-400 text-sm sm:text-lg">
                            {{ searchQuery ? 'Tidak ada anggota yang cocok dengan pencarian.' : 'Belum ada data anggota.'
                            }}
                        </div>
                    </BaseCard>
                </div>

                <!-- LIST ANGGOTA - CARDS + PAGINATION -->
                <div v-else class="space-y-3 sm:space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
                        <BaseCard v-for="anggota in paginatedAnggotas" :key="anggota.anggota_id"
                            class="p-3 sm:p-5 shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/30 hover:shadow-xl transition-shadow cursor-pointer"
                            @click="goToDetail(anggota.anggota_id)">
                            <!-- Header Card Modern -->
                            <div class="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate flex items-center gap-1 sm:gap-2">
                                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        {{ anggota.nama }}
                                        <span v-if="anggota.kode" class="text-xs font-normal text-gray-400 dark:text-gray-500 ml-1 flex-shrink-0">({{ anggota.kode }})</span>
                                    </h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ anggota.no_induk }}</p>
                                </div>
                                <!-- Avatar -->
                                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 shadow">
                                    <span class="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-300">{{ getInitials(anggota.nama) }}</span>
                                </div>
                            </div>
                            <div class="border-t border-gray-200 dark:border-gray-700 my-2 sm:my-3"></div>
                            <!-- Email -->
                            <div v-if="anggota.email" class="mb-2 sm:mb-3 text-xs sm:text-sm">
                                <p class="text-gray-500 dark:text-gray-400 text-xs">Email</p>
                                <p class="text-gray-700 dark:text-gray-300 truncate text-xs sm:text-sm">{{ anggota.email }}</p>
                            </div>
                            <!-- Alamat singkat -->
                            <div v-if="anggota.perum || anggota.no_rumah" class="mb-2 sm:mb-3 text-xs sm:text-sm">
                                <p class="text-gray-500 dark:text-gray-400 text-xs">Alamat</p>
                                <p class="text-gray-700 dark:text-gray-300 truncate text-xs sm:text-sm">
                                    {{ anggota.perum || '-' }}
                                    <span v-if="anggota.no_rumah">• No {{ anggota.no_rumah }}</span>
                                </p>
                            </div>
                            <!-- Summary Iuran Modern -->
                            <div class="space-y-1.5 sm:space-y-2">
                                <div class="flex justify-between items-center p-2 sm:p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                    <span class="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                        <svg class="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                        Sudah Dibayar
                                    </span>
                                    <span class="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-300">Rp {{ formatNumber(anggota.total_sudah_dibayar) }}</span>
                                </div>
                                <div class="flex justify-between items-center p-2 sm:p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                                    <span class="text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-1">
                                        <svg class="w-3 h-3 sm:w-4 sm:h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-1.414 1.414A9 9 0 105.636 18.364l1.414-1.414A7 7 0 1116.95 7.05z"/></svg>
                                        Belum Dibayar
                                    </span>
                                    <span class="text-xs sm:text-sm font-bold text-red-600 dark:text-red-300">Rp {{ formatNumber(anggota.total_belum_dibayar) }}</span>
                                </div>
                                <div class="flex justify-between items-center p-2 sm:p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <span class="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                        <svg class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        Total Kewajiban
                                    </span>
                                    <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(anggota.total_kewajiban ?? (anggota.total_sudah_dibayar + anggota.total_belum_dibayar)) }}</span>
                                </div>
                            </div>
                            <div class="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
                                <button @click.stop="goToDetail(anggota.anggota_id)" class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-base font-bold text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center justify-center gap-2 transition">
                                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                                    Lihat Detail
                                </button>
                            </div>
                        </BaseCard>
                    </div>

                    <!-- Pagination Controls -->
                    <div class="flex flex-col sm:flex-row items-center sm:items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 gap-3 sm:gap-2">
                        <div class="text-center sm:text-left text-xs sm:text-sm">
                            Halaman {{ currentPage }} dari {{ totalPages }} — total
                            {{ filteredAnggotas.length }} anggota
                        </div>
                        <div class="flex items-center gap-2 w-full sm:w-auto">
                            <BaseButton class="flex-1 sm:flex-initial" :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">
                                Prev
                            </BaseButton>
                            <BaseButton class="flex-1 sm:flex-initial" :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">
                                Next
                            </BaseButton>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"
import { useRouter } from "vue-router"

import DashboardLayout from "@/Layouts/DashboardLayout.vue"
import BaseCard from "@/Components/Base/BaseCard.vue"
import api from "@/utils/axios"

const router = useRouter()

const anggotas = ref([])
const searchQuery = ref("")
const isLoading = ref(true)
const loadError = ref(null)

// pagination (client-side)
const perPage = ref(9)
const currentPage = ref(1)

// Helper: format number to Indonesian Rupiah
function formatNumber(n) {
    if (n === null || n === undefined) return "0"
    return new Intl.NumberFormat("id-ID").format(Number(n))
}

// Helper: get initials from name
function getInitials(name) {
    if (!name) return "?"
    const parts = name.split(' ')
    return parts.length ? (parts[0].charAt(0) + (parts[1]?.charAt(0) || '')).toUpperCase() : name.substring(0, 2).toUpperCase()
}

// Filter anggotas berdasarkan searchQuery
const filteredAnggotas = computed(() => {
    if (!searchQuery.value.trim()) {
        return anggotas.value
    }

    const query = searchQuery.value.toLowerCase()
    return anggotas.value.filter(anggota =>
        anggota.nama.toLowerCase().includes(query) ||
        (anggota.kode && anggota.kode.toLowerCase().includes(query)) ||
        (anggota.no_induk && anggota.no_induk.toLowerCase().includes(query)) ||
        (anggota.email && anggota.email.toLowerCase().includes(query)) ||
        (anggota.perum && String(anggota.perum).toLowerCase().includes(query)) ||
        (anggota.no_rumah && String(anggota.no_rumah).toLowerCase().includes(query)) ||
        (anggota.village && String(anggota.village).toLowerCase().includes(query))
    )
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredAnggotas.value.length / perPage.value))
)

const paginatedAnggotas = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    return filteredAnggotas.value.slice(start, start + perPage.value)
})

// Navigate ke detail anggota
function goToDetail(anggotaId) {
    router.push({
        name: 'iuran.anggota.show',
        params: { anggotaId }
    })
}

async function loadAnggotas() {
    isLoading.value = true
    loadError.value = null

    try {
        const res = await api.get("/api/v1/iuran/anggota")

        if (res.data?.success) {
            anggotas.value = res.data.data.anggotas || []
        } else {
            loadError.value = res.data?.message || 'Gagal memuat data.'
        }
    } catch (e) {
        loadError.value = e.response?.data?.message || e.message || String(e)
    } finally {
        // Beri sedikit delay supaya animasi loading terasa halus
        setTimeout(() => {
            isLoading.value = false
        }, 250)
    }
}

function changePage(page) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
}

watch(
    () => searchQuery.value,
    () => {
        currentPage.value = 1
    }
)

onMounted(() => {
    loadAnggotas()
})
</script>
