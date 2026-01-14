<template>
    <DashboardLayout>
        <div
            class="p-3 sm:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        >
            <div class="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6"
                >
                    <h1 class="text-lg sm:text-2xl font-bold text-white break-words">
                        Manajemen Peran & Permission
                    </h1>
                    <p class="text-xs sm:text-sm text-blue-100 mt-1">
                        Ketua / superadmin dapat mengatur role, permission, dan
                        override per user.
                    </p>
                </div>

                <!-- Cards role -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 space-y-4"
                >
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <p
                            class="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"
                        >
                            Ringkasan Role
                        </p>
                        <button
                            type="button"
                            class="text-xs text-cyan-600 hover:text-cyan-500 self-start sm:self-center"
                            @click="loadRoles"
                        >
                            Muat ulang
                        </button>
                    </div>

                    <div v-if="rolesLoading" class="grid gap-2 sm:gap-3 md:grid-cols-3">
                        <div
                            class="h-20 sm:h-24 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                        />
                        <div
                            class="h-20 sm:h-24 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                        />
                        <div
                            class="h-20 sm:h-24 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                        />
                    </div>

                    <div
                        v-else-if="rolesError"
                        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-3 text-xs sm:text-sm text-red-700 dark:text-red-200"
                    >
                        {{ rolesError }}
                    </div>

                    <div v-else class="grid gap-2 sm:gap-3 md:grid-cols-3">
                        <div
                            v-for="role in roles"
                            :key="role.id"
                            class="cursor-pointer space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                            :class="
                                selectedRole && selectedRole.id === role.id
                                    ? 'ring-2 ring-cyan-400'
                                    : ''
                            "
                            @click="selectRole(role)"
                        >
                            <p
                                class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 break-words"
                            >
                                Role:
                                <span class="uppercase">{{ role.name }}</span>
                            </p>
                            <p class="text-xs text-gray-600 dark:text-gray-300">
                                Pengguna:
                                <span class="font-semibold">{{
                                    role.users_count
                                }}</span>
                            </p>
                            <div
                                v-if="role.sample_users?.length"
                                class="text-[0.65rem] sm:text-[0.7rem] text-gray-500 dark:text-gray-400 space-y-0.5"
                            >
                                <p class="font-semibold">Contoh pengguna:</p>
                                <p
                                    v-for="u in role.sample_users"
                                    :key="u.id"
                                    class="truncate text-xs"
                                >
                                    {{ u.name }}
                                    <span
                                        v-if="u.anggota?.nama"
                                        class="text-gray-400 text-[0.6rem] sm:text-[0.65rem]"
                                    >
                                        {{ u.anggota.nama }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Detail role + permissions -->
                <div class="grid gap-3 sm:gap-4 md:grid-cols-2" v-if="selectedRole">
                    <!-- User dalam role -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 space-y-3"
                    >
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <p
                                class="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"
                            >
                                User dalam role: {{ selectedRole.name }}
                            </p>
                            <span class="text-xs text-gray-500 flex-shrink-0">
                                {{ roleUsers.length }} user
                            </span>
                        </div>

                        <div v-if="roleDetailLoading" class="space-y-2">
                            <div
                                class="h-8 sm:h-10 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                            />
                            <div
                                class="h-8 sm:h-10 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                            />
                        </div>

                        <div
                            v-else-if="roleDetailError"
                            class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-3 text-xs sm:text-sm text-red-700 dark:text-red-200"
                        >
                            {{ roleDetailError }}
                        </div>

                        <div
                            v-else-if="roleUsers.length === 0"
                            class="text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                        >
                            Belum ada user yang memiliki role ini.
                        </div>

                        <ul v-else class="space-y-2 text-xs sm:text-sm">
                            <li
                                v-for="user in roleUsers"
                                :key="user.id"
                                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2"
                            >
                                <p class="truncate min-w-0 flex-1">
                                    {{ user.name }}
                                    <span
                                        v-if="user.anggota?.nama"
                                        class="text-gray-400 text-[0.65rem] sm:text-[0.75rem]"
                                    >
                                        {{ user.anggota.nama }}
                                    </span>
                                </p>
                                <button
                                    type="button"
                                    class="text-xs text-red-600 hover:text-red-500 flex-shrink-0 text-left sm:text-right"
                                    @click="removeUser(user)"
                                >
                                    Hapus
                                </button>
                            </li>
                        </ul>
                    </div>

                    <!-- Permission role -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 space-y-3"
                    >
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <p
                                class="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"
                            >
                                Permission untuk role: {{ selectedRole.name }}
                            </p>
                            <BaseButton
                                size="xs"
                                variant="default"
                                class="w-full sm:w-auto"
                                :disabled="savingRolePermissions"
                                @click="saveRolePermissions"
                            >
                                <span v-if="savingRolePermissions"
                                    >Menyimpan...</span
                                >
                                <span v-else>Simpan</span>
                            </BaseButton>
                        </div>

                        <div v-if="roleDetailLoading" class="space-y-2">
                            <div
                                class="h-8 sm:h-10 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                            />
                            <div
                                class="h-8 sm:h-10 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                            />
                        </div>

                        <div
                            v-else-if="rolePermissionsByGroupKeys.length === 0"
                            class="text-sm text-gray-500 dark:text-gray-400"
                        >
                            Belum ada permission yang terdaftar.
                        </div>

                        <div
                            v-else
                            class="space-y-3 max-h-[380px] overflow-y-auto scroll-thin pr-1"
                        >
                            <div
                                v-for="group in rolePermissionsByGroupKeys"
                                :key="group"
                                class="space-y-1"
                            >
                                <p
                                    class="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"
                                >
                                    {{ group }}
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    <label
                                        v-for="perm in rolePermissionsByGroup[
                                            group
                                        ]"
                                        :key="perm.name"
                                        class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                            v-model="perm.assigned"
                                        />
                                        <span>{{ perm.name }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <p
                            v-if="roleSaveMessage"
                            class="text-xs text-emerald-600"
                        >
                            {{ roleSaveMessage }}
                        </p>
                        <p v-if="roleSaveError" class="text-xs text-rose-600">
                            {{ roleSaveError }}
                        </p>
                    </div>
                </div>

                <!-- Explorer Permission & User Override -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4"
                >
                    <div class="flex items-center justify-between">
                        <p
                            class="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"
                        >
                            Explorer Permission & Override User
                        </p>
                    </div>

                    <div class="grid gap-4 md:grid-cols-2">
                        <!-- Permission list -->
                        <div class="space-y-3">
                            <div class="flex items-center gap-2">
                                <input
                                    v-model="permissionSearch"
                                    type="text"
                                    placeholder="Cari permission..."
                                    class="w-full px-3 py-2 text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                />
                            </div>

                            <div v-if="permissionsLoading" class="space-y-2">
                                <div
                                    class="h-8 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                                />
                                <div
                                    class="h-8 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                                />
                            </div>

                            <div
                                v-else-if="permissionsError"
                                class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-3 text-xs text-red-700 dark:text-red-200"
                            >
                                {{ permissionsError }}
                            </div>

                            <div
                                v-else
                                class="max-h-[340px] overflow-y-auto scroll-thin pr-1 space-y-2 text-xs"
                            >
                                <div
                                    v-for="perm in filteredPermissions"
                                    :key="perm.name"
                                    class="flex items-center justify-between gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    :class="
                                        selectedPermission &&
                                        selectedPermission.name === perm.name
                                            ? 'bg-gray-100 dark:bg-gray-800'
                                            : ''
                                    "
                                    @click="selectPermission(perm)"
                                >
                                    <div class="flex-1 min-w-0">
                                        <p
                                            class="font-semibold text-gray-800 dark:text-gray-100 truncate"
                                        >
                                            {{ perm.name }}
                                        </p>
                                        <p
                                            class="text-[0.7rem] text-gray-500 dark:text-gray-400"
                                        >
                                            Group: {{ perm.group }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Permission detail: roles & users -->
                        <div class="space-y-3">
                            <div
                                v-if="!selectedPermission"
                                class="text-xs text-gray-500 dark:text-gray-400"
                            >
                                Pilih satu permission di sebelah kiri untuk
                                melihat role dan user yang memilikinya.
                            </div>

                            <div v-else>
                                <p
                                    class="text-xs font-semibold text-gray-800 dark:text-gray-100"
                                >
                                    Permission: {{ selectedPermission.name }}
                                </p>
                                <p
                                    class="text-[0.7rem] text-gray-500 dark:text-gray-400 mb-2"
                                >
                                    Group: {{ selectedPermission.group }}
                                </p>

                                <div
                                    v-if="permissionHoldersLoading"
                                    class="space-y-2"
                                >
                                    <div
                                        class="h-8 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                                    />
                                    <div
                                        class="h-8 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                                    />
                                </div>

                                <div
                                    v-else-if="permissionHoldersError"
                                    class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-3 text-xs text-red-700 dark:text-red-200"
                                >
                                    {{ permissionHoldersError }}
                                </div>

                                <div v-else class="space-y-3 text-xs">
                                    <div>
                                        <p
                                            class="font-semibold text-gray-700 dark:text-gray-200 mb-1"
                                        >
                                            Role yang memiliki permission ini
                                        </p>
                                        <div
                                            v-if="permissionRoles.length === 0"
                                            class="text-[0.7rem] text-gray-500 dark:text-gray-400"
                                        >
                                            Tidak ada role yang memiliki
                                            permission ini.
                                        </div>
                                        <ul v-else class="space-y-1">
                                            <li
                                                v-for="r in permissionRoles"
                                                :key="r.id"
                                                class="flex items-center justify-between gap-2"
                                            >
                                                <span
                                                    class="uppercase text-gray-800 dark:text-gray-100"
                                                >
                                                    {{ r.name }}
                                                </span>
                                                <span
                                                    class="text-[0.7rem] text-gray-500 dark:text-gray-400"
                                                >
                                                    {{ r.users_count }} user
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div
                                        class="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700"
                                    >
                                        <p
                                            class="font-semibold text-gray-700 dark:text-gray-200 mb-1"
                                        >
                                            User dengan permission langsung
                                        </p>
                                        <div
                                            v-if="permissionUsers.length === 0"
                                            class="text-[0.7rem] text-gray-500 dark:text-gray-400"
                                        >
                                            Belum ada user yang memiliki
                                            permission ini secara langsung
                                            (override).
                                        </div>
                                        <ul v-else class="space-y-1">
                                            <li
                                                v-for="u in permissionUsers"
                                                :key="u.id"
                                                class="flex items-center justify-between gap-2"
                                            >
                                                <div class="flex-1 min-w-0">
                                                    <p
                                                        class="text-gray-800 dark:text-gray-100 truncate"
                                                    >
                                                        {{ u.name }}
                                                    </p>
                                                    <p
                                                        class="text-[0.7rem] text-gray-500 dark:text-gray-400 truncate"
                                                    >
                                                        {{ u.email }}
                                                        <span
                                                            v-if="
                                                                u.anggota?.nama
                                                            "
                                                        >
                                                            •
                                                            {{ u.anggota.nama }}
                                                        </span>
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    class="text-[0.7rem] text-cyan-600 hover:text-cyan-500"
                                                    @click="
                                                        openUserPermissions(u)
                                                    "
                                                >
                                                    Atur
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal pengaturan permission per user -->
                <div
                    v-if="userPermissionModalOpen && currentUser"
                    class="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
                >
                    <div class="w-full max-w-3xl mx-4">
                        <BaseCard
                            class="space-y-4 max-h-[80vh] overflow-y-auto scroll-thin"
                        >
                            <div
                                class="flex items-center justify-between gap-3"
                            >
                                <div>
                                    <p
                                        class="text-sm font-semibold text-gray-900 dark:text-gray-100"
                                    >
                                        Pengaturan permission user
                                    </p>
                                    <p
                                        class="text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        {{ currentUser.name }} •
                                        {{ currentUser.email }}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    class="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                                    @click="closeUserPermissions"
                                >
                                    Tutup
                                </button>
                            </div>

                            <div
                                v-if="userPermissionsLoading"
                                class="space-y-2"
                            >
                                <div
                                    class="h-8 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                                />
                                <div
                                    class="h-8 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
                                />
                            </div>

                            <div
                                v-else-if="userPermissionsError"
                                class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-3 text-xs text-red-700 dark:text-red-200"
                            >
                                {{ userPermissionsError }}
                            </div>

                            <div v-else class="space-y-3">
                                <p
                                    class="text-xs text-gray-600 dark:text-gray-300"
                                >
                                    Permission dari role bersifat baca-saja.
                                    Centang permission di bawah untuk memberikan
                                    <span class="font-semibold"
                                        >permission langsung</span
                                    >
                                    ke user ini.
                                </p>

                                <div class="grid gap-3 md:grid-cols-2">
                                    <div
                                        v-for="group in userPermissionsByGroupKeys"
                                        :key="group"
                                        class="space-y-1"
                                    >
                                        <p
                                            class="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400"
                                        >
                                            {{ group }}
                                        </p>
                                        <div class="space-y-1">
                                            <label
                                                v-for="perm in userPermissionsByGroup[
                                                    group
                                                ]"
                                                :key="perm.name"
                                                class="flex items-center justify-between gap-2 text-[0.72rem] px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700"
                                            >
                                                <div class="flex-1 min-w-0">
                                                    <p
                                                        class="truncate text-gray-800 dark:text-gray-100"
                                                    >
                                                        {{ perm.name }}
                                                    </p>
                                                    <p
                                                        class="text-[0.65rem] text-gray-500 dark:text-gray-400"
                                                    >
                                                        <span
                                                            v-if="
                                                                perm.from_roles
                                                            "
                                                            >via role</span
                                                        >
                                                        <span
                                                            v-else
                                                            class="italic text-gray-400"
                                                            >bukan dari
                                                            role</span
                                                        >
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    class="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                                    v-model="perm.direct"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700"
                                >
                                    <div class="space-x-2">
                                        <button
                                            type="button"
                                            class="text-[0.75rem] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                                            @click="clearUserDirectPermissions"
                                        >
                                            Hapus semua override user ini
                                        </button>
                                    </div>
                                    <BaseButton
                                        size="xs"
                                        variant="default"
                                        :disabled="savingUserPermissions"
                                        @click="saveUserPermissions"
                                    >
                                        <span v-if="savingUserPermissions"
                                            >Menyimpan...</span
                                        >
                                        <span v-else>Simpan perubahan</span>
                                    </BaseButton>
                                </div>

                                <p
                                    v-if="userPermissionsSaveMessage"
                                    class="text-xs text-emerald-600"
                                >
                                    {{ userPermissionsSaveMessage }}
                                </p>
                                <p
                                    v-if="userPermissionsSaveError"
                                    class="text-xs text-rose-600"
                                >
                                    {{ userPermissionsSaveError }}
                                </p>
                            </div>
                        </BaseCard>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import BaseCard from "@/Components/Base/BaseCard.vue";
import BaseButton from "@/Components/Base/BaseButton.vue";
import api from "@/utils/axios";

const roles = ref([]);
const rolesLoading = ref(false);
const rolesError = ref(null);

const selectedRole = ref(null);
const roleUsers = ref([]);
const rolePermissions = ref([]);
const roleDetailLoading = ref(false);
const roleDetailError = ref(null);
const savingRolePermissions = ref(false);
const roleSaveMessage = ref("");
const roleSaveError = ref("");

const permissions = ref([]);
const permissionsLoading = ref(false);
const permissionsError = ref(null);
const permissionSearch = ref("");
const selectedPermission = ref(null);
const permissionRoles = ref([]);
const permissionUsers = ref([]);
const permissionHoldersLoading = ref(false);
const permissionHoldersError = ref(null);

const userPermissionModalOpen = ref(false);
const currentUser = ref(null);
const userPermissionsRaw = ref([]);
const userPermissionsLoading = ref(false);
const userPermissionsError = ref(null);
const savingUserPermissions = ref(false);
const userPermissionsSaveMessage = ref("");
const userPermissionsSaveError = ref("");

const formatGroupKey = (group) => group || "Lainnya";

const rolePermissionsByGroup = computed(() => {
    const grouped = {};
    for (const perm of rolePermissions.value) {
        const key = formatGroupKey(perm.group);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(perm);
    }
    return grouped;
});

const rolePermissionsByGroupKeys = computed(() =>
    Object.keys(rolePermissionsByGroup.value)
);

const filteredPermissions = computed(() => {
    const q = permissionSearch.value.trim().toLowerCase();
    if (!q) return permissions.value;
    return permissions.value.filter(
        (p) =>
            p.name.toLowerCase().includes(q) ||
            p.group.toLowerCase().includes(q)
    );
});

const userPermissionsByGroup = computed(() => {
    const grouped = {};
    for (const perm of userPermissionsRaw.value) {
        const key = formatGroupKey(perm.group);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(perm);
    }
    return grouped;
});

const userPermissionsByGroupKeys = computed(() =>
    Object.keys(userPermissionsByGroup.value)
);

const loadRoles = async () => {
    rolesLoading.value = true;
    rolesError.value = null;

    try {
        const res = await api.get("/api/v1/admin/roles/summary");
        if (res.data?.success) {
            roles.value = res.data.data || [];
        } else {
            rolesError.value =
                res.data?.message || "Gagal memuat ringkasan role.";
        }
    } catch (e) {
        rolesError.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal memuat ringkasan role.";
    } finally {
        rolesLoading.value = false;
    }
};

const loadRoleDetail = async (roleId) => {
    if (!roleId) return;
    roleDetailLoading.value = true;
    roleDetailError.value = null;
    roleUsers.value = [];
    rolePermissions.value = [];
    roleSaveMessage.value = "";
    roleSaveError.value = "";

    try {
        const res = await api.get(`/api/v1/admin/roles/${roleId}/detail`);
        if (res.data?.success) {
            roleUsers.value = res.data.data.users || [];
            rolePermissions.value = (res.data.data.permissions || []).map(
                (p) => ({ ...p })
            );
        } else {
            roleDetailError.value =
                res.data?.message || "Gagal memuat detail role.";
        }
    } catch (e) {
        roleDetailError.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal memuat detail role.";
    } finally {
        roleDetailLoading.value = false;
    }
};

const selectRole = (role) => {
    selectedRole.value = role;
    loadRoleDetail(role.id);
};

const saveRolePermissions = async () => {
    if (!selectedRole.value) return;

    savingRolePermissions.value = true;
    roleSaveMessage.value = "";
    roleSaveError.value = "";

    const names = rolePermissions.value
        .filter((p) => p.assigned)
        .map((p) => p.name);

    try {
        const res = await api.put(
            `/api/v1/admin/roles/${selectedRole.value.id}/permissions`,
            {
                permissions: names,
            }
        );
        if (res.data?.success) {
            roleSaveMessage.value =
                res.data?.message || "Permission role berhasil disimpan.";
        } else {
            roleSaveError.value =
                res.data?.message || "Gagal menyimpan permission role.";
        }
    } catch (e) {
        roleSaveError.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal menyimpan permission role.";
    } finally {
        savingRolePermissions.value = false;
    }
};

const loadPermissions = async () => {
    permissionsLoading.value = true;
    permissionsError.value = null;
    permissions.value = [];

    try {
        const res = await api.get("/api/v1/admin/permissions");
        if (res.data?.success) {
            permissions.value = res.data.data || [];
        } else {
            permissionsError.value =
                res.data?.message || "Gagal memuat daftar permission.";
        }
    } catch (e) {
        permissionsError.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal memuat daftar permission.";
    } finally {
        permissionsLoading.value = false;
    }
};

const selectPermission = async (perm) => {
    selectedPermission.value = perm;
    permissionRoles.value = [];
    permissionUsers.value = [];
    permissionHoldersLoading.value = true;
    permissionHoldersError.value = null;

    try {
        const res = await api.get(
            `/api/v1/admin/permissions/${encodeURIComponent(perm.name)}/holders`
        );
        if (res.data?.success) {
            permissionRoles.value = res.data.data.roles || [];
            permissionUsers.value = res.data.data.users || [];
        } else {
            permissionHoldersError.value =
                res.data?.message || "Gagal memuat pemilik permission.";
        }
    } catch (e) {
        permissionHoldersError.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal memuat pemilik permission.";
    } finally {
        permissionHoldersLoading.value = false;
    }
};

const openUserPermissions = async (user) => {
    currentUser.value = user;
    userPermissionModalOpen.value = true;
    userPermissionsRaw.value = [];
    userPermissionsLoading.value = true;
    userPermissionsError.value = null;
    userPermissionsSaveMessage.value = "";
    userPermissionsSaveError.value = "";

    try {
        const res = await api.get(`/api/v1/admin/users/${user.id}/permissions`);
        if (res.data?.success) {
            userPermissionsRaw.value = (res.data.data.permissions || []).map(
                (p) => ({ ...p })
            );
        } else {
            userPermissionsError.value =
                res.data?.message || "Gagal memuat permission user.";
        }
    } catch (e) {
        userPermissionsError.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal memuat permission user.";
    } finally {
        userPermissionsLoading.value = false;
    }
};

const closeUserPermissions = () => {
    userPermissionModalOpen.value = false;
    currentUser.value = null;
};

const clearUserDirectPermissions = () => {
    userPermissionsRaw.value = userPermissionsRaw.value.map((p) => ({
        ...p,
        direct: false,
    }));
};

const saveUserPermissions = async () => {
    if (!currentUser.value) return;

    savingUserPermissions.value = true;
    userPermissionsSaveMessage.value = "";
    userPermissionsSaveError.value = "";

    const names = userPermissionsRaw.value
        .filter((p) => p.direct)
        .map((p) => p.name);

    try {
        const res = await api.put(
            `/api/v1/admin/users/${currentUser.value.id}/permissions`,
            {
                permissions: names,
            }
        );
        if (res.data?.success) {
            userPermissionsSaveMessage.value =
                res.data?.message || "Permission user berhasil disimpan.";
        } else {
            userPermissionsSaveError.value =
                res.data?.message || "Gagal menyimpan permission user.";
        }
    } catch (e) {
        userPermissionsSaveError.value =
            e.response?.data?.message ||
            e.message ||
            "Gagal menyimpan permission user.";
    } finally {
        savingUserPermissions.value = false;
    }
};

onMounted(() => {
    loadRoles();
    loadPermissions();
});
</script>
