<template>
  <BaseCard>
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
      <div class="min-w-0 flex-1">
        <div class="text-base sm:text-lg font-medium break-words">{{ anggota.nama }}</div>
        <div class="text-xs sm:text-sm text-muted">
          {{ anggota.kode ? `#${anggota.kode}` : '' }}
        </div>
      </div>

      <BaseBadge :variant="badgeVariant" class="flex-shrink-0">
        {{ anggota.status }}
      </BaseBadge>
    </div>

    <hr class="my-2 sm:my-3" />

    <div class="text-xs sm:text-sm space-y-2">

      <!-- Alamat -->
      <div v-if="anggota.alamat">
        <div class="font-medium">Alamat</div>
        <div class="break-words">
          {{ anggota.alamat.perum ?? '' }}
          {{ anggota.alamat.no_rumah ? ('No. ' + anggota.alamat.no_rumah) : '' }}
        </div>

        <div v-if="anggota.alamat.village" class="text-muted text-xs">
          {{ anggota.alamat.village }}
        </div>
      </div>

      <!-- Kontak -->
      <div>
        <div class="font-medium">Kontak</div>
        <div class="break-all">{{ anggota.no_hp ?? '-' }}</div>
        <div class="text-xs text-muted truncate">{{ anggota.email ?? '-' }}</div>
      </div>

    </div>

    <div class="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
      <div class="flex gap-1 sm:gap-2 w-full sm:w-auto">
        <BaseButton size="sm" class="flex-1 sm:flex-initial" @click="$emit('detail', anggota.id)">
          Detail
        </BaseButton>

        <BaseButton
          size="sm"
          variant="outline"
          class="flex-1 sm:flex-initial"
          @click="$emit('delete', anggota.id)"
        >
          Hapus
        </BaseButton>
      </div>

      <div class="text-xs text-muted flex-shrink-0">
        Updated: {{ formatDate(anggota.updated_at) }}
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/Components/Base/BaseCard.vue'
import BaseBadge from '@/Components/Base/BaseBadge.vue'
import BaseButton from '@/Components/Base/BaseButton.vue'

const props = defineProps({
  anggota: {
    type: Object,
    required: true
  }
})

/**
 * Menentukan warna badge sesuai status.
 */
const badgeVariant = computed(() => {
  if (!props.anggota.status) return 'default'
  return props.anggota.status === 'aktif' ? 'success' : 'warning'
})

/**
 * Format tanggal sederhana.
 */
function formatDate(dt) {
  if (!dt) return '-'
  const d = new Date(dt)
  return d.toLocaleString()
}
</script>

<style scoped>
.text-muted {
  color: var(--color-icon-light);
}

.dark .text-muted {
  color: var(--color-icon-dark);
}
</style>
