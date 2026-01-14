<template>
    <div class="relative" ref="dropdownRef">
        <!-- Tombol Avatar -->
        <button
            @click="toggleMenu"
            class="flex items-center gap-2 rounded-2xl px-3 py-1.5 border border-transparent hover:border-[var(--color-border-light)] hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 relative z-50"
            :aria-expanded="open"
        >
            <img
                v-if="avatarUrl"
                :src="avatarUrl"
                :alt="auth.user?.name || 'User Avatar'"
                @error="onImageError"
                class="w-9 h-9 rounded-full border border-[var(--color-border-light)]/80 object-cover shadow-sm"
            />
            <div
                v-else
                class="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-400 text-white text-xs font-bold select-none shadow-md shadow-cyan-500/40"
            >
                {{ initials }}
            </div>
        </button>

        <!-- Dropdown -->
        <transition name="fade">
            <div
                v-if="open"
                class="absolute right-0 top-full w-56 mt-1 rounded-2xl shadow-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] backdrop-blur-2xl text-gray-700 dark:text-gray-200 overflow-hidden z-40"
            >
                <!-- User info header -->
                <div
                    class="px-4 py-3 border-b border-[var(--glass-border)]/70"
                >
                    <p
                        class="text-sm font-semibold text-gray-900 dark:text-white truncate"
                    >
                        {{ auth.user?.name }}
                    </p>
                    <p
                        class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5"
                    >
                        {{ auth.user?.email }}
                    </p>
                </div>

                <!-- Menu items -->
                <div class="py-1">
                    <button
                        class="w-full text-left px-4 py-2.5 text-sm transition-all duration-150 text-gray-600 dark:text-gray-300 hover:text-[var(--color-text-light)] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 rounded-xl"
                        @click="goToProfile"
                    >
                        Profil
                    </button>
                    <button
                        class="w-full text-left px-4 py-2.5 text-sm transition-all duration-150 text-red-500 dark:text-red-300 hover:text-red-600 dark:hover:text-red-200 hover:bg-red-50/70 dark:hover:bg-red-500/10 rounded-xl"
                        @click="logout"
                    >
                        Keluar
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import api from "@/utils/axios";
import { nextTick } from "vue";

const auth = useAuthStore();
const router = useRouter();

const open = ref(false);
const dropdownRef = ref(null);

const toggleMenu = () => {
    open.value = !open.value;
};

// Tutup dropdown saat klik di luar
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        open.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});

// URL avatar dengan fallback
const avatarUrl = computed(() => {
    if (!auth.user?.avatar) return null;
    const avatar = auth.user.avatar;

    // Jika sudah URL penuh
    if (avatar.startsWith("http")) return avatar;

    // Jika relatif, gunakan base URL dari environment atau origin
    const base = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    return `${base}/${avatar.replace(/^\/+/, "")}`;
});

// Inisial nama jika avatar tidak ada
const initials = computed(() => {
    if (!auth.user?.name) return "?";
    const parts = auth.user.name.split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
});

// Fallback jika gambar gagal dimuat
const onImageError = (e) => {
    e.target.style.display = "none";
};

// Navigasi dan logout
const goToProfile = () => {
    open.value = false;
    router.push({ name: "Dashboard" }); // nanti bisa diarahkan ke profil
};

const logout = async () => {
    open.value = false;

    try {
        await api.post("/api/logout");
    } catch (e) {
    }

    // Clear auth state terlebih dahulu
    auth.clearAuth();

    // Tunggu state terupdate
    await nextTick();

    // Redirect ke Landing dengan hard refresh untuk clear semua cache
    setTimeout(() => {
        router.replace({ name: "Landing" }).catch(() => {
            // Jika router.replace gagal, force reload
            window.location.href = "/";
        });
    }, 100);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Avatar "online" indicator */
button img {
    position: relative;
}
button img::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background-color: #10b981;
    border-radius: 50%;
    border: 1px solid white;
}
</style>
