<template>
    <transition name="fade">
        <div
            v-if="state.show"
            class="fixed top-6 right-6 glass-panel px-5 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 z-50 min-w-[220px]"
            :style="boxStyle"
        >
            {{ state.message }}
        </div>
    </transition>
</template>

<script setup>
import { computed } from "vue";
import { notifyState as state } from "@/utils/notify";

const boxStyle = computed(() => {
    const base = {
        color: "var(--color-text-light)",
        background:
            "linear-gradient(120deg, rgba(15, 184, 201, 0.12), rgba(192, 132, 252, 0.16))",
        border: "1px solid var(--color-border-light)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 15px 30px rgba(15,23,42,0.12)",
    };

    if (state.type === "success") {
        base.background =
            "linear-gradient(120deg, rgba(34,197,94,0.18), rgba(14,165,233,0.16))";
    }

    if (state.type === "error") {
        base.background =
            "linear-gradient(120deg, rgba(239,68,68,0.25), rgba(248,113,113,0.2))";
        base.color = "#fff";
    }

    if (state.type === "info") {
        base.background =
            "linear-gradient(120deg, rgba(14,165,233,0.15), rgba(59,130,246,0.12))";
    }

    return base;
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
