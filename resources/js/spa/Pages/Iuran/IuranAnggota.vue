<!-- resources/js/spa/Pages/Iuran/IuranAnggota.vue -->
<template>
    <DashboardLayout>
        <!-- Jika anggota tidak ditemukan -->
        <div
            v-if="notFound"
            class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6 flex items-center justify-center"
        >
            <div
                class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-xl border border-red-200 dark:border-red-900 p-6 sm:p-12 text-center max-w-md mx-2"
            >
                <div
                    class="p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 rounded-full inline-flex mb-4"
                >
                    <svg
                        class="w-8 h-8 sm:w-12 sm:h-12 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h3
                    class="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400 mb-2"
                >
                    Data Anggota Tidak Ditemukan
                </h3>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Anggota dengan ID {{ $route.params.anggotaId }} tidak
                    ditemukan dalam sistem.
                </p>
                <router-link
                    to="/dashboard"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Kembali ke Dashboard
                </router-link>
            </div>
        </div>

        <!-- Konten Utama -->
        <div
            v-else
            class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6"
        >
            <!-- Hero Header -->
            <div class="mb-4 sm:mb-8">
                <div class="flex items-center gap-2 sm:gap-4 mb-4">
                    <div
                        class="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0"
                    >
                        <svg
                            class="w-6 h-6 sm:w-8 sm:h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h1
                            class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
                        >
                            Iuran Anggota
                        </h1>
                        <p
                            class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1"
                        >
                            Rincian iuran dan informasi pembayaran
                        </p>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto space-y-6">
                <!-- Header Card dengan Greeting & Detail Anggota -->
                <div
                    class="bg-gradient-to-br from-white to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-lg sm:rounded-xl shadow-lg border border-cyan-200 dark:border-cyan-900 overflow-hidden"
                >
                    <div class="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 sm:p-6">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <svg
                                class="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <div>
                                <h3 class="text-base sm:text-xl font-bold text-white">
                                    Profil Anggota
                                </h3>
                                <p class="text-cyan-100 text-xs sm:text-sm mt-1">
                                    Informasi data anggota
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 sm:p-6">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <div
                                class="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
                            >
                                <div
                                    class="text-gray-500 dark:text-gray-300 font-semibold text-lg sm:text-xl"
                                >
                                    {{ anggotaInitials }}
                                </div>
                            </div>

                            <div class="flex-1 min-w-0">
                                <h1
                                    class="text-xl sm:text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100 break-words"
                                >
                                    {{ anggota?.nama || "Loading..." }}
                                </h1>
                                <p
                                    class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                                >
                                    Rincian iuran dan informasi pembayaran untuk
                                    anggota ini.
                                </p>
                            </div>

                            <!-- Back button -->
                            <div class="w-full sm:w-auto mt-3 sm:mt-0">
                                <router-link
                                    to="/dashboard"
                                    class="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-600 text-xs sm:text-sm rounded transition"
                                >
                                    ← Kembali
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profil Ringkas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                <!-- Info Anggota -->
                <div
                    class="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    <div
                        class="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 sm:p-4"
                    >
                        <h2
                            class="text-base sm:text-lg font-semibold text-white flex items-center gap-2"
                        >
                            <svg
                                class="w-4 h-4 sm:w-5 sm:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Informasi Anggota
                        </h2>
                    </div>
                    <div class="p-3 sm:p-6">
                        <div
                            class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm"
                        >
                            <div>
                                <p
                                    class="font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                    Nama
                                </p>
                                <p class="text-gray-900 dark:text-gray-100">
                                    {{ anggota?.nama || "-" }}
                                </p>
                            </div>
                            <div>
                                <p
                                    class="font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                    Kode Anggota
                                </p>
                                <p
                                    class="text-gray-900 dark:text-gray-100 font-mono"
                                >
                                    {{ anggota?.kode || "-" }}
                                </p>
                            </div>
                            <div>
                                <p
                                    class="font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                    Jenis Kelamin
                                </p>
                                <p class="text-gray-900 dark:text-gray-100">
                                    {{
                                        anggota?.jenis_kelamin === "L"
                                            ? "Laki-laki"
                                            : anggota?.jenis_kelamin === "P"
                                            ? "Perempuan"
                                            : "-"
                                    }}
                                </p>
                            </div>
                            <div>
                                <p
                                    class="font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                    Status
                                </p>
                                <p
                                    class="text-gray-900 dark:text-gray-100 capitalize"
                                >
                                    {{ anggota?.status || "-" }}
                                </p>
                            </div>

                            <div v-if="anggota?.email" class="md:col-span-2">
                                <p
                                    class="font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                    Email
                                </p>
                                <p
                                    class="text-gray-900 dark:text-gray-100 break-all"
                                >
                                    {{ anggota.email }}
                                </p>
                            </div>

                            <div class="md:col-span-2">
                                <p
                                    class="font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                    Alamat
                                </p>
                                <p class="text-gray-900 dark:text-gray-100">
                                    {{ formattedAddress }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ringkasan Iuran -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    <div class="bg-gradient-to-r from-cyan-500 to-teal-600 p-4">
                        <h2
                            class="text-lg font-semibold text-white flex items-center gap-2"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                            </svg>
                            Ringkasan Iuran
                        </h2>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <div
                                class="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800/40 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="p-2 bg-green-500 rounded-lg">
                                        <svg
                                            class="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <p
                                        class="text-sm font-medium text-green-700 dark:text-green-400"
                                    >
                                        Sudah Dibayar
                                    </p>
                                </div>
                                <p
                                    class="text-2xl font-bold text-green-700 dark:text-green-300"
                                >
                                    Rp
                                    {{
                                        formatNumber(
                                            summary.total_sudah_dibayar
                                        )
                                    }}
                                </p>
                            </div>

                            <div
                                class="p-5 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800/40 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="p-2 bg-red-500 rounded-lg">
                                        <svg
                                            class="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <p
                                        class="text-sm font-medium text-red-700 dark:text-red-400"
                                    >
                                        Belum Dibayar
                                    </p>
                                </div>
                                <p
                                    class="text-2xl font-bold text-red-700 dark:text-red-300"
                                >
                                    Rp
                                    {{
                                        formatNumber(
                                            summary.total_belum_dibayar
                                        )
                                    }}
                                </p>
                            </div>

                            <div
                                class="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800/40 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="p-2 bg-blue-500 rounded-lg">
                                        <svg
                                            class="w-5 h-5 text-white"
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
                                    </div>
                                    <p
                                        class="text-sm font-medium text-blue-700 dark:text-blue-400"
                                    >
                                        Jenis Iuran Aktif
                                    </p>
                                </div>
                                <p
                                    class="text-3xl font-bold text-blue-700 dark:text-blue-300"
                                >
                                    {{ summary.total_jenis_iuran }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Alamat Perum & No Rumah -->
            <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
                <div class="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
                    <h2
                        class="text-lg font-semibold text-white flex items-center gap-2"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Alamat Perumahan
                    </h2>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div class="flex items-start gap-3">
                            <div
                                class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mt-1"
                            >
                                <svg
                                    class="w-4 h-4 text-purple-600 dark:text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p
                                    class="font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                    Perum
                                </p>
                                <p
                                    class="text-gray-900 dark:text-gray-100 font-semibold"
                                >
                                    {{ anggota?.alamat?.perum || "-" }}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div
                                class="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg mt-1"
                            >
                                <svg
                                    class="w-4 h-4 text-pink-600 dark:text-pink-400"
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
                            </div>
                            <div>
                                <p
                                    class="font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                    No Rumah
                                </p>
                                <p
                                    class="text-gray-900 dark:text-gray-100 font-semibold"
                                >
                                    {{ anggota?.alamat?.no_rumah || "-" }}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div
                                class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mt-1"
                            >
                                <svg
                                    class="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p
                                    class="font-medium text-gray-600 dark:text-gray-400 mb-1"
                                >
                                    Desa / Kelurahan
                                </p>
                                <p
                                    class="text-gray-900 dark:text-gray-100 font-semibold"
                                >
                                    {{ anggota?.alamat?.village || "-" }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- LOADING -->
        <div v-if="isLoading" class="max-w-7xl mx-auto space-y-6 animate-pulse">
            <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4"
            >
                <div
                    class="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-1/3"
                ></div>
                <div
                    class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"
                ></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    class="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-3"
                >
                    <div
                        class="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/4"
                    ></div>
                    <div
                        class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                    ></div>
                    <div
                        class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"
                    ></div>
                </div>
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-3"
                >
                    <div
                        class="h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl"
                    ></div>
                    <div
                        class="h-20 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl"
                    ></div>
                </div>
            </div>
        </div>

        <!-- ERROR MESSAGE -->
        <div v-else-if="loadError" class="max-w-7xl mx-auto">
            <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-red-200 dark:border-red-900 p-8 text-center"
            >
                <div
                    class="p-4 bg-red-100 dark:bg-red-900/30 rounded-full inline-flex mb-4"
                >
                    <svg
                        class="w-10 h-10 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <p
                    class="text-lg font-semibold text-red-600 dark:text-red-400 mb-2"
                >
                    Terjadi Kesalahan
                </p>
                <p class="text-gray-600 dark:text-gray-400">{{ loadError }}</p>
            </div>
        </div>

        <!-- KONTEN UTAMA IURAN -->
        <div v-else class="max-w-7xl mx-auto mt-8 space-y-6">
            <!-- Empty State -->
            <div
                v-if="iurans.length === 0"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center"
            >
                <div
                    class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full inline-flex mb-4"
                >
                    <svg
                        class="w-12 h-12 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                </div>
                <h3
                    class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                    Belum Ada Iuran
                </h3>
                <p class="text-gray-500 dark:text-gray-400">
                    Belum ada iuran yang aktif untuk anggota ini.
                </p>
            </div>

            <!-- Iuran List -->
            <IuranCard
                v-for="item in iurans"
                :key="item.id"
                :iuran="item"
                :read-only="true"
            />
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import BaseCard from "@/Components/Base/BaseCard.vue";
import IuranCard from "@/Components/Iuran/IuranCard.vue";
import api from "@/utils/axios";

const route = useRoute();

const anggota = ref(null);
const summary = ref({
    total_sudah_dibayar: 0,
    total_belum_dibayar: 0,
    total_jenis_iuran: 0,
});

const iurans = ref([]);
const isLoading = ref(true);
const loadError = ref(null);
const notFound = ref(false);

// format angka
function formatNumber(n) {
    if (n === null || n === undefined) return "0";
    return new Intl.NumberFormat("id-ID").format(Number(n));
}

// inisial avatar dari nama
const anggotaInitials = computed(() => {
    const name = anggota.value?.nama || "";
    const parts = name.split(" ");
    return parts.length
        ? (parts[0].charAt(0) + (parts[1]?.charAt(0) || "")).toUpperCase()
        : name.substring(0, 2).toUpperCase();
});

// 🆕 ADD: Alamat lengkap
const formattedAddress = computed(() => {
    const alamat = anggota.value?.alamat;
    if (!alamat) return "-";

    const parts = [];

    if (alamat.no_rumah) parts.push(`No. ${alamat.no_rumah}`);
    if (alamat.perum) parts.push(alamat.perum);
    if (alamat.village) parts.push(`Desa ${alamat.village}`);
    if (alamat.alamat_lainnya) parts.push(alamat.alamat_lainnya);

    return parts.join(", ");
});

// load data
async function loadIuran() {
    isLoading.value = true;
    loadError.value = null;
    notFound.value = false;

    try {
        const anggotaId = route.params.anggotaId;
        const res = await api.get(`/api/v1/iuran/anggota/${anggotaId}`);

        if (res.data?.success) {
            anggota.value = res.data.data.anggota || null;
            summary.value = res.data.data.summary || summary.value;
            iurans.value = res.data.data.iurans || [];
        } else {
            loadError.value = res.data?.message || "Gagal memuat data.";
        }
    } catch (e) {
        if (e.response?.status === 404) {
            notFound.value = true;
        } else {
            loadError.value =
                e.response?.data?.message || e.message || String(e);
        }
    } finally {
        setTimeout(() => {
            isLoading.value = false;
        }, 250);
    }
}

onMounted(() => {
    loadIuran();
});
</script>
