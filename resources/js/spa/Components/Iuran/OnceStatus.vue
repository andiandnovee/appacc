<template>
  <div class="mt-2">
    <p class="font-semibold">
      Status:
      <span
        :class="status === 'paid'
          ? 'text-green-500'
          : 'text-red-400'"
      >
        {{ status === 'paid' ? 'Sudah Dibayar' : 'Belum Dibayar' }}
      </span>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  status: String
})
</script>
