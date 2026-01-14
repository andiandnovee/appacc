<!-- resources/js/spa/Pages/Anggota/Show.vue -->
<template>
    <DashboardLayout>
        <div class="p-3 sm:p-4 space-y-4 sm:space-y-7">
            <!-- Header Modern -->
            <div class="rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-2">
                <div class="flex items-center gap-3 sm:gap-4">
                    <div class="p-2 sm:p-3 bg-white/20 rounded-full flex-shrink-0">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg break-words">{{ anggota?.nama }}</h1>
                        <p class="text-xs sm:text-sm text-cyan-100 mt-1">Kode Anggota: #{{ anggota?.kode }}</p>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 w-full sm:w-auto">
                    <BaseButton v-if="canManage" @click="goEdit" class="w-full sm:w-auto bg-white text-teal-700 font-bold shadow-md hover:bg-teal-50 text-sm sm:text-base py-2">
                        <span class="inline-flex items-center justify-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2m-1 0v14m-7-7h14"/></svg>
                            Edit
                        </span>
                    </BaseButton>
                    <BaseButton v-if="canDelete" variant="outline" @click="confirmDelete" class="w-full sm:w-auto border-white text-white hover:bg-white/10 text-sm sm:text-base py-2">
                        <span class="inline-flex items-center justify-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            Hapus
                        </span>
                    </BaseButton>
                </div>
            </div>

            <!-- CARD: Informasi Utama -->
            <BaseCard class="shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900/30">
                <h2 class="text-base sm:text-lg font-bold mb-4 text-teal-700 dark:text-teal-300 flex items-center gap-2">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Informasi Utama
                </h2>
                <div class="space-y-3">
                    <InfoRow label="Nama" :value="anggota?.nama" />
                    <InfoRow
                        label="Jenis Kelamin"
                        :value="anggota?.jenis_kelamin"
                    />

                    <InfoRow label="Status">
                        <BaseBadge
                            :variant="
                                anggota?.status === 'aktif'
                                    ? 'success'
                                    : 'warning'
                            "
                        >
                            {{ anggota?.status }}
                        </BaseBadge>
                    </InfoRow>

                    <InfoRow label="Email" :value="anggota?.email" />
                    <InfoRow label="No HP" :value="anggota?.no_hp" />
                    <InfoRow label="No KTP" :value="anggota?.no_ktp" />
                    <InfoRow label="No KK" :value="anggota?.no_kk" />

                    <InfoRow label="Dibuat">
                        {{ formatDate(anggota?.created_at) }}
                    </InfoRow>

                    <InfoRow label="Diperbarui">
                        {{ formatDate(anggota?.updated_at) }}
                    </InfoRow>
                </div>
            </BaseCard>

            <!-- CARD: Alamat -->
            <BaseCard class="shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-cyan-50 dark:from-gray-900 dark:to-cyan-900/30">
                <h2 class="text-base sm:text-lg font-bold mb-4 text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v4a1 1 0 001 1h3m10-5a1 1 0 011 1v4a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v4a1 1 0 001 1h3m10-5a1 1 0 011 1v4a1 1 0 01-1 1h-3"/></svg>
                    Alamat Anggota
                </h2>
                <div v-if="anggota?.alamat" class="space-y-3">
                    <InfoRow label="Perumahan" :value="anggota.alamat.perum" />
                    <InfoRow
                        label="No Rumah"
                        :value="anggota.alamat.no_rumah"
                    />
                    <InfoRow label="Desa" :value="anggota.alamat.village" />
                    <InfoRow
                        label="Alamat Lain"
                        :value="anggota.alamat.alamat_lainnya"
                    />
                </div>

                <div v-else class="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    Tidak ada data alamat.
                </div>
            </BaseCard>

            <!-- CARD: Keluarga -->
            <BaseCard class="shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-rose-50 dark:from-gray-900 dark:to-rose-900/30">
                <h2 class="text-base sm:text-lg font-bold mb-4 text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M6 8a6 6 0 1112 0A6 6 0 016 8z"/></svg>
                    Data Keluarga
                </h2>
                <div v-if="anggota?.keluarga?.length" class="grid md:grid-cols-2 gap-4">
                    <div v-for="kel in anggota.keluarga" :key="kel.id" class="p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-gray-800 shadow hover:shadow-xl transition-all">
                        <p class="font-bold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {{ kel.nama }} <span class="text-xs text-gray-500">({{ kel.hubungan }})</span>
                        </p>
                        <div class="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-400">
                            <div>Jenis Kelamin: <span class="font-semibold">{{ kel.jenis_kelamin }}</span></div>
                            <div>Tanggal Lahir: <span class="font-semibold">{{ kel.tanggal_lahir }}</span></div>
                            <div>No HP: <span class="font-semibold">{{ kel.no_hp }}</span></div>
                            <div>No KTP: <span class="font-semibold">{{ kel.no_ktp }}</span></div>
                        </div>
                    </div>
                </div>

                <div v-else class="text-gray-500 dark:text-gray-400 text-sm">
                    Tidak ada data keluarga.
                </div>
            </BaseCard>

            <!-- CARD: Panel Tambahan -->
            <BaseCard class="shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/30">
                <h3 class="text-lg font-bold mb-2 text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Panel Informasi Tambahan
                </h3>
                <div class="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                    <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    (Panel rekap iuran & lainnya bisa ditambahkan nanti.)
                </div>
            </BaseCard>

            <!-- Modal Hapus -->
            <DeleteDialog
                v-if="deleteConfirm"
                title="Hapus Anggota"
                message="Data anggota hanya dapat dihapus jika tidak memiliki iuran atau alamat terkait."
                :loading="loadingDelete"
                @cancel="deleteConfirm = false"
                @confirm="doDelete"
            />
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/utils/axios";
import { useRoute, useRouter } from "vue-router";

import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import BaseButton from "@/Components/Base/BaseButton.vue";
import BaseBadge from "@/Components/Base/BaseBadge.vue";
import BaseCard from "@/Components/Base/BaseCard.vue";
import DeleteDialog from "@/Components/HeadLess/DeleteDialog.vue";

// ⬇ InfoRow BARU
import InfoRow from "@/Components/Base/InfoRow.vue";

import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const anggota = ref(null);
const deleteConfirm = ref(false);
const loadingDelete = ref(false);

// Dapatkan ID anggota (dari route param atau dari user login jika /anggota-saya)
const anggotaId = computed(() => {
    // Jika route adalah /anggota-saya, gunakan ID dari user yang login
    if (route.name === "anggota.saya") {
        return auth.user?.anggota?.id;
    }
    // Jika route adalah /anggota/:id, gunakan param dari route
    return Number(route.params.id);
});

// Permissions
const isSelf = computed(() => {
    return auth.user?.anggota?.id === anggotaId.value;
});

const canManage = computed(() => {
    return (
        auth.permissions.includes("Anggota.Manage") ||
        (isSelf.value && auth.permissions.includes("AnggotaSelf.Manage"))
    );
});

const canDelete = computed(() => {
    return auth.permissions.includes("Anggota.Delete");
});

// Fetch Data
async function load() {
    const res = await api.get(`/api/v1/anggotas/${anggotaId.value}`);
    anggota.value = res.data?.data;
}

function confirmDelete() {
    deleteConfirm.value = true;
}

async function doDelete() {
    loadingDelete.value = true;
    try {
        await api.delete(`/api/v1/anggotas/${anggotaId.value}`);
        router.push({ name: "anggota.index" });
    } catch (err) {
        alert(err.response?.data?.message ?? "Gagal menghapus data");
    } finally {
        loadingDelete.value = false;
    }
}

function goEdit() {
    router.push({ name: "anggota.edit", params: { id: anggotaId.value } });
}

function formatDate(dt) {
    if (!dt) return "-";
    return new Date(dt).toLocaleString();
}

onMounted(load);
</script>

<style scoped>
/* warna teks mutu */
.text-muted {
    color: var(--color-icon-light);
}
.dark .text-muted {
    color: var(--color-icon-dark);
}
</style>
