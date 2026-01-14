<template>
    <DashboardLayout>
        <div
            class="p-3 sm:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        >
            <div class="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6"
                >
                    <h1 class="text-lg sm:text-2xl font-bold text-white break-words">
                        Kas & Pengeluaran
                    </h1>
                    <p class="text-xs sm:text-sm text-emerald-100 mt-1">
                        Catat kas masuk / kas keluar manual yang tidak berasal
                        dari modul iuran.
                    </p>
                </div>

                <!-- Form Input -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 space-y-4"
                >
                    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            class="px-3 py-1.5 rounded-full text-xs font-semibold border"
                            :class="
                                mode === 'in'
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : 'bg-white/70 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'
                            "
                            @click="mode = 'in'"
                        >
                            Kas Masuk
                        </button>
                        <button
                            type="button"
                            class="px-3 py-1.5 rounded-full text-xs font-semibold border"
                            :class="
                                mode === 'out'
                                    ? 'bg-rose-500 text-white border-rose-500'
                                    : 'bg-white/70 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'
                            "
                            @click="mode = 'out'"
                        >
                            Kas Keluar
                        </button>
                    </div>

                    <form class="space-y-4" @submit.prevent="submit">
                        <div class="grid gap-3 sm:gap-4 md:grid-cols-2">
                            <div class="space-y-1">
                                <label
                                    class="text-xs font-semibold text-gray-600 dark:text-gray-300"
                                >
                                    Tanggal
                                </label>
                                <input
                                    v-model="form.tanggal"
                                    type="date"
                                    class="w-full px-3 py-2 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                />
                            </div>
                            <div class="space-y-1">
                                <label
                                    class="text-xs font-semibold text-gray-600 dark:text-gray-300"
                                >
                                    Nominal (Rp)
                                </label>
                                <input
                                    v-model.number="form.amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    class="w-full px-3 py-2 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                />
                            </div>
                        </div>

                        <div class="grid gap-3 sm:gap-4 md:grid-cols-2">
                            <div class="space-y-1">
                                <label
                                    class="text-xs font-semibold text-gray-600 dark:text-gray-300"
                                >
                                    Akun kas
                                </label>
                                <select
                                    v-model.number="form.kas_account_id"
                                    class="w-full px-3 py-2 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                >
                                    <option :value="null">
                                        Pilih akun kas...
                                    </option>
                                    <option
                                        v-for="acc in cashAccounts"
                                        :key="acc.id"
                                        :value="acc.id"
                                    >
                                        {{ acc.kode }} - {{ acc.nama }}
                                    </option>
                                </select>
                            </div>
                            <div class="space-y-1">
                                <label
                                    class="text-xs font-semibold text-gray-600 dark:text-gray-300"
                                >
                                    Akun lawan
                                </label>
                                <select
                                    v-model.number="form.counter_account_id"
                                    class="w-full px-3 py-2 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                >
                                    <option :value="null">
                                        Pilih akun lawan...
                                    </option>
                                    <option
                                        v-for="acc in counterpartAccounts"
                                        :key="acc.id"
                                        :value="acc.id"
                                    >
                                        {{ acc.kode }} - {{ acc.nama }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label
                                class="text-xs font-semibold text-gray-600 dark:text-gray-300"
                            >
                                Keterangan
                            </label>
                            <textarea
                                v-model="form.description"
                                rows="3"
                                class="w-full px-3 py-2 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            ></textarea>
                        </div>

                        <div class="flex justify-end">
                            <button
                                type="submit"
                                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import api from "@/utils/axios";

const mode = ref("out"); // default kas keluar

const cashAccounts = ref([]);
const counterpartAccounts = ref([]);

const form = ref({
    tanggal: new Date().toISOString().slice(0, 10),
    amount: null,
    kas_account_id: null,
    counter_account_id: null,
    description: "",
    reference: "",
});

const submitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const loadAccounts = async () => {
    try {
        const [kasRes, lawanRes] = await Promise.all([
            api.get("/api/v1/kas/cash-accounts"),
            api.get("/api/v1/kas/counterpart-accounts"),
        ]);

        if (kasRes.data?.success) {
            cashAccounts.value = kasRes.data.data || [];
        }
        if (lawanRes.data?.success) {
            counterpartAccounts.value = lawanRes.data.data || [];
        }
    } catch (e) {
        // error will be shown when submit if needed
    }
};

const submit = async () => {
    errorMessage.value = "";
    successMessage.value = "";

    if (!form.value.tanggal) {
        errorMessage.value = "Tanggal wajib diisi.";
        return;
    }
    if (!form.value.amount || Number(form.value.amount) <= 0) {
        errorMessage.value = "Nominal harus lebih besar dari 0.";
        return;
    }
    if (!form.value.kas_account_id || !form.value.counter_account_id) {
        errorMessage.value = "Pilih akun kas dan akun lawan.";
        return;
    }

    submitting.value = true;

    try {
        const payload = {
            tanggal: form.value.tanggal,
            amount: Number(form.value.amount),
            kas_account_id: form.value.kas_account_id,
            counter_account_id: form.value.counter_account_id,
            description: form.value.description || null,
            reference: form.value.reference || null,
        };

        const url = mode.value === "in" ? "/api/v1/kas/in" : "/api/v1/kas/out";
        const res = await api.post(url, payload);

        if (res.data?.success) {
            successMessage.value =
                res.data?.message || "Transaksi kas berhasil dicatat.";
            // reset nominal & keterangan
            form.value.amount = null;
            form.value.description = "";
            form.value.reference = "";
        } else {
            errorMessage.value =
                res.data?.message || "Gagal mencatat transaksi kas.";
        }
    } catch (e) {
        if (e.response?.status === 422 && e.response.data?.errors) {
            errorMessage.value =
                Object.values(e.response.data.errors)[0][0] ||
                "Validasi gagal.";
        } else {
            errorMessage.value =
                e.response?.data?.message ||
                e.message ||
                "Gagal mencatat transaksi kas.";
        }
    } finally {
        submitting.value = false;
    }
};

onMounted(() => {
    loadAccounts();
});
</script>
