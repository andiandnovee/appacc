<template>
    <div
        class="min-h-screen flex flex-col gap-6 sm:gap-8 md:gap-10 px-3 sm:px-6 md:px-12 py-4 sm:py-6 text-[var(--color-text-light)] transition-colors duration-300 bg-gradient-to-br from-cyan-50 via-emerald-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
        <Header title="BSKM Community">
            <template #default>
                <button
                    aria-label="Toggle theme"
                    @click="toggleDarkMode"
                    class="p-2 sm:p-3 rounded-lg sm:rounded-2xl border border-transparent text-cyan-600 dark:text-cyan-300 hover:text-emerald-600 dark:hover:text-white hover:border-cyan-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-200 shadow"
                >
                    <MoonIcon v-if="!isDarkMode" class="h-5 w-5 sm:h-6 sm:w-6" />
                    <SunIcon v-else class="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
            </template>
        </Header>

        <main class="flex flex-col gap-8 sm:gap-10 md:gap-12">
            <section
                class="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-6 sm:gap-8 lg:gap-10 items-center"
            >
                <div class="space-y-4 sm:space-y-6">
                    <p class="pill bg-gradient-to-r from-cyan-400 to-emerald-400 text-white/90 inline-flex items-center gap-2 shadow text-xs sm:text-sm">
                        <span class="h-2 w-2 rounded-full bg-white flex-shrink-0"></span>
                        Platform Sosial RT 007
                    </p>
                    <div class="space-y-3 sm:space-y-4">
                        <h1
                            class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-cyan-700 dark:text-cyan-300 drop-shadow"
                        >
                            Bersama Sosial Kita Maju
                        </h1>
                        <p class="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
                            Monitor iuran, arus kas, dan aktivitas sosial anggota melalui panel modern dengan dukungan akses multi perangkat.
                        </p>
                    </div>

                    <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
                        <button
                            @click="loginWithGoogle"
                            class="inline-flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-bold text-sm sm:text-base tracking-wide bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:scale-105 active:scale-95 transition duration-200 w-full sm:w-auto"
                        >
                            <img
                                :src="googleIcon"
                                alt="Google"
                                class="w-5 h-5 sm:w-6 sm:h-6"
                            />
                            <span>Login dengan Google</span>
                        </button>
                        <button
                            class="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-cyan-300 text-sm sm:text-base font-bold text-cyan-700 dark:text-cyan-300 bg-white/60 dark:bg-white/10 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all duration-200 shadow w-full sm:w-auto"
                        >
                            Jelajahi Fitur
                        </button>
                    </div>
                </div>

                <div class="glass-panel p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-[2rem] space-y-4 sm:space-y-6 shadow-xl mt-6 lg:mt-0">
                    <p class="text-xs sm:text-sm text-muted uppercase tracking-[0.2em] sm:tracking-[0.4em]">
                        Status Iuran
                    </p>
                    <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                        <div
                            v-for="stat in heroStats"
                            :key="stat.label"
                            class="rounded-lg sm:rounded-xl lg:rounded-2xl border border-cyan-200 dark:border-cyan-700 px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-7 flex flex-col gap-2 sm:gap-3 bg-white/80 dark:bg-gray-900/60 shadow"
                        >
                            <span class="text-xs text-cyan-500 dark:text-cyan-300 uppercase font-bold">{{ stat.label }}</span>
                            <p class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-cyan-700 dark:text-cyan-200 line-clamp-1">
                                {{ stat.value }}
                            </p>
                            <span class="text-xs font-semibold text-emerald-500 dark:text-emerald-300">{{ stat.caption }}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section
                class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl"
            >
                <SaldoCard title="Saldo Kas Umum" :amount="saldoKasUmum" />
                <SaldoCard title="Saldo Iuran Tanah" :amount="saldoIuranTanah" />
            </section>

            <section
                class="glass-panel rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] px-4 sm:px-6 md:px-10 py-6 sm:py-8 lg:py-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8"
            >
                <div class="flex-1 space-y-2 sm:space-y-3 text-center md:text-left">
                    <p class="pill bg-white/60 dark:bg-white/10 mx-auto md:mx-0 text-xs sm:text-sm">
                        Undangan Warga
                    </p>
                    <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        Masuk untuk melihat rincian iuran dan laporan
                    </h2>
                    <p class="text-muted text-xs sm:text-sm">
                        Gunakan akun Google Anda, verifikasi otomatis, dan
                        langsung akses panel dengan hak akses sesuai peran.
                    </p>
                </div>
                <div class="flex flex-col gap-2 sm:gap-3 w-full md:max-w-xs">
                    <button
                        @click="loginWithGoogle"
                        class="inline-flex items-center justify-center gap-2 px-4 sm:px-4 py-3 sm:py-3 rounded-xl sm:rounded-2xl border border-[var(--color-border-light)]/80 bg-white/70 dark:bg-white/10 text-xs sm:text-sm font-semibold text-[var(--color-text-light)] hover:shadow-lg active:scale-95 transition-all duration-200"
                    >
                        <img
                            :src="googleIcon"
                            alt="Google"
                            class="w-4 h-4 sm:w-5 sm:h-5"
                        />
                        Login dengan Google
                    </button>
                    <p class="text-xs text-muted text-center">
                        Dengan masuk, Anda menyetujui kebijakan privasi dan tata
                        kelola komunitas BSKM.
                    </p>
                </div>
            </section>
        </main>

        <footer
            class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted border-t border-[var(--color-border-light)]/60 pt-4 sm:pt-6 mt-6 sm:mt-8"
        >
            <span>&copy; {{ currentYear }} BSKM - RT 007.</span>
            <span>Dirancang untuk transparansi iuran dan kegiatan sosial.</span>
        </footer>
    </div>
</template>

<script setup>
import SaldoCard from "./components/SaldoCard.vue";
import googleIcon from "@/assets/icons/google.svg";
import Header from "@/Components/Header.vue";
import { MoonIcon, SunIcon } from "lucide-vue-next";
import { ref, onMounted } from "vue";
// State sederhana
const saldoKasUmum = 0;
const saldoIuranTanah = 0;
const currentYear = new Date().getFullYear();
const heroStats = [
    { label: "Terkumpul", value: "Rp 125 jt", caption: "+8% bulan ini" },
    { label: "Iuran Aktif", value: "12 jenis", caption: "Bulanan & tahunan" },
    { label: "Kolektor", value: "4 orang", caption: "Siap menerima setoran" },
    { label: "Anggota", value: "210 KK", caption: "Terhubung ke sistem" },
];

const isDarkMode = ref(false);

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle("dark", isDarkMode.value);
    localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
};

onMounted(() => {
    const saved = localStorage.getItem("theme");
    isDarkMode.value = saved === "dark";
    document.documentElement.classList.toggle("dark", isDarkMode.value);
});

// Fungsi login Google — aman terhadap respons HTML / error
const loginWithGoogle = async () => {
    try {
        const baseUrl =
            import.meta.env.VITE_API_BASE_URL || window.location.origin;

        const res = await fetch(`${baseUrl}/api/socialite/google`, {
            method: "GET",
            credentials: "include",
        });

        const text = await res.text();

        if (!res.ok) {
            console.error("socialite/google failed", res.status, text);
            alert(
                "Login Google gagal (status " +
                    res.status +
                    "). Silakan coba lagi atau hubungi admin."
            );
            return;
        }

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            try {
                const data = JSON.parse(text);
                if (data && data.url) {
                    window.location.href = data.url;
                    return;
                }
            } catch (e) {
                console.error("Failed to parse socialite/google JSON", e, text);
            }
        }

        if (res.url && res.url !== `${baseUrl}/api/socialite/google`) {
            window.location.href = res.url;
            return;
        }

        alert("Response login Google tidak valid. Hubungi admin.");
    } catch (err) {
        console.error("loginWithGoogle error", err);
        alert("Terjadi kesalahan saat menghubungi server.");
    }
};
</script>

<style scoped>
/* Tambahan opsional */
</style>
