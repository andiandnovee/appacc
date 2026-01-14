<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { menuItems } from "@/config/menuItems";
import { RouterLink } from "vue-router";
import { ChevronDown } from "lucide-vue-next";

const auth = useAuthStore();
const openMenu = ref(null);

function hasPermission(item, perms) {
    if (!item.permissions || item.permissions.length === 0) return true;
    return item.permissions.some((p) => perms.includes(p));
}

const menuGroups = computed(() => {
    const perms = auth.permissions || [];

    return menuItems
        .map((group) => {
            const allowed = group.children.filter((c) =>
                hasPermission(c, perms)
            );
            if (!allowed.length) return null;

            return { group: group.group, children: allowed };
        })
        .filter(Boolean);
});
</script>

<template>
    <nav class="flex items-center gap-2">
        <!-- Loop setiap group -->
        <div
            v-for="group in menuGroups"
            :key="group.group"
            class="relative"
            @mouseenter="openMenu = group.group"
            @mouseleave="openMenu = null"
        >
            <!-- tombol menu group -->
            <button
                class="px-3 py-2 text-xs font-semibold tracking-[0.3em] uppercase text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-[var(--color-border-light)] rounded-2xl transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                :aria-expanded="openMenu === group.group"
            >
                <span>{{ group.group }}</span>
                <ChevronDown
                    :class="[
                        'h-4 w-4 transition-transform duration-200',
                        openMenu === group.group ? 'rotate-180' : '',
                    ]"
                />
            </button>

            <!-- dropdown menu -->
            <div
                :class="[
                    'absolute left-0 mt-2 w-56 rounded-2xl shadow-2xl border border-[var(--color-border-light)]/60 backdrop-blur-xl bg-[var(--glass-surface)] text-[var(--color-text-light)] z-40 overflow-hidden',
                    'transition-all duration-200 origin-top',
                    openMenu === group.group
                        ? 'opacity-100 visible scale-y-100'
                        : 'opacity-0 invisible scale-y-95',
                ]"
            >
                <div class="py-1">
                    <RouterLink
                        v-for="child in group.children"
                        :key="child.route"
                        :to="child.route"
                        class="block px-4 py-2.5 text-sm transition-all duration-150 hover:text-[var(--color-text-light)] dark:hover:text-white hover:bg-[var(--color-menu-active-light)]/80 rounded-xl"
                    >
                        {{ child.name }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </nav>
</template>
