<template>
    <div class="max-w-4xl mx-auto p-3 sm:p-6">
        <div
            class="rounded-lg sm:rounded-xl border shadow-sm p-4 sm:p-6 bg-white dark:bg-[var(--color-card-light)] text-gray-900 dark:text-gray-200"
        >
            <h2 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Penautan ke Data Anggota</h2>

            <p class="text-xs sm:text-sm mb-4 sm:mb-6 text-gray-600 dark:text-gray-300">
                Akun Anda belum terhubung ke data anggota. Silakan cari dan
                pilih anggota yang sesuai dengan identitas Anda.
            </p>

            <!-- User Email Info -->
            <div
                class="mb-4 p-3 sm:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
            >
                <p class="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-300">
                    Email Akun Anda:
                </p>
                <p
                    class="text-xs sm:text-sm text-blue-700 dark:text-blue-400 font-semibold break-all"
                >
                    {{ userEmail }}
                </p>
                <p class="text-xs text-blue-600 dark:text-blue-500 mt-1">
                    Email ini akan disimpan ke data anggota saat persetujuan
                    sekretaris
                </p>
            </div>

            <!-- Search Box -->
            <div class="mb-4">
                <label class="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium"
                    >Cari Anggota / alamat / perum / no rumah
                </label>
                <input
                    v-model="search"
                    @input="searchMembers"
                    type="text"
                    placeholder="nama / alamat / perum / no rumah "
                    class="w-full rounded-lg border p-2 sm:p-3 text-xs sm:text-base dark:bg-[var(--color-card-light)] dark:border-[var(--color-border-light)] dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <!-- Hasil Pencarian -->
            <div v-if="loading" class="text-xs sm:text-sm text-gray-400 py-4">Mencari...</div>

            <div v-if="results.length">
                <p class="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                    {{ results.length }} hasil ditemukan
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                    <label
                        v-for="a in results"
                        :key="a.id"
                        class="cursor-pointer block p-3 sm:p-4 rounded-lg border shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition text-xs sm:text-sm"
                    >
                        <input
                            type="radio"
                            name="selected"
                            :value="a.id"
                            v-model="selectedId"
                            class="mr-2"
                        />

                        <div class="font-semibold text-sm sm:text-lg">{{ a.nama }}</div>
                        <div class="text-gray-500 text-xs sm:text-sm">
                            #{{ a.kode_anggota }}
                        </div>

                        <div class="text-xs sm:text-sm mt-2">
                            <div class="font-medium">Alamat:</div>
                            <div class="break-words">{{ a.alamat?.alamat_lainnya }}</div>
                            <div class="break-words">
                                {{ a.alamat?.perum?.nama }} No.
                                {{ a.alamat?.no_rumah }}
                            </div>
                            <div>{{ a.alamat?.village?.name }}</div>
                        </div>
                    </label>
                </div>
            </div>

            <div
                v-else-if="search.length > 2 && !loading"
                class="text-gray-400 text-xs sm:text-sm py-4"
            >
                Tidak ada anggota ditemukan.
            </div>

            <!-- Nomor HP -->
            <div class="mt-4 sm:mt-6">
                <label class="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium">Nomor HP</label>
                <input
                    type="text"
                    v-model="form.no_hp"
                    placeholder="contoh: 0812xxxx"
                    class="w-full rounded-lg border p-2 sm:p-3 text-xs sm:text-base dark:bg-[var(--color-card-light)] dark:border-[var(--color-border-light)] dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <!-- Submit Button -->
            <div class="mt-6 sm:mt-8">
                <button
                    :disabled="!selectedId || !form.no_hp"
                    @click="submit"
                    class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-blue-600 text-white text-xs sm:text-base disabled:opacity-40 dark:bg-blue-500 dark:hover:bg-blue-600 hover:bg-blue-700 transition font-medium"
                >
                    Ajukan Penautan
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import api from "@/utils/axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const userEmail = ref("");

const search = ref("");
const results = ref([]);
const loading = ref(false);

const selectedId = ref(null);

const form = ref({
    anggota_id: "",
    no_hp: "",
    email: "",
});

onMounted(() => {
    // Capture email dari authenticated user
    if (authStore.user) {
        userEmail.value = authStore.user.email;
        form.value.email = authStore.user.email;
    }
});

async function searchMembers() {
    if (search.value.length < 2) {
        results.value = [];
        return;
    }

    loading.value = true;
    const res = await api.get(`/api/v1/anggotas?q=${search.value}&per_page=20`);
    results.value = res.data.data;
    loading.value = false;
}

async function submit() {
    form.value.anggota_id = selectedId.value;

    await api.post("/api/v1/user/anggota-request", form.value);

    $notify.info(
        "Pengajuan Anda telah dikirim dan menunggu persetujuan sekretaris."
    );

    // tidak redirect apa pun → tetap di dashboard
}
</script>
