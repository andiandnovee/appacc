// stores/filterReceipt.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  selectedCompany: string;
  selectedVendor: string;
  selectedYear: string;
  selectedStage: string;
  setSelectedCompany: (value: string) => void;
  setSelectedVendor: (value: string) => void;
  setSelectedYear: (value: string) => void;
  setSelectedStage: (value: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      selectedCompany: '',
      selectedVendor: '',
      selectedYear: new Date().getFullYear().toString(),
      selectedStage: '',
      setSelectedCompany: (value) => set({ selectedCompany: value }),
      setSelectedVendor: (value) => set({ selectedVendor: value }),
      setSelectedYear: (value) => set({ selectedYear: value }),
      setSelectedStage: (value) => set({ selectedStage: value }),
      resetFilters: () =>
        set({
          selectedCompany: '',
          selectedVendor: '',
          selectedYear: new Date().getFullYear().toString(),
          selectedStage: '',
        }),
    }),
    {
      name: 'receipt-filters', // key di localStorage
      // optional: hanya simpan field tertentu
      // partialize: (state) => ({ selectedCompany: state.selectedCompany, ... }),
    }
  )
);