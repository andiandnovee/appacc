<!-- resources/js/spa/Pages/RefIuran/Index.vue -->
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/axios";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import InfoCard from "@/Components/Base/InfoCard.vue";
import DeleteDialog from "@/Components/HeadLess/DeleteDialog.vue";

const router = useRouter();

const refIurans = ref([]);
const isLoading = ref(true);

const showDelete = ref(false);
const deleteTarget = ref(null);

function openDelete(item) {
    deleteTarget.value = item;
    showDelete.value = true;
}

async function confirmDelete() {
    const token = localStorage.getItem("bskm_token");

    try {
        await api.delete(`/api/v1/ref-iuran/${deleteTarget.value.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        showDelete.value = false;
        deleteTarget.value = null;
        loadData();
    } catch (err) {
        alert(err.response?.data?.message || "Gagal menghapus.");
    }
}

async function loadData() {
    const token = localStorage.getItem("bskm_token");
    const res = await api.get("/api/v1/ref-iuran", {
        headers: { Authorization: `Bearer ${token}` },
    });

    refIurans.value = res.data.data;
    isLoading.value = false;
}

function openCreate() {
    router.push({ name: "ref-iuran.create" });
}

function openEdit(item) {
    router.push({ name: "ref-iuran.edit", params: { id: item.id } });
}

onMounted(loadData);
</script>

<template>
    <DashboardLayout>
        <template #default>
            <!-- Page Content -->
            <div class="p-3 sm:p-6 space-y-4 sm:space-y-8">
                <!-- Header Modern -->
                <div class="rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg p-3 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4 mb-2">
                    <div class="flex items-center gap-2 sm:gap-4 min-w-0">
                        <div class="p-2 sm:p-3 bg-white/20 rounded-full flex-shrink-0">
                            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <h1 class="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg break-words">Referensi Iuran</h1>
                            <p class="text-cyan-100 mt-1 text-xs sm:text-base">Daftar seluruh jenis iuran yang berlaku di sistem</p>
                        </div>
                    </div>
                    <button @click="openCreate" class="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto bg-white text-blue-700 font-bold shadow-md hover:bg-blue-50 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        Tambah Iuran
                    </button>
                </div>

                <div v-if="isLoading" class="text-gray-500 dark:text-gray-400 text-center py-8 sm:py-12 text-sm sm:text-base">
                    Memuat data iuran...
                </div>

                <div class="grid gap-3 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoCard
                        v-for="item in refIurans"
                        :key="item.id"
                        :title="item.nama_iuran"
                        :amount="item.jumlah"
                        :periode="item.periode"
                        :dateStart="item.tgl_awal_periode"
                        :dateEnd="item.tgl_akhir_periode"
                        :description="item.deskripsi"
                        class="shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/30"
                    >
                        <template #extra>
                            <div class="mt-3 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                                <p>
                                    <strong>Jenis Akuntansi:</strong>
                                    <span :class="item.entry_type === 'liabilitas' ? 'text-red-600 dark:text-red-400 font-bold' : 'text-green-700 dark:text-green-300 font-bold'">
                                        <svg v-if="item.entry_type === 'liabilitas'" class="inline w-4 h-4 mr-1 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-1.414 1.414A9 9 0 105.636 18.364l1.414-1.414A7 7 0 1116.95 7.05z"/></svg>
                                        <svg v-else class="inline w-4 h-4 mr-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                        {{ item.entry_type }}
                                    </span>
                                </p>
                                <p>
                                    <strong>Akun Jurnal:</strong>
                                    <span class="font-mono text-xs">{{ item.account_id ? item.account_id : "-" }}</span>
                                </p>
                            </div>
                        </template>
                        <template #actions>
                            <div class="mt-4 flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
                                <button @click="openEdit(item)" class="w-full sm:w-auto px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md border border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-500/20 font-semibold transition-colors duration-150 flex items-center justify-center sm:justify-start gap-1">
                                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2m-1 0v14m-7-7h14"/></svg>
                                    Edit
                                </button>
                                <button @click="openDelete(item)" class="w-full sm:w-auto px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md border border-red-500 text-red-600 dark:border-red-400 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/20 font-semibold transition-colors duration-150 flex items-center justify-center sm:justify-start gap-1">
                                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                    Hapus
                                </button>
                            </div>
                        </template>
                    </InfoCard>
                </div>
            </div>

            <DeleteDialog
                :show="showDelete"
                title="Hapus Iuran?"
                :message="`Anda akan menghapus iuran: ${deleteTarget?.nama_iuran}`"
                @close="showDelete = false"
                @confirm="confirmDelete"
            />
        </template>
    </DashboardLayout>
</template>
