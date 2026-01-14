<template>
  <div class="grid grid-cols-6 gap-2">
    <div
      v-for="bulan in orderedMonths"
      :key="bulan"
      class="text-center py-2 rounded text-sm font-medium transition-colors cursor-default select-none"
      :class="{
        'bg-green-200 text-green-900 dark:bg-green-700 dark:text-green-100':
          status[bulan] === 'paid',
        'bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100':
          status[bulan] === 'unpaid',
        'ring-2 ring-cyan-500 ring-offset-1':
          selectable && status[bulan] === 'unpaid' && isSelected(bulan),
        'cursor-pointer':
          selectable && status[bulan] === 'unpaid'
      }"
      @click="handleClick(bulan)"
    >
      {{ bulan }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  status: Object,
  selectable: {
    type: Boolean,
    default: false,
  },
  selectedMonths: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(["toggle-month"])

const orderedMonths = computed(() => {
  return Object.keys(props.status).sort((a, b) => Number(a) - Number(b))
})

const isSelected = (bulan) => {
  return props.selectedMonths.includes(bulan)
}

const handleClick = (bulan) => {
  if (!props.selectable) return
  if (props.status[bulan] !== "unpaid") return
  emit("toggle-month", bulan)
}
</script>
