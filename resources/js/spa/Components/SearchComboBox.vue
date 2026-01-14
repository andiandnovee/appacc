<script setup>
import { ref, watch } from "vue";
import api from "@/utils/axios";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";

const props = defineProps({
  modelValue: [Number, String], // id/primary key yang dipilih
  url: { type: String, required: true }, // endpoint pencarian (contoh: "/anggota/search")
  variant: { type: String, default: "full" }, // "full" | "mini"
  labelField: { type: String, default: "nama" }, // field utama untuk ditampilkan
  extraFields: { type: Array, default: () => ["email", "nik"] }, // field tambahan untuk "full"
  avatarField: { type: String, default: "foto" }, // kalau ada foto/avatar
});

const emit = defineEmits(["update:modelValue"]);

const query = ref("");
const options = ref([]);
const selected = ref(null);

watch(query, async (newVal) => {
  if (newVal.length < 2) {
    options.value = [];
    return;
  }
  let { data } = await api.get(props.url, {
    params: { q: newVal },
  });
  options.value = data;
});

watch(selected, (val) => {
  emit("update:modelValue", val ? val.id : null);
});
</script>

<template>
  <Combobox v-model="selected" as="div" class="relative">
    <!-- Input -->
    <div class="relative w-full">
      <ComboboxInput
        class="w-full border rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        :displayValue="(opt) => (opt ? opt[props.labelField] : '')"
        @input="query = $event.target.value"
        placeholder="Ketik untuk mencari..."
      />

      <!-- Options -->
      <ComboboxOptions
        v-if="options.length"
        class="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-56 overflow-auto"
      >
        <ComboboxOption
          v-for="opt in options"
          :key="opt.id"
          :value="opt"
          as="div"
          class="cursor-pointer select-none flex items-center p-2 hover:bg-indigo-50"
        >
          <!-- Avatar (kalau ada) -->
          <template v-if="variant === 'full' || variant === 'mini'">
            <img
              v-if="opt[props.avatarField]"
              :src="opt[props.avatarField]"
              class="h-8 w-8 rounded-full object-cover border mr-2"
              alt="avatar"
            />
            <div
              v-else
              class="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-bold mr-2"
            >
              {{ opt[props.labelField]?.charAt(0).toUpperCase() }}
            </div>
          </template>

          <!-- Text untuk variant mini -->
          <span v-if="variant === 'mini'" class="text-gray-800">
            {{ opt[props.labelField] }}
          </span>

          <!-- Text untuk variant full -->
          <div v-else class="flex flex-col">
            <span class="font-medium text-gray-800">{{ opt[props.labelField] }}</span>
            <span
              v-for="field in props.extraFields"
              :key="field"
              class="text-xs text-gray-500"
            >
              {{ opt[field] }}
            </span>
          </div>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>
