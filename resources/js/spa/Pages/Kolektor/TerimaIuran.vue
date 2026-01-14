<template>
    <DashboardLayout>
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6">
            <!-- Modern Hero Header -->
            <div class="mb-4 sm:mb-8">
                <div class="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div class="p-2 sm:p-4 bg-gradient-to-br from-teal-500 via-cyan-500 to-cyan-400 rounded-lg sm:rounded-2xl shadow-xl flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white drop-shadow">Terima Iuran</h1>
                        <p class="text-xs sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 break-words">Catat penerimaan iuran dari anggota dengan tampilan modern dan responsif.</p>
                    </div>
                </div>

                <!-- Header + Pencarian -->
                <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div class="bg-gradient-to-r from-teal-50 to-cyan-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-8 border-b border-gray-200 dark:border-gray-600">
                        <div class="flex items-center gap-2 sm:gap-4">
                            <svg class="w-5 h-5 sm:w-7 sm:h-7 text-teal-600 dark:text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <div class="min-w-0">
                                <h3 class="text-base sm:text-xl font-bold text-gray-900 dark:text-white">Cari Anggota</h3>
                                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0 sm:mt-1">Cari berdasarkan nama, no induk, atau email</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 sm:p-8 space-y-3 sm:space-y-4">
                        <div class="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-center">
                            <div class="relative flex-1">
                                <input v-model="searchQuery" type="search"
                                    placeholder="Cari nama, no induk, atau email..."
                                    class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm hover:shadow-md">
                                <span class="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-teal-500 dark:text-teal-400">
                                    <svg class="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </span>
                            </div>

                            <button v-if="selectedAnggotaId"
                                @click="resetSelection"
                                class="w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-2xl font-semibold shadow">
                                Cari Lagi
                            </button>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            Ketik untuk mencari dan memfilter daftar anggota
                        </p>
                    </div>
                </div>
            </div>

            <!-- GRID UTAMA -->
            <div class="max-w-7xl mx-auto">
                <div class="grid gap-3 sm:gap-6 lg:grid-cols-4">

                    <!-- KIRI: LIST / DETAIL -->
                    <div class="space-y-3 sm:space-y-4 lg:col-span-3">

                        <!-- MODE LIST -->
                        <template v-if="!showDetail">

                            <!-- Loading -->
                            <div v-if="anggotasLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                                <div v-for="i in 6" :key="i"
                                    class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 animate-pulse border">
                                    <div class="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>

                            <!-- Error -->
                            <div v-else-if="anggotasError">
                                <BaseCard class="border-2 border-red-500 p-3 sm:p-4 text-center">
                                    {{ anggotasError }}
                                </BaseCard>
                            </div>

                            <!-- Empty -->
                            <div v-else-if="filteredAnggotas.length === 0" class="text-center p-12">
                                <h3 class="text-lg font-semibold">{{ searchQuery ? "Tidak Ada Anggota" : "Mulai Pencarian" }}</h3>
                            </div>

                            <!-- Cards -->
                            <div v-else class="space-y-4">
                                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div v-for="anggota in paginatedAnggotas" :key="anggota.anggota_id"
                                        @click="selectAnggota(anggota)"
                                        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 cursor-pointer">

                                        <div class="p-4">
                                            <h3 class="font-bold text-lg truncate">{{ anggota.nama }}</h3>
                                            <p class="text-xs text-gray-500">{{ formatAlamat(anggota) }}</p>
                                        </div>

                                    </div>
                                </div>

                                <!-- Pagination -->
                                <div class="flex justify-between text-sm">
                                    <div>Hal {{ currentPage }} / {{ totalPages }}</div>
                                    <div class="flex gap-2">
                                        <BaseButton :disabled="currentPage<=1" @click="changePage(currentPage-1)">Prev</BaseButton>
                                        <BaseButton :disabled="currentPage>=totalPages" @click="changePage(currentPage+1)">Next</BaseButton>
                                    </div>
                                </div>
                            </div>

                        </template>

                        <!-- MODE DETAIL -->
                        <template v-else>
                            <div class="space-y-4">

                                <!-- Loading -->
                                <div v-if="detailLoading">
                                    <BaseCard class="animate-pulse h-96"></BaseCard>
                                </div>

                                <!-- Error -->
                                <div v-else-if="detailError">
                                    <BaseCard class="bg-red-100 p-4">{{ detailError }}</BaseCard>
                                </div>

                                <!-- DETAIL -->
                                <div v-else-if="detailData">
                                    <BaseCard>
                                        <h2 class="text-xl font-bold">{{ detailData.anggota.nama }}</h2>
                                        <p class="text-xs text-gray-500">{{ formatAlamat(detailData.anggota) }}</p>
                                    </BaseCard>

                                    <div class="space-y-2">
                                        <IuranCard v-for="item in detailData.iurans" :key="item.id"
                                            :iuran="item" 
                                            :anggota-id="detailData.anggota.id"
                                            :read-only="false"
                                            :is-selected="selectedIuranId === item.id"
                                            @select="handleSelectIuran"
                                            @pay-bulanan="handlePayBulanan" 
                                            @pay-once="handlePayOnce"/>
                                    </div>
                                </div>

                                <!-- Default -->
                                <div v-else>
                                    <BaseCard>Pilih anggota terlebih dahulu.</BaseCard>
                                </div>

                            </div>
                        </template>
                    </div>

                    <!-- KANAN: PENDING SETORAN -->
                    <div class="space-y-4 lg:col-span-1">

                        <BaseCard>
                            <h3 class="font-semibold text-lg">Belum Disetor</h3>
                        </BaseCard>

                        <!-- Loading -->
                        <div v-if="pendingLoading" class="space-y-3">
                            <BaseCard class="h-16 animate-pulse" />
                            <BaseCard class="h-16 animate-pulse" />
                        </div>

                        <!-- Error -->
                        <div v-else-if="pendingError">
                            <BaseCard class="bg-red-100 p-4">
                                {{ pendingError }}
                                <button @click="loadPendingSetoran" class="text-xs underline">Muat ulang</button>
                            </BaseCard>
                        </div>

                        <!-- Empty -->
                        <div v-else-if="pendingSetoran.length===0">
                            <BaseCard>Belum ada pending.</BaseCard>
                        </div>

                        <!-- LIST -->
                        <div v-else class="space-y-3">
                            <BaseCard v-for="item in pendingSetoran" :key="item.anggota_id"
                                :class="[ isPendingItemCanceled(item) ? 'opacity-70 border-dashed' : '' ]">

                                <div class="flex justify-between">
                                    <div>
                                        <p class="font-semibold">{{ item.nama }}</p>
                                        <p class="text-xs text-gray-500">Total: Rp {{ formatCurrency(item.total_jumlah) }}</p>
                                    </div>

                                    <button v-if="!isPendingItemCanceled(item)"
                                        class="text-xs text-red-600"
                                        @click="cancelPending(item)">
                                        Batalkan
                                    </button>
                                </div>

                            </BaseCard>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    </DashboardLayout>
</template>
<script setup>

function formatAlamat(anggota) {
    if (anggota.perum || anggota.no_rumah) {
        return `${anggota.perum || ''}${anggota.no_rumah ? ' • No '+anggota.no_rumah : ''}`;
    }
    return 'Alamat belum tersedia';
}

import { ref, onMounted, watch, computed } from "vue";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import BaseCard from "@/Components/Base/BaseCard.vue";
import BaseButton from "@/Components/Base/BaseButton.vue";
import IuranCard from "@/Components/Iuran/IuranCard.vue";
import api from "@/utils/axios";

// 👉 FIX: paymentForm harus ada
const paymentForm = ref({
    refIuranId: "",
    jumlah: "",
    tanggalBayar: new Date().toISOString().slice(0,10),
    catatan: "",
});

const searchQuery = ref("");
const anggotas = ref([]);
const anggotasLoading = ref(false);
const anggotasError = ref(null);

const perPageAnggotas = ref(9);
const currentPage = ref(1);

const selectedAnggotaId = ref(null);
const selectedIuranId = ref(null);
const detailData = ref(null);
const detailLoading = ref(false);
const detailError = ref(null);
const showDetail = ref(false);

const pendingSetoran = ref([]);
const pendingLoading = ref(false);
const pendingError = ref(null);

const isSubmittingPayment = ref(false);
const paymentError = ref(null);
const paymentSuccess = ref(false);
const paymentMessage = ref("");

const filteredAnggotas = computed(() => {
    if (!searchQuery.value.trim()) return anggotas.value;
    const q = searchQuery.value.toLowerCase();
    return anggotas.value.filter(a =>
        a.nama?.toLowerCase().includes(q) ||
        a.kode?.toLowerCase().includes(q) ||
        a.no_induk?.toLowerCase().includes(q)
    );
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredAnggotas.value.length / perPageAnggotas.value)));

const paginatedAnggotas = computed(() => {
    const s = (currentPage.value - 1) * perPageAnggotas.value;
    return filteredAnggotas.value.slice(s, s + perPageAnggotas.value);
});

const selectAnggota = async (anggota) => {
    selectedAnggotaId.value = anggota.anggota_id;
    selectedIuranId.value = null; // Reset iuran selection
    showDetail.value = true;
    await loadDetail(anggota.anggota_id);
};

const resetSelection = () => {
    selectedAnggotaId.value = null;
    selectedIuranId.value = null; // Reset iuran selection
    detailData.value = null;
    showDetail.value = false;
    paymentForm.value = {
        refIuranId: "",
        jumlah: "",
        tanggalBayar: new Date().toISOString().slice(0,10),
        catatan: "",
    };
};

const loadDetail = async (id) => {
    detailLoading.value = true;
    detailError.value = null;
    try {
        const res = await api.get(`/api/v1/iuran/anggota/${id}`);
        detailData.value = res.data?.data;
    } catch (e) {
        detailError.value = "Gagal memuat detail.";
    }
    detailLoading.value = false;
};

const loadAnggotas = async () => {
    anggotasLoading.value = true;
    try {
        const res = await api.get("/api/v1/iuran/anggota");
        anggotas.value = res.data?.data?.anggotas || [];
    } catch (e) {
        anggotasError.value = "Gagal memuat anggota.";
    }
    anggotasLoading.value = false;
};

const changePage = (p) => {
    if (p<1 || p>totalPages.value) return;
    currentPage.value = p;
};

const loadPendingSetoran = async () => {
    pendingLoading.value = true;
    try {
        const res = await api.get("/api/v1/kolektor/receipts/pending");
        pendingSetoran.value = res.data?.data || [];
    } catch (e) {
        pendingError.value = "Gagal memuat pending.";
    }
    pendingLoading.value = false;
};

const handleSelectIuran = (iuranId) => {
    // Toggle selection: if already selected, deselect; otherwise select
    if (selectedIuranId.value === iuranId) {
        selectedIuranId.value = null;
    } else {
        selectedIuranId.value = iuranId;
    }
};

const cancelPending = async (item) => {
    if (!confirm(`Batalkan pending ${item.nama}?`)) return;
    try {
        await api.post("/api/v1/kolektor/receipts/pending/cancel", {
            receipt_id: item.id
        });
        await loadPendingSetoran();
    } catch (e) {
        alert("Gagal membatalkan pending: " + (e.response?.data?.message || e.message));
    }
};

const handlePayBulanan = async (payload) => {
    // payload = { anggotaId, refIuranId, months, amountPerMonth, tanggalBayar, catatan }
    if (!payload || !payload.months?.length) {
        alert("Pilih bulan yang akan dibayar.");
        return;
    }
    
    try {
        // Kirim satu request per bulan yang dipilih
        for (const bulan of payload.months) {
            await api.post("/api/v1/kolektor/receipts", {
                anggota_id: Number(payload.anggotaId),
                ref_iuran_id: Number(payload.refIuranId),
                jumlah: Number(payload.amountPerMonth),
                tanggal_bayar: payload.tanggalBayar,
                catatan: payload.catatan ? `${payload.catatan} (bulan ${bulan})` : `Bulan ${bulan}`,
                periode_bulan: Number(bulan)
            });
        }
        
        alert("Pembayaran berhasil disimpan.");
        // Reload detail untuk refresh status pembayaran
        await loadDetail(payload.anggotaId);
        await loadPendingSetoran();
    } catch (e) {
        console.error('[PAY-BULANAN] Error:', e.response?.data || e.message);
        const errMsg = e.response?.data?.errors 
            ? Object.values(e.response.data.errors).flat().join(', ')
            : (e.response?.data?.message || e.message);
        alert("Gagal menyimpan pembayaran: " + errMsg);
    }
};

const handlePayOnce = async (payload) => {
    // payload = { anggotaId, refIuranId, jumlah, tanggalBayar, catatan }
    if (!payload || !payload.jumlah || payload.jumlah <= 0) {
        alert("Nominal pembayaran harus lebih dari 0.");
        return;
    }
    
    try {
        await api.post("/api/v1/kolektor/receipts", {
            anggota_id: Number(payload.anggotaId),
            ref_iuran_id: Number(payload.refIuranId),
            jumlah: Number(payload.jumlah),
            tanggal_bayar: payload.tanggalBayar,
            catatan: payload.catatan || null
        });
        
        alert("Pembayaran berhasil disimpan.");
        // Reload detail untuk refresh status pembayaran
        await loadDetail(payload.anggotaId);
        await loadPendingSetoran();
    } catch (e) {
        console.error('[PAY-ONCE] Error:', e.response?.data || e.message);
        const errMsg = e.response?.data?.errors 
            ? Object.values(e.response.data.errors).flat().join(', ')
            : (e.response?.data?.message || e.message);
        alert("Gagal menyimpan pembayaran: " + errMsg);
    }
};

onMounted(() => {
    loadAnggotas();
    loadPendingSetoran();
});

watch(() => searchQuery.value, () => currentPage.value = 1);

</script>
