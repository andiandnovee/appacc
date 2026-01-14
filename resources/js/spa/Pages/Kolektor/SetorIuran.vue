<template>
    <DashboardLayout>
        <div
            class="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        >
            <div class="max-w-5xl mx-auto space-y-6">
                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl shadow-lg p-6"
                >
                    <h1 class="text-2xl font-bold text-white">
                        Setor ke Bendahara
                    </h1>
                    <p class="text-sm text-teal-100">
                        Pilih iuran yang sudah diterima kolektor dan buat batch
                        setoran ke bendahara.
                    </p>
                </div>

                <!-- Iuran Pending Setor -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div class="space-y-1">
                            <p
                                class="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"
                            >
                                Iuran Pending Setor
                            </p>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {{ receipts.length }} transaksi siap disetor.
                            </p>
                        </div>
                        <div class="text-right space-y-1">
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                Total Dipilih
                            </p>
                            <p class="text-lg font-semibold text-emerald-600">
                                Rp {{ formatCurrency(totalSelected) }}
                            </p>
                        </div>
                    </div>

                    <div v-if="loading" class="space-y-2">
                        <div
                            class="h-16 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                        />
                        <div
                            class="h-16 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                        />
                    </div>

                    <div
                        v-else-if="error"
                        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-3 text-sm text-red-700 dark:text-red-200"
                    >
                        {{ error }}
                    </div>

                    <div v-else>
                        <div
                            v-if="receipts.length === 0"
                            class="text-sm text-gray-500 dark:text-gray-400"
                        >
                            Tidak ada iuran pending yang bisa disetor.
                        </div>

                        <div v-else class="space-y-2">
                            <div class="flex items-center gap-2 mb-2">
                                <input
                                    id="select-all"
                                    v-model="selectAll"
                                    type="checkbox"
                                    class="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                />
                                <label
                                    for="select-all"
                                    class="text-sm text-gray-700 dark:text-gray-200"
                                >
                                    Pilih semua
                                </label>
                            </div>

                            <div
                                class="space-y-2 max-h-[420px] overflow-auto pr-1"
                            >
                                <div
                                    v-for="item in receipts"
                                    :key="item.id"
                                    class="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 hover:shadow-md transition-shadow"
                                >
                                    <input
                                        v-model="selectedIds"
                                        :value="item.id"
                                        type="checkbox"
                                        class="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                    />
                                    <div class="flex-1 min-w-0">
                                        <p
                                            class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
                                        >
                                            {{ item.anggota_nama || "-" }}
                                        </p>
                                        <p
                                            class="text-xs text-gray-500 dark:text-gray-400 truncate"
                                        >
                                            {{
                                                item.anggota_kode
                                                    ? `Kode: ${item.anggota_kode}`
                                                    : ""
                                            }}
                                            <span v-if="item.ref_iuran_nama">
                                                {{ item.ref_iuran_nama }}
                                            </span>
                                        </p>
                                    </div>
                                    <div class="text-right text-xs space-y-1">
                                        <p
                                            class="text-gray-500 dark:text-gray-400"
                                        >
                                            {{ item.tanggal_bayar }}
                                        </p>
                                        <p
                                            class="font-semibold text-emerald-600"
                                        >
                                            Rp {{ formatCurrency(item.jumlah) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="flex flex-wrap items-center gap-3 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700"
                    >
                        <button
                            type="button"
                            class="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
                            :disabled="submitting || selectedIds.length === 0"
                            @click="submitSetoran"
                        >
                            Setor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import api from "@/utils/axios";

const receipts = ref([]);
const loading = ref(false);
const error = ref(null);

const selectedIds = ref([]);
const submitting = ref(false);
const submitError = ref(null);
const successMessage = ref("");

const selectAll = ref(false);

const formatCurrency = (value) => {
    if (!value && value !== 0) return "0";
    return new Intl.NumberFormat("id-ID").format(Number(value));
};

const totalSelected = computed(() => {
    const idSet = new Set(selectedIds.value);
    return receipts.value
        .filter((item) => idSet.has(item.id))
        .reduce((sum, item) => sum + Number(item.jumlah || 0), 0);
});

watch(selectAll, (val) => {
    if (val) {
        selectedIds.value = receipts.value.map((x) => x.id);
    } else {
        selectedIds.value = [];
    }
});

watch(
    () => selectedIds.value,
    (val) => {
        if (val.length === receipts.value.length && receipts.value.length > 0) {
            selectAll.value = true;
        } else {
            selectAll.value = false;
        }
    }
);

const loadReceipts = async () => {
    loading.value = true;
    error.value = null;
    selectedIds.value = [];
    selectAll.value = false;

    try {
        const res = await api.get("/api/v1/kolektor/setoran/pending-receipts");
        if (res.data?.success) {
            receipts.value = res.data.data || [];
        } else {
            error.value =
                res.data?.message || "Gagal memuat daftar iuran pending.";
        }
    } catch (e) {
        error.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal memuat daftar iuran pending.";
    } finally {
        loading.value = false;
    }
};

const submitSetoran = async () => {
    if (selectedIds.value.length === 0) return;

    if (
        !window.confirm(
            `Buat setoran ke bendahara untuk ${
                selectedIds.value.length
            } transaksi dengan total Rp ${formatCurrency(totalSelected.value)}?`
        )
    ) {
        return;
    }

    submitting.value = true;
    submitError.value = null;
    successMessage.value = "";

    try {
        const payload = {
            tanggal: new Date().toISOString().slice(0, 10),
            receipt_ids: selectedIds.value,
        };

        const res = await api.post("/api/v1/kolektor/setoran", payload);

        if (res.data?.success) {
            successMessage.value =
                res.data?.message || "Setoran kolektor berhasil dibuat.";
            await loadReceipts();
        } else {
            submitError.value =
                res.data?.message || "Gagal membuat setoran kolektor.";
        }
    } catch (e) {
        submitError.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal membuat setoran kolektor.";
    } finally {
        submitting.value = false;
    }
};

onMounted(() => {
    loadReceipts();
});
</script>
