<template>
    <DashboardLayout>
        <div class="max-w-3xl mx-auto py-4 sm:py-8 px-3 sm:px-0">

            <!-- FORM -->
            <form @submit.prevent="handleSubmit">

                <!-- Card: Data Diri -->
                <BaseCard>
                    <div class="space-y-3 sm:space-y-5">
                        <!-- Nama -->
                        <div>
                            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nama <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.nama"
                                type="text"
                                placeholder="Nama lengkap anggota"
                                class="w-full px-3 py-2 text-sm sm:text-base rounded-lg border border-[var(--color-border-light)]
                                       dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22]
                                       text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500
                                       focus:border-transparent transition"
                            />
                            <p v-if="errors.nama" class="mt-1 text-xs sm:text-sm text-red-500">
                                {{ errors.nama }}
                            </p>
                        </div>

                        <!-- Jenis Kelamin -->
                        <div>
                            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Jenis Kelamin <span class="text-red-500">*</span>
                            </label>
                            <select
                                v-model="form.jenis_kelamin"
                                class="w-full px-3 py-2 text-sm sm:text-base rounded-lg border border-[var(--color-border-light)]
                                       dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22]
                                       text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500
                                       focus:border-transparent transition"
                            >
                                <option value="">-- Pilih --</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                            <p v-if="errors.jenis_kelamin" class="mt-1 text-xs sm:text-sm text-red-500">
                                {{ errors.jenis_kelamin }}
                            </p>
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email <span class="text-gray-400 text-xs font-normal">(Opsional)</span>
                            </label>
                            <input
                                v-model="form.email"
                                type="email"
                                placeholder="email@example.com"
                                class="w-full px-3 py-2 text-sm sm:text-base rounded-lg border border-[var(--color-border-light)]
                                       dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22]
                                       text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500
                                       focus:border-transparent transition"
                            />
                            <p v-if="errors.email" class="mt-1 text-xs sm:text-sm text-red-500">
                                {{ errors.email }}
                            </p>
                        </div>

                        <!-- No HP -->
                        <div>
                            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                No HP <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.no_hp"
                                type="text"
                                placeholder="08xx-xxxx-xxxx"
                                class="w-full px-3 py-2 text-sm sm:text-base rounded-lg border border-[var(--color-border-light)]
                                       dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22]
                                       text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500
                                       focus:border-transparent transition"
                            />
                            <p v-if="errors.no_hp" class="mt-1 text-sm text-red-500">
                                {{ errors.no_hp }}
                            </p>
                        </div>
                    </div>
                </BaseCard>

                <!-- Card: Dokumen Identitas -->
                <BaseCard>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-5 pb-4 border-b border-[var(--color-border-light)] dark:border-[#2a2d33]">
                        <div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Dokumen Identitas</h2>
                            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Nomor KTP dan KK</p>
                        </div>
                    </div>

                    <div class="space-y-3 sm:space-y-5">
                        <div>
                            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                No KTP <span class="text-gray-400 text-xs font-normal">(Opsional)</span>
                            </label>
                            <input
                                v-model="form.no_ktp"
                                type="text"
                                maxlength="16"
                                placeholder="16 digit nomor KTP"
                                class="w-full px-3 py-2 text-sm sm:text-base rounded-lg border border-[var(--color-border-light)]
                                       dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22]
                                       text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500
                                       focus:border-transparent transition font-mono"
                            />
                            <p v-if="errors.no_ktp" class="mt-1 text-xs sm:text-sm text-red-500">
                                {{ errors.no_ktp }}
                            </p>
                        </div>

                        <!-- No KK -->
                        <div>
                            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                No Kartu Keluarga <span class="text-gray-400 text-xs font-normal">(Opsional)</span>
                            </label>
                            <input
                                v-model="form.no_kk"
                                type="text"
                                maxlength="16"
                                placeholder="16 digit nomor KK"
                                class="w-full px-3 py-2 text-sm sm:text-base rounded-lg border border-[var(--color-border-light)]
                                       dark:border-[#2a2d33] bg-white dark:bg-[#1e1f22]
                                       text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500
                                       focus:border-transparent transition font-mono"
                            />
                            <p v-if="errors.no_kk" class="mt-1 text-xs sm:text-sm text-red-500">
                                {{ errors.no_kk }}
                            </p>
                        </div>
                    </div>
                </BaseCard>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm sm:text-base bg-cyan-600 hover:bg-cyan-700
                               dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white font-medium
                               rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg
                            v-if="!isLoading"
                            class="w-4 h-4 sm:w-5 sm:h-5"
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

                        <span
                            v-if="isLoading"
                            class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                        ></span>

                        {{ isLoading ? "Menyimpan..." : "Simpan Perubahan" }}
                    </button>

                    <router-link
                        :to="{ name: 'anggota.show', params: { id: route.params.id } }"
                        class="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm sm:text-base text-center border border-[var(--color-border-light)] dark:border-[#2a2d33]
                               text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2d33]
                               font-medium rounded-lg transition"
                    >
                        Batal
                    </router-link>
                </div>

            </form>

            <!-- Success Message -->
            <div
                v-if="successMessage"
                class="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200
                       dark:border-green-800 rounded-lg text-green-800 dark:text-green-300"
            >
                {{ successMessage }}
            </div>

        </div>
    </DashboardLayout>
</template>


<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/utils/axios";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import BaseCard from "@/Components/Base/BaseCard.vue";

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const successMessage = ref("");
const anggota = ref(null);

const form = reactive({
    nama: "",
    jenis_kelamin: "",
    email: "",
    no_hp: "",
    no_ktp: "",
    no_kk: "",
});

const errors = reactive({
    nama: "",
    jenis_kelamin: "",
    email: "",
    no_hp: "",
    no_ktp: "",
    no_kk: "",
});

// Load data anggota
async function loadAnggota() {
    try {
        const res = await api.get(`/api/v1/anggotas/${route.params.id}`);
        anggota.value = res.data?.data;

        if (anggota.value) {
            form.nama = anggota.value.nama || "";
            form.jenis_kelamin = anggota.value.jenis_kelamin || "";
            form.email = anggota.value.email || "";
            form.no_hp = anggota.value.no_hp || "";
            form.no_ktp = anggota.value.no_ktp || "";
            form.no_kk = anggota.value.no_kk || "";
        }
    } catch {}
}

// Clear errors
function clearErrors() {
    Object.keys(errors).forEach((key) => (errors[key] = ""));
}

// Validasi sederhana
function validateForm() {
    clearErrors();

    if (!form.nama.trim()) {
        errors.nama = "Nama harus diisi";
        return false;
    }
    if (!form.jenis_kelamin) {
        errors.jenis_kelamin = "Jenis kelamin harus dipilih";
        return false;
    }
    if (!form.no_hp.trim()) {
        errors.no_hp = "No HP harus diisi";
        return false;
    }

    return true;
}

// Submit
async function handleSubmit() {
    if (!validateForm()) return;

    isLoading.value = true;
    successMessage.value = "";

    try {
        const res = await api.put(`/api/v1/anggotas/${route.params.id}`, {
            nama: form.nama,
            jenis_kelamin: form.jenis_kelamin,
            email: form.email || null,
            no_hp: form.no_hp,
            no_ktp: form.no_ktp || null,
            no_kk: form.no_kk || null,
        });

        if (res.data?.success) {
            successMessage.value = "Data anggota berhasil diperbarui!";
            setTimeout(() => {
                router.push({ name: "anggota.show", params: { id: route.params.id } });
            }, 1500);
        }
    } catch (err) {
        const responseErrors = err.response?.data?.errors || {};

        Object.keys(responseErrors).forEach((key) => {
            if (errors[key] !== undefined) {
                let msg = responseErrors[key][0] || "Terjadi kesalahan";

                if (key === "no_hp" && msg.toLowerCase().includes("unique")) {
                    msg = "No HP ini sudah terdaftar. Gunakan nomor lain.";
                }

                errors[key] = msg;
            }
        });
    } finally {
        isLoading.value = false;
    }
}

onMounted(loadAnggota);
</script>


<style scoped>
input:focus,
select:focus {
    outline: none;
}
</style>
