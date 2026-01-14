<template>
    <DashboardLayout>
        <div
            class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6"
        >
            <!-- Hero Header -->
            <div class="mb-4 sm:mb-8">
                <div
                    class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4"
                >
                    <div
                        class="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0"
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
                                d="M20 12H4"
                            />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h1
                            class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
                        >
                            Kas Keluar
                        </h1>
                        <p
                            class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1"
                        >
                            Pencatatan pengeluaran kas bendahara utama
                        </p>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto space-y-6">
                <!-- Input Form Card with Gradient -->
                <div
                    class="bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg border border-red-200 dark:border-red-900 overflow-hidden"
                >
                    <div class="bg-gradient-to-r from-red-600 to-rose-600 p-6">
                        <div class="flex items-center gap-3">
                            <svg
                                class="w-6 h-6 text-white"
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
                            <div>
                                <h3 class="text-xl font-bold text-white">
                                    Input Transaksi Kas Keluar
                                </h3>
                                <p class="text-red-100 text-sm mt-1">
                                    Lengkapi formulir di bawah untuk mencatat
                                    pengeluaran
                                </p>
                            </div>
                        </div>
                    </div>

                    <form @submit.prevent="submitKasKeluar" class="p-6">
                        <div class="space-y-4 sm:space-y-6">
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    <span class="flex items-center gap-2">
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
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Tanggal
                                        <span class="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    v-model="form.tanggal"
                                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    <span class="flex items-center gap-2">
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
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Nominal
                                        <span class="text-red-500">*</span>
                                    </span>
                                </label>
                                <div class="relative">
                                    <span
                                        class="absolute left-4 top-3 text-gray-500 dark:text-gray-400 font-medium"
                                        >Rp</span
                                    >
                                    <input
                                        type="number"
                                        v-model.number="form.jumlah"
                                        class="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                                        min="1"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="md:col-span-2">
                                <label
                                    class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    <span class="flex items-center gap-2">
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
                                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                            />
                                        </svg>
                                        Akun Lawan (Debit)
                                        <span class="text-red-500">*</span>
                                    </span>
                                </label>
                                <select
                                    v-model="form.debit_account_code"
                                    required
                                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                                >
                                    <option value="">-- Pilih Akun --</option>
                                    <option
                                        v-for="acc in accounts"
                                        :key="acc.kode"
                                        :value="acc.kode"
                                    >
                                        {{ acc.kode }} - {{ acc.nama }}
                                    </option>
                                </select>
                            </div>

                            <div class="md:col-span-2">
                                <label
                                    class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    <span class="flex items-center gap-2">
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
                                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                            />
                                        </svg>
                                        Jenis Pengeluaran
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    v-model="form.jenis_pengeluaran"
                                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                                    placeholder="mis. Operasional, Pemeliharaan, dll"
                                />
                            </div>

                            <div class="md:col-span-2">
                                <label
                                    class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    <span class="flex items-center gap-2">
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
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Keterangan
                                    </span>
                                </label>
                                <textarea
                                    v-model="form.keterangan"
                                    rows="3"
                                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm hover:shadow-md resize-none"
                                    placeholder="Tambahkan catatan atau keterangan transaksi..."
                                ></textarea>
                            </div>
                        </div>

                        <div
                            class="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                        >
                            <button
                                type="submit"
                                :disabled="loading"
                                class="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-2"
                            >
                                <svg
                                    v-if="!loading"
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <svg
                                    v-else
                                    class="animate-spin w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                {{
                                    loading
                                        ? "Menyimpan..."
                                        : "Simpan Transaksi"
                                }}
                            </button>
                            <button
                                type="button"
                                @click="resetForm"
                                class="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <!-- History Table with Modern Design -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    <div
                        class="bg-gradient-to-r from-red-50 to-rose-50 dark:from-gray-700 dark:to-gray-600 p-6 border-b border-gray-200 dark:border-gray-600"
                    >
                        <div class="flex items-center gap-3">
                            <svg
                                class="w-6 h-6 text-red-600 dark:text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            <div>
                                <h3
                                    class="text-lg font-bold text-gray-900 dark:text-white"
                                >
                                    Riwayat Transaksi
                                </h3>
                                <p
                                    class="text-sm text-gray-600 dark:text-gray-300 mt-1"
                                >
                                    Daftar pengeluaran kas yang telah tercatat
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table
                            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                        >
                            <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th
                                        class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                                    >
                                        Tanggal
                                    </th>
                                    <th
                                        class="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                                    >
                                        Nominal
                                    </th>
                                    <th
                                        class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                                    >
                                        Jenis
                                    </th>
                                    <th
                                        class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                                    >
                                        Keterangan
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                            >
                                <tr
                                    v-for="row in rows"
                                    :key="row.id"
                                    class="hover:bg-red-50 dark:hover:bg-gray-700 transition-all duration-150"
                                >
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center gap-2">
                                            <svg
                                                class="w-4 h-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span
                                                class="text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                {{ formatDate(row.tanggal) }}
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-right"
                                    >
                                        <div
                                            class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900"
                                        >
                                            <svg
                                                class="w-4 h-4 text-red-600 dark:text-red-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M20 12H4"
                                                />
                                            </svg>
                                            <span
                                                class="text-sm font-bold text-red-700 dark:text-red-300"
                                            >
                                                Rp
                                                {{ formatRupiah(row.jumlah) }}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                        >
                                            {{ row.jenis_pengeluaran || "-" }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="text-sm text-gray-600 dark:text-gray-400"
                                        >
                                            {{ row.keterangan || "-" }}
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="rows.length === 0">
                                    <td
                                        colspan="4"
                                        class="px-6 py-12 text-center"
                                    >
                                        <div
                                            class="flex flex-col items-center justify-center"
                                        >
                                            <div
                                                class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4"
                                            >
                                                <svg
                                                    class="w-12 h-12 text-gray-400"
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
                                            </div>
                                            <p
                                                class="text-gray-500 dark:text-gray-400 font-medium"
                                            >
                                                Belum ada transaksi kas keluar
                                            </p>
                                            <p
                                                class="text-sm text-gray-400 dark:text-gray-500 mt-1"
                                            >
                                                Transaksi yang Anda catat akan
                                                muncul di sini
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import api from "@/utils/axios";
import { ref, onMounted } from "vue";

const form = ref({
    tanggal: new Date().toISOString().split("T")[0],
    jumlah: null,
    kas_account_code: "1101", // Fixed: Bendahara Utama
    debit_account_code: "",
    jenis_pengeluaran: "",
    keterangan: "",
});

const rows = ref([]);
const loading = ref(false);
const accounts = ref([]);

function formatRupiah(n) {
    return new Intl.NumberFormat("id-ID").format(n ?? 0);
}

function formatDate(dateString) {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
}

function resetForm() {
    form.value = {
        tanggal: new Date().toISOString().split("T")[0],
        jumlah: null,
        kas_account_code: "1101",
        debit_account_code: "",
        jenis_pengeluaran: "",
        keterangan: "",
    };
}

async function submitKasKeluar() {
    loading.value = true;
    try {
        const { data } = await api.post("/api/v1/kas/keluar", form.value);
        if (data?.success) {
            alert("✅ Kas keluar berhasil dicatat!");
            resetForm();
            fetchHistory();
        }
    } catch (e) {
        alert(
            "❌ Gagal menyimpan: " + (e.response?.data?.message || e.message)
        );
    } finally {
        loading.value = false;
    }
}

async function fetchHistory() {
    try {
        const { data } = await api.get("/api/v1/kas/keluar/history");
        if (data?.success) {
            rows.value = data.data || [];
        }
    } catch (e) {
        console.error("Failed to fetch kas keluar history:", e);
    }
}

async function fetchAccounts() {
    try {
        const { data } = await api.get("/api/v1/kas/accounts");
        if (data?.success) {
            accounts.value = data.data.accounts || [];
        }
    } catch (e) {
        console.error("Failed to fetch accounts:", e);
    }
}

onMounted(() => {
    fetchAccounts();
    fetchHistory();
});
</script>
