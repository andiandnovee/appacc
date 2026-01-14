<template>
    <transition name="modal-fade">
        <div
            v-if="state.show"
            class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <div
                class="glass-panel max-w-sm w-full rounded-3xl border border-[var(--glass-border)] shadow-2xl"
            >
                <!-- Header -->
                <div
                    class="px-6 py-4 border-b border-[var(--glass-border)]/70"
                >
                    <h3
                        class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                        Konfirmasi
                    </h3>
                </div>

                <!-- Message -->
                <div class="px-6 py-5 text-gray-700 dark:text-gray-200 leading-relaxed">
                    {{ state.message }}
                </div>

                <!-- Actions -->
                <div
                    class="px-6 py-4 border-t border-[var(--glass-border)]/70 flex gap-3 justify-end"
                >
                    <button
                        @click="cancel"
                        class="px-4 py-2 rounded-2xl border border-transparent text-gray-600 dark:text-gray-300 hover:border-[var(--color-border-light)] hover:bg-white/40 dark:hover:bg-white/10 font-medium transition-all duration-200"
                    >
                        Batal
                    </button>
                    <button
                        @click="ok"
                        :class="[
                            'px-4 py-2 rounded-2xl text-white font-semibold tracking-wide transition-all duration-200',
                            state.type === 'danger'
                                ? 'bg-gradient-to-r from-rose-500 to-red-500 shadow-lg shadow-rose-500/20'
                                : 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-lg shadow-cyan-500/30',
                        ]"
                    >
                        {{ state.okText || "OK" }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import {
    confirmState as state,
    confirmOk,
    confirmCancel,
} from "@/utils/confirm";

const ok = async () => {
    await confirmOk();
};

const cancel = () => {
    confirmCancel();
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
