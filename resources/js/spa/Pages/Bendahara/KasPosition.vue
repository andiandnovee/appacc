<template>
    <DashboardLayout>
        <div class="space-y-4 sm:space-y-6 p-3 sm:p-6">
            <!-- Header -->
            <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1
                        class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
                    >
                        Posisi Kas BSKM
                    </h1>
                    <p class="text-xs sm:text-sm text-gray-500 mt-1">
                        Total uang di tangan organisasi per {{ todayStr() }}
                    </p>
                </div>
                <div
                    class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
                >
                    <label
                        class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Tahun</label
                    >
                    <select
                        v-model="selectedYear"
                        @change="fetchKasSummary"
                        class="px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option v-for="y in yearOptions" :key="y" :value="y">
                            {{ y }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Hero Card - Total Kas -->
            <div
                class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8 text-white"
            >
                <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div class="flex-1">
                        <p
                            class="text-blue-100 text-xs sm:text-sm font-medium mb-2"
                        >
                            💰 Total Uang di Tangan
                        </p>
                        <h2 class="text-3xl sm:text-5xl font-bold mb-1">
                            Rp {{ formatRupiah(totalCash) }}
                        </h2>
                        <p class="text-blue-100 text-xs sm:text-sm">
                            Kas Bendahara + Kas Kolektor
                        </p>
                    </div>
                    <div class="hidden sm:block flex-shrink-0">
                        <svg
                            class="w-16 sm:w-24 h-16 sm:h-24 text-blue-300 opacity-50"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"
                            />
                            <path
                                fill-rule="evenodd"
                                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Breakdown Cards -->
            <div class="space-y-3 sm:space-y-6">
                <!-- Kas Bendahara -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <div
                                class="w-10 sm:w-12 h-10 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0"
                            >
                                <svg
                                    class="w-5 sm:w-6 h-5 sm:h-6 text-green-600 dark:text-green-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3
                                    class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
                                >
                                    Kas Bendahara
                                </h3>
                                <p
                                    class="text-[0.65rem] sm:text-xs text-gray-400"
                                >
                                    Akun 1101
                                </p>
                            </div>
                        </div>
                    </div>
                    <p
                        class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words"
                    >
                        Rp {{ formatRupiah(summary.closing_balance) }}
                    </p>
                    <div
                        class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2"
                    >
                        <div
                            class="flex justify-between items-start gap-2 text-xs sm:text-sm"
                        >
                            <span class="text-gray-500 flex-1"
                                >Debit bulan ini</span
                            >
                            <span
                                class="font-medium text-green-600 text-right flex-shrink-0"
                                >+Rp
                                {{ formatRupiah(summary.debit_total) }}</span
                            >
                        </div>
                        <div
                            class="flex justify-between items-start gap-2 text-xs sm:text-sm"
                        >
                            <span class="text-gray-500 flex-1"
                                >Kredit bulan ini</span
                            >
                            <span
                                class="font-medium text-red-600 text-right flex-shrink-0"
                                >-Rp
                                {{ formatRupiah(summary.credit_total) }}</span
                            >
                        </div>
                    </div>
                </div>

                <!-- Kas Kolektor -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
                >
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center"
                            >
                                <svg
                                    class="w-6 h-6 text-purple-600 dark:text-purple-300"
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
                            </div>
                            <div>
                                <h3
                                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                                >
                                    Kas Kolektor
                                </h3>
                                <p class="text-xs text-gray-400">
                                    Akun 1102 (Total)
                                </p>
                            </div>
                        </div>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">
                        Rp {{ formatRupiah(collectorClosingTotal) }}
                    </p>
                    <div
                        class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                        <p class="text-sm text-gray-500">
                            Uang yang ditangan para kolektor sebelum disetor ke
                            bendahara
                        </p>
                    </div>
                </div>
            </div>

            <!-- Monthly History Chart & Table -->
            <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3
                        class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                        Riwayat Bulanan Tahun {{ selectedYear }}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                        Perkembangan kas per bulan
                    </p>
                </div>

                <!-- Simple Chart Visualization -->
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-end justify-between h-48 gap-2">
                        <div
                            v-for="row in monthly"
                            :key="row.month"
                            class="flex-1 flex flex-col items-center"
                        >
                            <div class="text-xs text-gray-500 mb-2 font-medium">
                                Rp {{ formatRupiahShort(row.total.closing) }}
                            </div>
                            <div
                                class="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t hover:from-blue-600 hover:to-blue-400 transition-all cursor-pointer"
                                :style="{
                                    height:
                                        getBarHeight(row.total.closing) + '%',
                                }"
                                :title="`${getMonthName(
                                    row.month
                                )}: Rp ${formatRupiah(row.total.closing)}`"
                            ></div>
                            <div class="text-xs text-gray-500 mt-2">
                                {{ getMonthName(row.month).substring(0, 3) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Detailed Table -->
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Periode
                                </th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Saldo Awal
                                </th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Masuk (+)
                                </th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Keluar (-)
                                </th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    Saldo Akhir
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                        >
                            <tr
                                v-for="row in monthly"
                                :key="row.month"
                                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <span
                                            class="text-sm font-medium text-gray-900 dark:text-white"
                                            >{{ getMonthName(row.month) }}
                                            {{ selectedYear }}</span
                                        >
                                    </div>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400"
                                >
                                    Rp {{ formatRupiah(row.total.opening) }}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600"
                                >
                                    +Rp {{ formatRupiah(row.total.debit) }}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-600"
                                >
                                    -Rp {{ formatRupiah(row.total.credit) }}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-white"
                                >
                                    Rp {{ formatRupiah(row.total.closing) }}
                                </td>
                            </tr>
                            <tr v-if="monthly.length === 0">
                                <td
                                    colspan="5"
                                    class="px-6 py-8 text-center text-gray-500"
                                >
                                    <svg
                                        class="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <p class="mt-2">
                                        Belum ada data untuk tahun
                                        {{ selectedYear }}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import api from "@/utils/axios";
import { ref, onMounted, computed } from "vue";

const summary = ref({
    opening_balance: 0,
    debit_total: 0,
    credit_total: 0,
    closing_balance: 0,
});
const history = ref([]);
const collectorClosingTotal = ref(0);
const totalCash = ref(0);
const selectedYear = ref(new Date().getFullYear());
const yearOptions = [
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
];
const monthly = ref([]);

const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

function formatRupiah(n) {
    return new Intl.NumberFormat("id-ID").format(n ?? 0);
}

function formatRupiahShort(n) {
    const num = n ?? 0;
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "jt";
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + "rb";
    }
    return num.toString();
}

function getMonthName(month) {
    return monthNames[month - 1] || "";
}

function getBarHeight(value) {
    if (monthly.value.length === 0) return 0;
    const maxValue = Math.max(...monthly.value.map((m) => m.total.closing));
    if (maxValue === 0) return 0;
    return Math.max(5, (value / maxValue) * 100);
}

function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

async function fetchKasSummary() {
    const { data } = await api.get("/api/v1/kas/position", {
        params: {
            account_code: "1101",
            as_of: todayStr(),
            year: selectedYear.value,
        },
    });
    if (data?.success) {
        summary.value = data.data.summary || {
            opening_balance: 0,
            debit_total: 0,
            credit_total: 0,
            closing_balance: 0,
        };
        history.value = data.data.history || [];
        collectorClosingTotal.value = data.data.collector?.closing_total ?? 0;
        totalCash.value =
            data.data.total_cash ??
            summary.value.closing_balance + collectorClosingTotal.value;
        monthly.value = data.data.monthly || [];
    }
}

onMounted(fetchKasSummary);
</script>
