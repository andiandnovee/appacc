<script setup>
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps({
  show: Boolean,
  title: String,
  message: String,
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <TransitionRoot :show="show" as="template">
    <Dialog @close="$emit('close')" class="relative z-50">
      
      <!-- Background blur -->
      <TransitionChild
        as="template"
        enter="duration-200 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-150 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <!-- Dialog panel -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          as="template"
          enter="duration-200 ease-out"
          enter-from="opacity-0 translate-y-2 scale-95"
          enter-to="opacity-100 translate-y-0 scale-100"
          leave="duration-150 ease-in"
          leave-from="opacity-100 translate-y-0 scale-100"
          leave-to="opacity-0 translate-y-2 scale-95"
        >
          <DialogPanel
            class="w-full max-w-md rounded-xl p-6
                   bg-white dark:bg-[#2b2d31]
                   text-gray-800 dark:text-gray-200
                   shadow-xl transition"
          >
            <Dialog.Title class="text-lg font-bold mb-3">
              {{ title }}
            </Dialog.Title>

            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {{ message }}
            </p>

            <div class="flex justify-end space-x-3">
              <button
                @click="$emit('close')"
                class="px-4 py-2 rounded bg-gray-200 dark:bg-[#3a3c40] text-gray-700 dark:text-gray-300 hover:opacity-80"
              >
                Batal
              </button>

              <button
                @click="$emit('confirm')"
                class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>

          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
