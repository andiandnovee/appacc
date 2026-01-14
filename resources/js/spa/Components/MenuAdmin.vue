<script setup>
import { onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { menuItems } from "@/config/menuItems";
import MenuLink from "./MenuLink.vue";
defineProps({ collapsed: Boolean });

const auth = useAuthStore();

onMounted(async () => {
    if (!auth.loaded) {
        try {
            await auth.fetchUser();
        } catch (err) {
        }
    }
});

// Fungsi memeriksa apakah user punya permission
function hasPermission(item, userPermissions) {
    if (!item.permissions || item.permissions.length === 0) return true;
    return item.permissions.some((p) => userPermissions.includes(p));
}

// Filter per group
const filteredMenu = computed(() => {
    const userPermissions = auth.permissions || [];

    return menuItems
        .map((group) => {
            const allowedChildren = group.children.filter((child) =>
                hasPermission(child, userPermissions)
            );

            // hanya tampil bila group punya menu yg boleh dilihat user
            if (allowedChildren.length === 0) return null;

            return {
                group: group.group,
                children: allowedChildren,
            };
        })
        .filter((g) => g !== null);
});
</script>

<template>
    <nav class="flex flex-col">
        <!-- Loop setiap group -->
        <div
            v-for="(group, index) in filteredMenu"
            :key="group.group"
        >
            <!-- Divider kecuali group pertama -->
            <div v-if="index > 0" class="h-px bg-gray-200 dark:bg-gray-700 mx-4 my-3"></div>
            
            <!-- Judul group -->
            <div
                v-if="!collapsed"
                class="px-6 py-3"
            >
                <span class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ group.group }}
                </span>
            </div>

            <!-- Menu children -->
            <div class="flex flex-col">
                <MenuLink
                    v-for="child in group.children"
                    :key="child.route"
                    :name="child.name"
                    :route="child.route"
                    :icon="child.icon"
                    :active="$route.path === child.route"
                    :collapsed="collapsed"
                />
            </div>
        </div>
    </nav>
</template>

<style scoped>
nav {
    background-color: transparent;
}
</style>
