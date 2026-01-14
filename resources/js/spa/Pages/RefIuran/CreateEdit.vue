<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/utils/axios";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import BaseCard from "@/Components/Base/BaseCard.vue";

const router = useRouter();
const route = useRoute();

// Check if editing or creating
const isEditing = computed(() => !!route.params.id);
const refIuranId = computed(() => route.params.id);

const form = reactive({
    nama_iuran: "",
    jumlah: "",
    periode: "sekali",
    tgl_awal_periode: "",
    tgl_akhir_periode: "",
    deskripsi: "",
    entry_type: "pendapatan",
    account_id: null,
});

const errors = reactive({});
const accounts = ref([]);
const isLoadingAccounts = ref(true);
const isSubmitting = ref(false);

// Load accounts
async function loadAccounts() {
    const token = localStorage.getItem("bskm_token");
    try {
        const res = await api.get("/api/v1/accounts", {
            headers: { Authorization: `Bearer ${token}` },
        });
        accounts.value = res.data.data;
    } catch (err) {
    } finally {
        isLoadingAccounts.value = false;
    }
}

// Load ref-iuran data if editing
async function loadRefIuran() {
    if (!isEditing.value) return;

    const token = localStorage.getItem("bskm_token");
    try {
        const res = await api.get(`/api/v1/ref-iuran/${refIuranId.value}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        Object.assign(form, {
            nama_iuran: data.nama_iuran,
            jumlah: data.jumlah,
            periode: data.periode,
            tgl_awal_periode: data.tgl_awal_periode,
            tgl_akhir_periode: data.tgl_akhir_periode,
            deskripsi: data.deskripsi,
            entry_type: data.entry_type,
            account_id: data.account_id,
        });
    } catch (err) {
    }
}

onMounted(() => {
    loadAccounts();
    loadRefIuran();
});

// Filter accounts by entry type
const filteredAccounts = computed(() => {
    if (!accounts.value?.length) return [];

    if (form.entry_type === "pendapatan") {
        return accounts.value.filter((a) => String(a.kode).startsWith("4"));
    }

    if (form.entry_type === "liabilitas") {
        return accounts.value.filter((a) => String(a.kode).startsWith("2"));
    }

    return accounts.value;
});

// Submit form
async function handleSubmit() {
    isSubmitting.value = true;
    const token = localStorage.getItem("bskm_token");

    const payload = { ...form };

    if (!payload.tgl_awal_periode) payload.tgl_awal_periode = null;
    if (!payload.tgl_akhir_periode) payload.tgl_akhir_periode = null;
    if (!payload.deskripsi) payload.deskripsi = null;

    try {
        if (isEditing.value) {
            await api.put(`/api/v1/ref-iuran/${refIuranId.value}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } else {
            await api.post(`/api/v1/ref-iuran`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        router.push({ name: "ref-iuran.index" });
    } catch (err) {
        Object.assign(errors, err.response?.data?.errors || {});
        alert(err.response?.data?.message || "Gagal menyimpan data");
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <DashboardLayout>
        <div class="p-3 sm:p-6 space-y-4 sm:space-y-8">
            <!-- Header Modern -->
            <div class="rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg p-3 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4 mb-2">
                <div class="flex items-center gap-2 sm:gap-4 min-w-0">
                    <router-link :to="{ name: 'ref-iuran.index' }" class="text-cyan-100 hover:underline text-xs sm:text-sm font-semibold flex-shrink-0">
                        ← Kembali
                    </router-link>
                    <div class="p-2 sm:p-3 bg-white/20 rounded-full flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <h1 class="text-xl sm:text-3xl font-bold text-white drop-shadow-lg break-words">
                            {{ isEditing ? "Edit Referensi Iuran" : "Tambah Referensi Iuran" }}
                        </h1>
                        <p class="text-cyan-100 mt-1 text-xs sm:text-base">
                            {{ isEditing ? "Perbarui informasi referensi iuran dengan lengkap" : "Buat referensi iuran baru untuk sistem iuran" }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-8">
                <!-- Card: Informasi Dasar Iuran -->
                <BaseCard class="shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/30">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-200 dark:border-[#2a2d33]">
                        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">Informasi Iuran</h2>
                            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Detail nama, jumlah, dan periode</p>
                        </div>
                    </div>

                    <div class="space-y-3 sm:space-y-5">
                        <!-- Nama Iuran -->
                        <div>
                            <label
                                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Nama Iuran <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.nama_iuran"
                                type="text"
                                placeholder="Contoh: Iuran Bulanan, Iuran Tanah, dll"
                                class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                            <p
                                v-if="errors.nama_iuran"
                                class="mt-1 text-xs sm:text-sm text-red-500"
                            >
                                {{ errors.nama_iuran }}
                            </p>
                        </div>

                        <!-- Jumlah -->
                        <div>
                            <label
                                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Jumlah (Rp) <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.jumlah"
                                type="number"
                                placeholder="0"
                                class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                            <p
                                v-if="errors.jumlah"
                                class="mt-1 text-xs sm:text-sm text-red-500"
                            >
                                {{ errors.jumlah }}
                            </p>
                        </div>

                        <!-- Periode -->
                        <div>
                            <label
                                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Periode <span class="text-red-500">*</span>
                            </label>
                            <select
                                v-model="form.periode"
                                class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            >
                                <option value="sekali">Sekali</option>
                                <option value="bulanan">Bulanan</option>
                                <option value="tahunan">Tahunan</option>
                            </select>
                            <p
                                v-if="errors.periode"
                                class="mt-1 text-xs sm:text-sm text-red-500"
                            >
                                {{ errors.periode }}
                            </p>
                        </div>

                        <!-- Tanggal Awal -->
                        <div>
                            <label
                                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Tanggal Awal
                            </label>
                            <input
                                v-model="form.tgl_awal_periode"
                                type="date"
                                class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <!-- Tanggal Akhir -->
                        <div>
                            <label
                                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Tanggal Akhir
                            </label>
                            <input
                                v-model="form.tgl_akhir_periode"
                                type="date"
                                class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <!-- Deskripsi -->
                        <div class="md:col-span-2">
                            <label
                                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Deskripsi
                            </label>
                            <textarea
                                v-model="form.deskripsi"
                                placeholder="Informasi tambahan tentang iuran ini..."
                                rows="3"
                                class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                            ></textarea>
                        </div>
                    </div>
                </BaseCard>

                <!-- Card: Konfigurasi Akuntansi -->
                <BaseCard class="shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/30">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-200 dark:border-[#2a2d33]">
                        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-base sm:text-lg font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">Konfigurasi Akuntansi</h2>
                            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Tipe iuran dan akun jurnal</p>
                        </div>
                    </div>

                    <div class="space-y-3 sm:space-y-5">
                        <!-- Jenis Akuntansi -->
                        <div>
                            <label
                                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Jenis Akuntansi
                                <span class="text-red-500">*</span>
                            </label>
                            <select
                                v-model="form.entry_type"
                                class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            >
                                <option value="pendapatan">Pendapatan</option>
                                <option value="liabilitas">
                                    Liabilitas (Dana Khusus)
                                </option>
                            </select>
                            <p
                                v-if="errors.entry_type"
                                class="mt-1 text-xs sm:text-sm text-red-500"
                            >
                                {{ errors.entry_type }}
                            </p>
                        </div>

                        <!-- Akun Jurnal -->
                        <div>
                            <label
                                class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Akun Jurnal <span class="text-red-500">*</span>
                            </label>
                            <select
                                v-model="form.account_id"
                                class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            >
                                <option value="" disabled>
                                    -- Pilih akun --
                                </option>
                                <option
                                    v-for="acc in filteredAccounts"
                                    :key="acc.id"
                                    :value="acc.id"
                                >
                                    {{ acc.kode }} - {{ acc.nama }}
                                </option>
                            </select>

                            <p
                                v-if="isLoadingAccounts"
                                class="text-xs text-gray-500 dark:text-gray-400 mt-2"
                            >
                                ⏳ Memuat daftar akun...
                            </p>
                            <p
                                v-if="errors.account_id"
                                class="mt-1 text-xs sm:text-sm text-red-500"
                            >
                                {{ errors.account_id }}
                            </p>
                        </div>
                    </div>
                </BaseCard>
            </form>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-8">
                <router-link :to="{ name: 'ref-iuran.index' }" class="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition text-sm sm:text-base">
                    Batal
                </router-link>
                <button @click="handleSubmit" :disabled="isSubmitting" class="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-bold shadow-lg flex items-center justify-center sm:justify-start gap-2 transition text-sm sm:text-base">
                    <svg v-if="!isSubmitting" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <svg v-else class="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 2v4"/></svg>
                    {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
                </button>
            </div>
        </div>
    </DashboardLayout>
</template>
