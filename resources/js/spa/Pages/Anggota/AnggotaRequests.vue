<template>
    <DashboardLayout>
        <div class="max-w-5xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
            <!-- Header Modern -->
            <div class="rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg p-3 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2">
                <div class="p-2 sm:p-3 bg-white/20 rounded-full flex-shrink-0">
                    <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="min-w-0">
                    <h1 class="text-xl sm:text-3xl font-bold text-white drop-shadow-lg mb-1 sm:mb-2 break-words">Daftar Pengajuan Penautan Anggota</h1>
                    <p class="text-cyan-100 text-xs sm:text-base">Kelola pengajuan penautan anggota yang masuk ke sistem.</p>
                </div>
            </div>

            <div v-if="loading" class="text-gray-500 mb-4 text-center py-6 sm:py-8 text-sm sm:text-base">Memuat data pengajuan...</div>

            <div v-if="items.length === 0 && !loading" class="text-gray-400 text-xs sm:text-sm text-center py-6 sm:py-8">
                Tidak ada pengajuan pending.
            </div>

            <div class="space-y-3 sm:space-y-6">
                <div v-for="req in items" :key="req.id" class="border rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/30">
                    <!-- Header Card Modern -->
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-2 gap-2">
                        <div class="font-bold text-base sm:text-lg text-blue-700 dark:text-blue-300 flex items-start sm:items-center gap-1 sm:gap-2 break-words">
                            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            <span>{{ req.user.name }}</span> <span class="text-xs text-gray-400 break-all">({{ req.user.email }})</span>
                        </div>
                        <div class="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                            {{ formatDate(req.created_at) }}
                        </div>
                    </div>
                    <div class="mt-2 space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <div class="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div class="font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center gap-1">
                                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                Data Anggota:
                            </div>
                            <div class="font-bold text-sm">{{ req.anggota.nama }}</div>
                            <div class="text-xs text-gray-500">ID: {{ req.anggota.id }}</div>
                        </div>
                        <div class="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div class="font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center gap-1">
                                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                Nomor HP Baru:
                            </div>
                            <div class="font-bold text-sm">{{ req.no_hp || "-" }}</div>
                        </div>
                        <div class="p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div class="font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center gap-1">
                                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v4a1 1 0 001 1h3m10-5a1 1 0 011 1v4a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v4a1 1 0 001 1h3m10-5a1 1 0 011 1v4a1 1 0 01-1 1h-3"/></svg>
                                Alamat Baru:
                            </div>
                            <div class="font-bold text-sm">{{ req.perum || "-" }} No. {{ req.no_rumah }}</div>
                            <div class="text-xs text-gray-600">{{ req.alamat_lainnya }}</div>
                            <div class="text-xs text-gray-600">{{ req.village }}</div>
                        </div>
                    </div>
                    <!-- Buttons Modern -->
                    <div class="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:space-x-2">
                        <button @click="approve(req.id)" class="w-full sm:w-auto px-3 sm:px-5 py-2 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 flex items-center justify-center sm:justify-start gap-2 transition text-sm sm:text-base">
                            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            Setujui
                        </button>
                        <button @click="reject(req.id)" class="w-full sm:w-auto px-3 sm:px-5 py-2 rounded-lg bg-red-600 text-white font-bold shadow hover:bg-red-700 flex items-center justify-center sm:justify-start gap-2 transition text-sm sm:text-base">
                            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            Tolak
                        </button>
                    </div>
                </div>
            </div>

            <!-- Pagination Modern -->
            <div v-if="pagination.total > pagination.per_page" class="mt-6 sm:mt-8 flex justify-between gap-2 text-xs sm:text-sm">
                <button :disabled="!pagination.prev_page_url" @click="goToPage(pagination.current_page - 1)" class="px-3 sm:px-5 py-2 rounded-lg border font-bold bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-40 transition">
                    « Prev
                </button>
                <button :disabled="!pagination.next_page_url" @click="goToPage(pagination.current_page + 1)" class="px-3 sm:px-5 py-2 rounded-lg border font-bold bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-40 transition">
                    Next »
                </button>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/utils/axios";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";

const items = ref([]);
const loading = ref(false);

const pagination = ref({
    current_page: 1,
    total: 0,
    per_page: 10,
});

function formatDate(date) {
    return new Date(date).toLocaleString("id-ID");
}

async function load(page = 1) {
    loading.value = true;
    const res = await api.get(`/api/v1/anggota-requests?page=${page}`);

    items.value = res.data.data;

    pagination.value = {
        current_page: res.data.meta.current_page,
        total: res.data.meta.total,
        per_page: res.data.meta.per_page,
        next_page_url: res.data.links.next,
        prev_page_url: res.data.links.prev,
    };

    loading.value = false;
}

async function approve(id) {
    $confirm(
        "Setujui pengajuan ini?",
        async () => {
            const res = await api.post(
                `/api/v1/anggota-requests/${id}/approve`
            );
            $notify.success(res.data.message);
            load();
        },
        { okText: "Setujui", type: "default" }
    );
}

async function reject(id) {
    $confirm(
        "Tolak pengajuan ini?",
        async () => {
            const res = await api.post(`/api/v1/anggota-requests/${id}/reject`);
            $notify.error(res.data.message);
            load();
        },
        { okText: "Tolak", type: "danger" }
    );
}

function goToPage(page) {
    load(page);
}

onMounted(() => load());
</script>
