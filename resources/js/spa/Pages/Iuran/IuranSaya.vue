<template>
    <DashboardLayout>
        <div
            class="p-3 sm:p-6 space-y-4 sm:space-y-6 transition-colors duration-500 bg-[var(--color-light-bg)] dark:bg-[var(--color-dark-bg)] min-h-screen"
        >
            <div class="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                <!-- Header Card dengan Greeting & Detail User -->
                <BaseCard class="p-3 sm:p-4">
                    <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                        <div
                            class="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
                        >
                            <!-- Avatar placeholder -->
                            <div
                                class="text-gray-500 dark:text-gray-300 font-semibold text-lg sm:text-xl"
                            >
                                {{ userInitials }}
                            </div>
                        </div>

                        <div class="flex-1 min-w-0">
                            <h1
                                class="text-lg sm:text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100 break-words"
                            >
                                {{ userName }}
                            </h1>
                            <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                                Rincian lengkap iuran dan informasi pembayaran
                                Anda.
                            </p>
                        </div>

                        <!-- Back button -->
                        <div class="ml-auto sm:ml-0 flex-shrink-0">
                            <router-link
                                to="/dashboard"
                                class="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-600 text-xs sm:text-sm rounded transition whitespace-nowrap"
                            >
                                ← Kembali
                            </router-link>
                        </div>
                    </div>
                </BaseCard>

                <!-- Heading -->
                <div>
                    <h2
                        class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1"
                    >
                        Iuran Saya
                    </h2>
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Ringkasan kewajiban dan riwayat pembayaran Anda.
                    </p>
                </div>

                <!-- Summary Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <BaseCard class="p-3 sm:p-5">
                        <p
                            class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                        >
                            Total Sudah Dibayar
                        </p>
                        <p
                            class="text-xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 break-words"
                        >
                            Rp
                            {{ formatNumber(summary.total_sudah_dibayar || 0) }}
                        </p>
                    </BaseCard>

                    <BaseCard class="p-3 sm:p-5">
                        <p
                            class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                        >
                            Total Belum Dibayar
                        </p>
                        <p
                            class="text-xl sm:text-3xl font-bold text-red-700 dark:text-red-300 break-words"
                        >
                            Rp
                            {{ formatNumber(summary.total_belum_dibayar || 0) }}
                        </p>
                    </BaseCard>

                    <BaseCard class="p-5">
                        <p
                            class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                        >
                            Jenis Iuran Aktif
                        </p>
                        <p
                            class="text-3xl font-bold text-cyan-700 dark:text-cyan-300"
                        >
                            {{ summary.total_jenis_iuran || 0 }}
                        </p>
                    </BaseCard>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="space-y-4 animate-pulse">
                    <div
                        class="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"
                    ></div>
                    <div
                        class="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"
                    ></div>
                </div>

                <!-- Empty State -->
                <div v-else-if="iurans.length === 0" class="text-center py-12">
                    <BaseCard class="p-8">
                        <p class="text-gray-500 dark:text-gray-400 text-lg">
                            Belum ada iuran yang aktif untuk Anda.
                        </p>
                    </BaseCard>
                </div>

                <!-- Error State -->
                <div v-else-if="loadError" class="text-center py-8">
                    <BaseCard
                        class="p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
                    >
                        <p class="text-red-600 dark:text-red-400">
                            {{ loadError }}
                        </p>
                    </BaseCard>
                </div>

                <!-- Card per Iuran -->
                <div v-else class="space-y-4">
                    <IuranCard
                        v-for="item in iurans"
                        :key="item.id"
                        :iuran="item"
                        :read-only="true"
                    />
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import BaseCard from "@/Components/Base/BaseCard.vue";
import api from "@/utils/axios";
import IuranCard from "@/Components/Iuran/IuranCard.vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const summary = ref({
    total_sudah_dibayar: 0,
    total_belum_dibayar: 0,
    total_jenis_iuran: 0,
});
const iurans = ref([]);
const isLoading = ref(true);
const loadError = ref(null);

// User initials untuk avatar
const userInitials = computed(() => {
    const name = auth.user?.name || "";
    const parts = name.split(" ");
    return parts.length
        ? (parts[0].charAt(0) + (parts[1]?.charAt(0) || "")).toUpperCase()
        : name.substring(0, 2).toUpperCase();
});

// User name
const userName = computed(() => {
    return auth.user?.name || "User";
});

function formatNumber(n) {
    if (n === null || n === undefined) return "0";
    return new Intl.NumberFormat("id-ID").format(Number(n));
}

async function loadData() {
    isLoading.value = true;
    loadError.value = null;

    try {
        const res = await api.get("/api/v1/iuran/self");

        if (res.data.success) {
            summary.value = res.data.data.summary || summary.value;
            iurans.value = res.data.data.iurans || [];
        } else {
            loadError.value = res.data?.message || "Gagal memuat data iuran";
        }
    } catch (err) {
        loadError.value =
            err.response?.data?.message ||
            err.message ||
            "Terjadi kesalahan saat memuat data";
    } finally {
        setTimeout(() => {
            isLoading.value = false;
        }, 250);
    }
}

onMounted(loadData);
</script>
