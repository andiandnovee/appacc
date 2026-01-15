<!-- resources/js/spa/Pages/Dashboard.vue -->
<template>
    <DashboardLayout>
        <!-- Jika belum terhubung ke anggota -->
        <div v-if="auth.user?.anggota === null">
            <UserLinkAnggota />
        </div>

        <!-- Jika sudah punya anggota -->
        <div
            v-else-if="auth.user?.anggota != null"
            class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6"
        >
            <!-- Hero Header -->
            <div class="mb-6 sm:mb-8">
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div class="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Selamat datang kembali, {{ auth.user.name }}</p>
                    </div>
                </div>
            </div>

            <!-- Greeting + Quick Profile Card -->
            <div class="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                <div class="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg sm:rounded-xl shadow-lg border border-blue-200 dark:border-blue-900 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <div>
                                <h3 class="text-lg sm:text-xl font-bold text-white">Profil Saya</h3>
                                <p class="text-blue-100 text-xs sm:text-sm mt-1">Informasi akun dan data anggota Anda</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-4 sm:p-6">
                        <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center shadow-lg flex-shrink-0">
                                <img
                                    v-if="auth.user.avatar"
                                    :src="auth.user.avatar"
                                    alt="avatar"
                                    class="w-full h-full object-cover"
                                />
                                <div
                                    v-else
                                    class="text-blue-600 dark:text-blue-300 font-bold text-xl sm:text-2xl"
                                >
                                    {{ initials }}
                                </div>
                            </div>

                            <div class="flex-1 min-w-0">
                                <h2 class="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-gray-100 break-words">
                                    {{ auth.user.name }}
                                </h2>
                                <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 break-all">
                                    {{ auth.user.email }}
                                </p>
                                <div class="flex flex-col sm:flex-row flex-wrap gap-2">
                                    <router-link
                                        :to="`/anggota/${auth.user.anggota.id}`"
                                        class="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
                                    >
                                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                        Lihat Detail
                                    </router-link>

                                    <router-link
                                        :to="`/anggota/${auth.user.anggota.id}/edit`"
                                        class="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 sm:py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all w-full sm:w-auto"
                                    >
                                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                        Edit Profil
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Profil Ringkas -->
                <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div class="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <div>
                                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Informasi Anggota</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Data lengkap keanggotaan Anda</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        <div class="col-span-2 space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                                    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Nama Lengkap</p>
                                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {{ auth.user.anggota.nama }}
                                    </p>
                                </div>
                                <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                                    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Kode Anggota</p>
                                    <p class="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                                        {{ auth.user.anggota.kode }}
                                    </p>
                                </div>
                                <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                                    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">No. HP</p>
                                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {{ auth.user.anggota.no_hp }}
                                    </p>
                                </div>
                                <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                                    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Status</p>
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        :class="
                                            auth.user.anggota.status === 'aktif'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        "
                                    >
                                        {{ auth.user.anggota.status }}
                                    </span>
                                </div>
                            </div>
                            <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Alamat</p>
                                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {{ formattedAddress }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ringkasan Iuran Card -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 border-b border-gray-200 dark:border-gray-600">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                            </svg>
                            <span class="text-lg font-bold text-gray-900 dark:text-white">Ringkasan Iuran</span>
                        </div>
                    </div>

                    <div class="p-6 space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800/40 shadow-sm hover:shadow-md transition-shadow">
                                <div class="flex items-center gap-2 mb-2">
                                    <div class="p-1.5 bg-green-500 rounded-lg">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <p class="text-xs font-semibold text-green-700 dark:text-green-400">
                                        Sudah Dibayar
                                    </p>
                                </div>
                                <p class="text-xl font-bold text-green-700 dark:text-green-300">
                                    Rp {{ formatNumber(summary.total_sudah_dibayar) }}
                                </p>
                            </div>

                            <div class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-800/40 shadow-sm hover:shadow-md transition-shadow">
                                <div class="flex items-center gap-2 mb-2">
                                    <div class="p-1.5 bg-red-500 rounded-lg">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <p class="text-xs font-semibold text-red-700 dark:text-red-400">
                                        Belum Dibayar
                                    </p>
                                </div>
                                <p class="text-xl font-bold text-red-700 dark:text-red-300">
                                    Rp {{ formatNumber(summary.total_belum_dibayar) }}
                                </p>
                            </div>

                            <div class="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800/40 shadow-sm hover:shadow-md transition-shadow">
                                <div class="flex items-center gap-2 mb-2">
                                    <div class="p-1.5 bg-blue-500 rounded-lg">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                        </svg>
                                    </div>
                                    <p class="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                        Jenis Iuran Aktif
                                    </p>
                                </div>
                                <p class="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {{ summary.total_jenis_iuran }}
                                </p>
                            </div>
                        </div>

                        <!-- Link ke detail iuran -->
                        <router-link
                            :to="{ name: 'iuran.saya' }"
                            class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-sm transition-all font-semibold shadow-lg hover:shadow-xl"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            Lihat Detail Iuran
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- SKELETON LOADING -->
            <div v-if="isLoading" class="max-w-7xl mx-auto space-y-6 animate-pulse">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-3">
                    <div class="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-1/3"></div>
                    <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-3">
                    <div class="h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl"></div>
                </div>
            </div>
            <!-- KONTEN UTAMA: INFO ANGGOTA SAJA (Detail iuran ada di /iuran-saya) -->
            <div v-else class="max-w-4xl mx-auto mt-6">
                <!-- Info tambahan jika diperlukan bisa ditambahkan di sini -->
            </div>
        </div>

        <!-- Loading / not-ready fallback when `anggota` is undefined -->
        <div v-else class="min-h-screen p-6">
            <div class="max-w-7xl mx-auto animate-pulse space-y-4">
                <div class="h-6 bg-gray-200 rounded w-1/3"></div>
                <div class="h-40 bg-gray-200 rounded"></div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";

import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import UserLinkAnggota from "@/Pages/Anggota/UserLinkAnggota.vue";
import BaseCard from "@/Components/Base/BaseCard.vue";
import api from "@/utils/axios";

const auth = useAuthStore();

const summary = ref({
    total_sudah_dibayar: 0,
    total_belum_dibayar: 0,
    total_jenis_iuran: 0,
});

const isLoading = ref(true);

// helper format
function formatNumber(n) {
    if (n === null || n === undefined) return "0";
    return new Intl.NumberFormat("id-ID").format(Number(n));
}

// format alamat dalam satu baris: nama perum, no rumah, desa
const formattedAddress = computed(() => {
    const anggota = auth.user?.anggota;
    if (!anggota) return "-";

    // jika alamat adalah array (relasi)
    if (Array.isArray(anggota.alamat) && anggota.alamat.length) {
        const addr = anggota.alamat[0];
        const parts = [];

        if (addr.perum?.nama) parts.push(addr.perum.nama);
        if (addr.no_rumah) parts.push(`No. ${addr.no_rumah}`);
        if (addr.village?.name) parts.push(addr.village.name);

        return parts.length ? parts.join(", ") : "-";
    }

    // fallback
    return "-";
});

// inisial avatar
const initials = computed(() => {
    const name = auth.user?.name || "";
    const parts = name.split(" ");
    return parts.length
        ? (parts[0].charAt(0) + (parts[1]?.charAt(0) || "")).toUpperCase()
        : name.substring(0, 2).toUpperCase();
});

async function loadSummary() {
    isLoading.value = true;

    try {
        const res = await api.get("/api/v1/iuran/self");
        if (res.data?.success) {
            summary.value = res.data.data.summary || summary.value;
        }
    } catch (e) {
    } finally {
        setTimeout(() => {
            isLoading.value = false;
        }, 250);
    }
}

onMounted(() => {
    // jika user sudah punya anggota, load summary-nya
    if (auth.user?.anggota !== null) {
        loadSummary();
    }
});
</script>
