<template>
    <DashboardLayout>
        <div
            class="p-3 sm:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-900 dark:to-cyan-900"
        >
        <!--tes-->
            <div class="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                <div
                    class="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                >
                    <div
                        class="p-2 sm:p-3 bg-white/20 rounded-full flex-shrink-0"
                    >
                        <svg
                            class="w-6 sm:w-8 h-6 sm:h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h1 class="text-lg sm:text-2xl font-bold text-white">
                            Terima Setoran Kolektor
                        </h1>
                        <p class="text-xs sm:text-sm text-cyan-100 mt-1">
                            Bendahara dapat melihat dan menerima setoran kas
                            dari para kolektor.
                        </p>
                    </div>
                </div>

                <!-- Ringkasan per kolektor + setoran pending -->
                <div
                    class="bg-gradient-to-br from-white to-cyan-50 dark:from-gray-800 dark:to-cyan-900 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 border border-cyan-200 dark:border-cyan-900 space-y-4"
                >
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <svg
                                class="w-5 h-5 text-cyan-600 dark:text-cyan-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <span
                                class="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200 font-semibold"
                                >Ringkasan Dana Kolektor (Tahun Berjalan)</span
                            >
                        </div>
                        <button
                            type="button"
                            class="text-xs font-semibold px-3 py-1 rounded bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-200 hover:bg-cyan-200 dark:hover:bg-cyan-800 transition"
                            @click="loadSummary"
                        >
                            Muat ulang
                        </button>
                    </div>

                    <div v-if="summaryLoading" class="space-y-2">
                        <BaseCard
                            class="h-20 animate-pulse bg-gray-100 dark:bg-gray-800"
                        />
                        <BaseCard
                            class="h-20 animate-pulse bg-gray-100 dark:bg-gray-800"
                        />
                    </div>

                    <div
                        v-else-if="summaryError"
                        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-3 text-sm text-red-700 dark:text-red-200"
                    >
                        {{ summaryError }}
                    </div>

                    <div v-else>
                        <div
                            v-if="summaryRows.length === 0"
                            class="text-sm text-gray-500 dark:text-gray-400"
                        >
                            Belum ada aktivitas setoran kolektor pada tahun ini.
                        </div>

                        <div v-else class="grid gap-3 md:grid-cols-2">
                            <div
                                v-for="item in summaryRows"
                                :key="item.kolektor_id"
                                class="bg-gradient-to-br from-cyan-100 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/20 rounded-xl shadow-md border border-cyan-200 dark:border-cyan-800 p-5 space-y-2"
                            >
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="p-2 bg-cyan-600 rounded-lg">
                                        <svg
                                            class="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p
                                            class="text-sm font-bold text-cyan-800 dark:text-cyan-200"
                                        >
                                            {{
                                                item.kolektor_nama || "Kolektor"
                                            }}
                                        </p>
                                        <span
                                            class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-100"
                                        >
                                            ID: {{ item.kolektor_id }}
                                        </span>
                                    </div>
                                </div>
                                <div class="space-y-1 text-xs">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-gray-600 dark:text-gray-300"
                                            >Dana di tangan kolektor:</span
                                        >
                                        <span class="font-bold text-amber-600"
                                            >Rp
                                            {{
                                                formatCurrency(
                                                    item.saldo_di_tangan
                                                )
                                            }}</span
                                        >
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-gray-600 dark:text-gray-300"
                                            >Sudah disetor (tahun ini):</span
                                        >
                                        <span class="font-bold text-emerald-600"
                                            >Rp
                                            {{
                                                formatCurrency(
                                                    item.total_disetor_tahun_ini
                                                )
                                            }}</span
                                        >
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-gray-600 dark:text-gray-300"
                                            >Menunggu diterima bendahara:</span
                                        >
                                        <span class="font-bold text-cyan-600"
                                            >Rp
                                            {{
                                                formatCurrency(
                                                    item.total_pending_setoran
                                                )
                                            }}</span
                                        >
                                        <span
                                            v-if="item.pending_count"
                                            class="ml-2 px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-100 text-[0.7rem] font-semibold"
                                        >
                                            {{ item.pending_count }} batch
                                        </span>
                                    </div>
                                </div>

                                <!-- Daftar setoran pending untuk kolektor ini -->
                                <div
                                    v-if="
                                        getPendingForKolektor(item.kolektor_id)
                                            .length
                                    "
                                    class="pt-2 mt-2 border-t border-dashed border-gray-200 dark:border-gray-700 space-y-2"
                                >
                                    <p
                                        class="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400"
                                    >
                                        Setoran pending
                                    </p>
                                    <div
                                        v-for="batch in getPendingForKolektor(
                                            item.kolektor_id
                                        )"
                                        :key="batch.id"
                                        class="flex items-center justify-between gap-2 text-xs"
                                    >
                                        <div class="flex-1 min-w-0">
                                            <p
                                                class="text-gray-800 dark:text-gray-100"
                                            >
                                                {{ batch.tanggal }} •
                                                {{
                                                    batch.iuran_count
                                                }}
                                                transaksi
                                            </p>
                                            <p
                                                class="text-gray-600 dark:text-gray-300"
                                            >
                                                Total
                                                <span
                                                    class="font-semibold text-emerald-600"
                                                >
                                                    Rp
                                                    {{
                                                        formatCurrency(
                                                            batch.nominal_total
                                                        )
                                                    }}
                                                </span>
                                            </p>
                                        </div>
                                        <BaseButton
                                            size="xs"
                                            variant="default"
                                            :disabled="approvingId === batch.id"
                                            @click="approve(batch)"
                                        >
                                            <span
                                                v-if="approvingId === batch.id"
                                                >Memproses...</span
                                            >
                                            <span v-else>Terima</span>
                                        </BaseButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Daftar batch setoran pending (semua kolektor) -->
                <div
                    class="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-3"
                >
                    <h2
                        class="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                        </svg>
                        Daftar Setoran Pending
                    </h2>

                    <div v-if="loading" class="space-y-2">
                        <BaseCard
                            class="h-16 animate-pulse bg-gray-100 dark:bg-gray-800"
                        />
                        <BaseCard
                            class="h-16 animate-pulse bg-gray-100 dark:bg-gray-800"
                        />
                    </div>

                    <div
                        v-else-if="error"
                        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-3 text-sm text-red-700 dark:text-red-200"
                    >
                        {{ error }}
                    </div>

                    <div
                        v-else-if="rows.length === 0"
                        class="text-sm text-gray-500 dark:text-gray-400"
                    >
                        Tidak ada batch setoran pending saat ini.
                    </div>

                    <div v-else class="space-y-2 text-sm">
                        <div
                            v-for="batch in rows"
                            :key="batch.id"
                            class="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
                        >
                            <div class="flex-1 min-w-0">
                                <p
                                    class="font-semibold text-gray-800 dark:text-gray-100"
                                >
                                    {{ batch.kolektor_nama || "Kolektor" }} •
                                    {{ batch.tanggal }}
                                </p>
                                <p class="text-gray-600 dark:text-gray-300">
                                    {{ batch.iuran_count }} transaksi •
                                    <span
                                        class="font-semibold text-emerald-600 dark:text-emerald-400"
                                    >
                                        Rp
                                        {{
                                            formatCurrency(batch.nominal_total)
                                        }}
                                    </span>
                                </p>
                            </div>
                            <BaseButton
                                size="sm"
                                variant="default"
                                :disabled="approvingId === batch.id"
                                @click="approve(batch)"
                            >
                                <span v-if="approvingId === batch.id"
                                    >Memproses...</span
                                >
                                <span v-else>Terima</span>
                            </BaseButton>
                        </div>
                    </div>

                    <div
                        v-if="successMessage"
                        class="text-sm text-emerald-600 dark:text-emerald-400"
                    >
                        {{ successMessage }}
                    </div>
                    <div
                        v-if="approveError"
                        class="text-sm text-rose-600 dark:text-rose-400"
                    >
                        {{ approveError }}
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import BaseCard from "@/Components/Base/BaseCard.vue";
import BaseButton from "@/Components/Base/BaseButton.vue";
import api from "@/utils/axios";

const summaryRows = ref([]);
const summaryLoading = ref(false);
const summaryError = ref(null);

const rows = ref([]);
const loading = ref(false);
const error = ref(null);

const approvingId = ref(null);
const approveError = ref(null);
const successMessage = ref("");

const formatCurrency = (value) => {
    if (!value && value !== 0) return "0";
    return new Intl.NumberFormat("id-ID").format(Number(value));
};

const getPendingForKolektor = (kolektorId) => {
    return rows.value.filter((item) => item.kolektor_id === kolektorId);
};

const loadSummary = async () => {
    summaryLoading.value = true;
    summaryError.value = null;
    summaryRows.value = [];

    try {
        const res = await api.get("/api/v1/bendahara/setoran/summary");
        if (res.data?.success) {
            summaryRows.value = res.data.data || [];
        } else {
            summaryError.value =
                res.data?.message || "Gagal memuat ringkasan setoran kolektor.";
        }
    } catch (e) {
        summaryError.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal memuat ringkasan setoran kolektor.";
    } finally {
        summaryLoading.value = false;
    }
};

const loadSetoran = async () => {
    loading.value = true;
    error.value = null;
    rows.value = [];

    try {
        const res = await api.get("/api/v1/bendahara/setoran/pending");
        if (res.data?.success) {
            rows.value = res.data.data || [];
        } else {
            error.value =
                res.data?.message || "Gagal memuat daftar setoran kolektor.";
        }
    } catch (e) {
        error.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal memuat daftar setoran kolektor.";
    } finally {
        loading.value = false;
    }
};

const approve = async (item) => {
    if (
        !window.confirm(
            `Terima setoran kolektor ${item.kolektor_nama || ""} tanggal ${
                item.tanggal
            } dengan total Rp ${formatCurrency(item.nominal_total)}?`
        )
    ) {
        return;
    }

    approvingId.value = item.id;
    approveError.value = null;
    successMessage.value = "";

    try {
        const res = await api.post(
            `/api/v1/bendahara/setoran/${item.id}/approve`
        );
        if (res.data?.success) {
            successMessage.value =
                res.data?.message || "Setoran kolektor berhasil diterima.";
            await loadSetoran();
        } else {
            approveError.value =
                res.data?.message || "Gagal memproses setoran kolektor.";
        }
    } catch (e) {
        approveError.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal memproses setoran kolektor.";
    } finally {
        approvingId.value = null;
    }
};

onMounted(() => {
    loadSummary();
    loadSetoran();
});
</script>
