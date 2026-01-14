<template>
  <div
    @click="handleCardClick"
    :class="[
      'p-5 rounded-lg shadow transition-all cursor-pointer',
      'bg-white dark:bg-gray-800',
      'text-gray-900 dark:text-gray-100',
      isSelected ? 'ring-2 ring-teal-500 border-teal-500' : 'hover:shadow-lg'
    ]"
  >
    <!-- HEADER -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h2 class="text-lg font-semibold">{{ iuran.nama_iuran }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">
          {{ iuran.periode }}
        </p>
      </div>

      <!-- INFO KANAN ATAS -->
      <div class="text-right">
        <p class="text-sm text-gray-400">Terbayar</p>

        <!-- BULANAN -->
        <p
          v-if="iuran.periode === 'bulanan'"
          class="text-lg font-semibold text-green-500"
        >
          Rp {{ formatNumber(totalPaid) }}
          <span class="text-sm text-gray-500 dark:text-gray-400">
            ({{ paidCount }}/{{ totalMonths }})
          </span>
        </p>

        <!-- TAHUNAN & SEKALI -->
        <p
          v-else
          class="text-lg font-semibold text-green-500"
        >
          Rp {{ formatNumber(paidNominal) }}
          <span class="text-sm text-gray-500 dark:text-gray-400">
            ({{ percent }}%)
          </span>
        </p>
      </div>
    </div>

    <!-- BULANAN -->
    <div v-if="iuran.periode === 'bulanan'">
      <div @click.stop>
        <MonthGrid
          :status="iuran.status_bulan"
          :selectable="!readOnly"
          :selected-months="selectedMonths"
          @toggle-month="toggleMonth"
        />
      </div>

      <!-- Form pembayaran kolektor (bulanan) -->
      <div
        v-if="!readOnly && (isSelected || effectiveSelectedMonths.length > 0)"
        @click.stop
        class="mt-4 border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 space-y-2 text-sm"
      >
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs uppercase tracking-[0.2em] text-gray-500">
            Bulan dipilih
          </span>
          <span v-if="effectiveSelectedMonths.length === 0" class="text-xs text-gray-400">
            Klik bulan merah untuk memilih.
          </span>
          <div v-else class="flex flex-wrap gap-1">
            <span
              v-for="b in effectiveSelectedMonths"
              :key="b"
              class="px-2 py-0.5 rounded-full text-xs bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200"
            >
              {{ b }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Total Bayar (Rp)</label>
            <input
              :value="formatNumber(totalBayarBulanan)"
              type="text"
              disabled
              class="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Tanggal Terima</label>
            <input
              v-model="tanggalBayarBulanan"
              type="date"
              class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Catatan</label>
            <input
              v-model="catatanBulanan"
              type="text"
              placeholder="(opsional)"
              class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">&nbsp;</label>
            <button
              type="button"
              class="w-full px-4 py-2 rounded text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-60 transition-colors"
              :disabled="effectiveSelectedMonths.length === 0"
              @click="onPayBulanan"
            >
              Bayar
            </button>
          </div>
        </div>

        <p v-if="effectiveSelectedMonths.length === 0" class="text-xs text-gray-400 mt-2">
          Pilih minimal satu bulan terlebih dahulu.
        </p>
      </div>
    </div>

    <!-- TAHUNAN / SEKALI — PROGRESS BAR -->
    <div
      v-if="iuran.periode === 'tahunan' || iuran.periode === 'sekali'"
      class="mt-5 space-y-3"
    >
      <!-- BADGE STATUS -->
      <span
        class="px-3 py-1 rounded-full text-xs font-semibold"
        :class="statusBadge.color"
      >
        {{ statusBadge.label }}
      </span>

      <!-- TERBAYAR -->
      <div class="text-sm flex justify-between">
        <span>Terbayar: Rp {{ formatNumber(paidNominal) }}</span>
        <span>{{ percent }}%</span>
      </div>

      <!-- PROGRESS BAR -->
      <div class="w-full bg-red-900 h-3 rounded overflow-hidden flex">
        <div
          class="bg-green-500 h-3 transition-all duration-700 ease-out"
          :style="{ width: percent + '%' }"
        ></div>
      </div>

      <!-- TOTAL -->
      <div class="text-xs text-gray-400 dark:text-gray-500">
        Total Kewajiban: Rp {{ formatNumber(totalNominal) }}
      </div>

      <!-- Form pembayaran kolektor (sekali / tahunan) -->
      <div
        v-if="!readOnly && isSelected"
        @click.stop
        class="mt-4 border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 space-y-2 text-sm"
      >
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Jumlah Bayar (Rp)</label>
            <input
              v-model.number="onceAmount"
              type="number"
              min="0"
              class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
            <p class="mt-1 text-[11px] text-gray-400">
              Sisa: Rp {{ formatNumber(remainingNominal) }}
            </p>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Tanggal Terima</label>
            <input
              v-model="tanggalBayarOnce"
              type="date"
              class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Catatan</label>
            <input
              v-model="catatanOnce"
              type="text"
              placeholder="(opsional)"
              class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">&nbsp;</label>
            <button
              type="button"
              class="w-full px-4 py-2 rounded text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-60 transition-colors"
              :disabled="onceAmount <= 0"
              @click="onPayOnce"
            >
              Bayar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- RIWAYAT PEMBAYARAN -->
    <div v-if="iuran.payments.length" class="mt-4">
      <p class="font-semibold mb-1">Riwayat Pembayaran:</p>

      <ul class="space-y-1">
        <li
          v-for="pay in iuran.payments"
          :key="pay.id"
          class="text-sm text-gray-600 dark:text-gray-300"
        >
          • {{ pay.tanggal_bayar }} — Rp {{ formatNumber(pay.jumlah) }}
          <span v-if="pay.periode_bulan">
            (bulan {{ pay.periode_bulan }})
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import MonthGrid from "@/Components/Iuran/MonthGrid.vue"
import OnceStatus from "@/Components/Iuran/OnceStatus.vue"

const props = defineProps({
  iuran: Object,
  readOnly: {
    type: Boolean,
    default: true,
  },
  anggotaId: {
    type: Number,
    default: null,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["pay-bulanan", "pay-once", "select"])

const handleCardClick = () => {
  if (!props.readOnly) {
    emit("select", props.iuran.id)
  }
}

// =====================
// BULANAN
// =====================
const totalMonths = 12
const paidCount = computed(() => props.iuran.payments.length)
const totalPaid = computed(() =>
  props.iuran.payments.reduce((t, p) => t + Number(p.jumlah || 0), 0)
)

const selectedMonths = ref([])

const effectiveSelectedMonths = computed(() => {
  return selectedMonths.value.filter(
    (b) => props.iuran.status_bulan?.[b] === "unpaid"
  )
})

const totalBayarBulanan = computed(() => {
  return effectiveSelectedMonths.value.length * Number(props.iuran.jumlah || 0)
})

const tanggalBayarBulanan = ref(new Date().toISOString().slice(0, 10))
const catatanBulanan = ref("")

const toggleMonth = (bulan) => {
  if (selectedMonths.value.includes(bulan)) {
    selectedMonths.value = selectedMonths.value.filter((b) => b !== bulan)
  } else {
    selectedMonths.value = [...selectedMonths.value, bulan]
    // Auto-select card ketika bulan diklik
    emit("select", props.iuran.id)
  }
}

const onPayBulanan = () => {
  if (!props.anggotaId) return
  if (effectiveSelectedMonths.value.length === 0) return

  emit("pay-bulanan", {
    anggotaId: props.anggotaId,
    refIuranId: props.iuran.id,
    months: effectiveSelectedMonths.value,
    amountPerMonth: Number(props.iuran.jumlah || 0),
    tanggalBayar: tanggalBayarBulanan.value,
    catatan: catatanBulanan.value,
  })
}

// =====================
// TAHUNAN & SEKALI
// =====================
const totalNominal = computed(() => Number(props.iuran.jumlah || 0))
const paidNominal = computed(() =>
  props.iuran.payments.reduce((t, p) => t + Number(p.jumlah || 0), 0)
)
const remainingNominal = computed(() =>
  Math.max(0, Number(totalNominal.value || 0) - Number(paidNominal.value || 0))
)
const percent = computed(() => {
  const p = (paidNominal.value / totalNominal.value) * 100
  return p > 100 ? 100 : Math.round(p)
})

const onceAmount = ref(0)
const tanggalBayarOnce = ref(new Date().toISOString().slice(0, 10))
const catatanOnce = ref("")

watch(
  remainingNominal,
  (val) => {
    if (onceAmount.value <= 0) {
      onceAmount.value = val
    }
  },
  { immediate: true }
)

const onPayOnce = () => {
  if (!props.anggotaId) return
  if (onceAmount.value <= 0) return

  emit("pay-once", {
    anggotaId: props.anggotaId,
    refIuranId: props.iuran.id,
    jumlah: Number(onceAmount.value || 0),
    tanggalBayar: tanggalBayarOnce.value,
    catatan: catatanOnce.value,
  })
}

// =====================
// BADGE STATUS
// =====================
const statusBadge = computed(() => {
  if (percent.value >= 100)
    return { label: "Lunas", color: "bg-green-600 text-white" }

  if (percent.value >= 50)
    return { label: "Dalam Proses", color: "bg-yellow-500 text-black" }

  return { label: "Belum Lunas", color: "bg-red-600 text-white" }
})

function formatNumber(n) {
  return new Intl.NumberFormat("id-ID").format(n)
}
</script>
