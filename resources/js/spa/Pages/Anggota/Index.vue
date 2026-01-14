<template>
    <DashboardLayout>
        <div class="p-3 sm:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-900 dark:to-cyan-900">
            <div class="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                <!-- Header -->
                <div class="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                    <div class="p-2 sm:p-3 bg-white/20 rounded-full flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-bold text-white">Daftar Anggota</h1>
                        <p class="text-xs sm:text-sm text-cyan-100 mt-1">Kelola dan lihat data seluruh anggota BSKM.</p>
                    </div>
                </div>

                <!-- Summary Card -->
                <div class="bg-gradient-to-br from-white to-cyan-50 dark:from-gray-800 dark:to-cyan-900 rounded-xl shadow-lg p-6 border border-cyan-200 dark:border-cyan-900 space-y-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            <span class="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200 font-semibold">Ringkasan Anggota</span>
                        </div>
                        <button
                            type="button"
                            class="text-xs font-semibold px-3 py-1 rounded bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-200 hover:bg-cyan-200 dark:hover:bg-cyan-800 transition"
                            @click="fetchAnggotas(1)"
                        >
                            Muat ulang
                        </button>
                    </div>

                    <div class="grid gap-3 md:grid-cols-3">
                        <div class="bg-gradient-to-br from-cyan-100 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/20 rounded-xl shadow-md border border-cyan-200 dark:border-cyan-800 p-5">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="p-2 bg-cyan-600 rounded-lg">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 dark:text-gray-300">Total Anggota</p>
                                    <p class="text-2xl font-bold text-cyan-800 dark:text-cyan-200">{{ meta.total }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900/30 dark:to-green-900/20 rounded-xl shadow-md border border-emerald-200 dark:border-emerald-800 p-5">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="p-2 bg-emerald-600 rounded-lg">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 dark:text-gray-300">Halaman</p>
                                    <p class="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{{ meta.current_page }} / {{ meta.last_page }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 rounded-xl shadow-md border border-amber-200 dark:border-amber-800 p-5">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="p-2 bg-amber-600 rounded-lg">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 dark:text-gray-300">Per Halaman</p>
                                    <p class="text-2xl font-bold text-amber-800 dark:text-amber-200">{{ meta.per_page }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Search Card -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                    <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        Pencarian Anggota
                    </h2>
                    <div class="flex flex-col md:flex-row items-center gap-3">
                        <div class="relative flex-1 w-full">
                            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input v-model="q" @keyup.enter="fetchAnggotas" placeholder="Cari nama, no HP, alamat..." class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                        </div>
                        <button @click="fetchAnggotas" :disabled="loading" class="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Cari
                        </button>
                    </div>
                </div>

                <!-- Error State -->
                <div v-if="error" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-4 text-sm text-red-700 dark:text-red-200">
                    {{ error }}
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="space-y-3">
                    <div v-for="n in 4" :key="'skeleton-' + n" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            <div class="flex-1">
                                <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div class="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div v-else>
                    <!-- Empty State -->
                    <div v-if="items.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
                        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada anggota ditemukan</p>
                    </div>

                    <!-- Anggota List -->
                    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                        <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            Daftar Anggota
                        </h2>

                        <div class="space-y-2">
                            <div
                                v-for="anggota in items"
                                :key="anggota.id"
                                class="flex items-center justify-between gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-cyan-50/30 dark:from-gray-900/40 dark:to-cyan-900/10"
                            >
                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                    <div class="p-2 bg-cyan-600 rounded-lg">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-semibold text-gray-800 dark:text-gray-100">
                                            {{ anggota.nama }}
                                        </p>
                                        <p class="text-xs text-gray-600 dark:text-gray-300">
                                            {{ anggota.kode ? `#${anggota.kode}` : 'Anggota' }} •
                                            <span class="font-medium">{{ anggota.no_hp ?? '-' }}</span>
                                        </p>
                                        <p v-if="anggota.alamat" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {{ anggota.alamat.perum || '' }} {{ anggota.alamat.no_rumah ? 'No. ' + anggota.alamat.no_rumah : '' }}
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium" :class="anggota.status === 'aktif' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200'">
                                        {{ anggota.status }}
                                    </span>
                                    <button @click="goToDetail(anggota.id)" class="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg transition-colors">
                                        Detail
                                    </button>
                                    <button @click="startDelete(anggota.id)" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors">
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="meta.total > meta.per_page" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500">
                            Halaman {{ meta.current_page }} dari {{ meta.last_page }} — total {{ meta.total }} anggota
                        </p>
                        <div class="flex items-center gap-2">
                            <button :disabled="meta.current_page <= 1 || loading" @click="changePage(meta.current_page - 1)" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Prev
                            </button>
                            <button :disabled="meta.current_page >= meta.last_page || loading" @click="changePage(meta.current_page + 1)" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import api from "@/utils/axios";
import BaseCard from "@/Components/Base/BaseCard.vue";
import BaseButton from "@/Components/Base/BaseButton.vue";
import BaseBadge from "@/Components/Base/BaseBadge.vue";
import { useRouter } from "vue-router";
import AnggotaCard from "@/Pages/Anggota/Partials/AnggotaCard.vue";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";

const router = useRouter();

// state
const items = ref([]);
const meta = ref({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
const q = ref("");
const loading = ref(false);
const error = ref(null);
const perPage = ref(9);

// delete state
const confirmDelete = ref({ show: false, id: null });
const loadingDelete = ref(false);
const deleteError = ref(null);

function normalizePaginatedResponse(payload) {
    // Be defensif: support beberapa format respons umum.
    // Ekspektasi umum: { data: [...], meta: { current_page, last_page, per_page, total } }
    const p = payload ?? {};
    const data = p.data ?? (Array.isArray(p) ? p : []);
    const metaObj = p.meta ?? {
        current_page: p.current_page ?? 1,
        last_page: p.last_page ?? 1,
        per_page: p.per_page ?? perPage.value,
        total:
            p.total ??
            (Array.isArray(p.data)
                ? p.data.length
                : Array.isArray(p)
                ? p.length
                : 0),
    };
    return { data, meta: metaObj };
}

async function fetchAnggotas(page = 1) {
    loading.value = true;
    error.value = null;

    try {
        const params = {
            per_page: perPage.value,
            page,
            q: q.value || undefined,
        };

        const res = await api.get("/api/v1/anggotas", { params });
        // Response may be wrapped by ResponseFormatter. we try to find payload.
        const payload = {
            data: res.data?.data ?? [],
            meta: res.data?.meta ?? {},
        };

        const parsed = normalizePaginatedResponse(payload);

        items.value = parsed.data;
        meta.value = {
            current_page: parsed.meta.current_page,
            last_page: parsed.meta.last_page,
            per_page: parsed.meta.per_page,
            total: parsed.meta.total,
        };
    } catch (err) {
        error.value =
            err.response?.data?.message ?? err.message ?? "Unknown error";
    } finally {
        loading.value = false;
    }
}

function changePage(page) {
    if (page < 1 || page > meta.value.last_page) return;
    fetchAnggotas(page);
}

function goToDetail(id) {
    router.push({ name: "anggota.show", params: { id } }).catch(() => {});
}

function startDelete(id) {
    confirmDelete.value = { show: true, id };
    deleteError.value = null;
}

async function confirmDeleteNow() {
    if (!confirmDelete.value.id) return;
    loadingDelete.value = true;
    deleteError.value = null;

    try {
        const res = await api.delete(
            `/api/v1/anggotas/${confirmDelete.value.id}`
        );
        // assume ResponseFormatter::success returns { success: true, data: ..., message: ... }
        fetchAnggotas(meta.value.current_page);
        confirmDelete.value = { show: false, id: null };
    } catch (err) {
        // handle validation like 422 with reason DEPENDENT_*
        const respData = err.response?.data;
        if (err.response?.status === 422) {
            deleteError.value =
                respData?.message ??
                "Tidak dapat menghapus data karena ada dependensi.";
        } else {
            deleteError.value =
                respData?.message ?? err.message ?? "Gagal menghapus";
        }
    } finally {
        loadingDelete.value = false;
    }
}

function formatDate(dt) {
    if (!dt) return "-";
    const d = new Date(dt);
    return d.toLocaleString();
}

function getAnggotaInitials(name) {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length
        ? (parts[0].charAt(0) + (parts[1]?.charAt(0) || "")).toUpperCase()
        : name.substring(0, 2).toUpperCase();
}

// fetch on mounted
onMounted(() => {
    fetchAnggotas();
});

// optional: watch search and auto-fetch with debounce
let searchTimeout = null;
watch(q, (val) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchAnggotas(1);
    }, 500);
});
</script>

<style scoped>
.page-anggotas .text-muted {
    color: var(--color-icon-light);
}
</style>
