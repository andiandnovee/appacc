// stores/filterReceipt.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  selectedCompany: string;
  selectedVendor: string;
  selectedYear: string;
  selectedStage: string;
  selectedIsPkp: boolean | null; // ← tambah
  autoRefreshEnabled: boolean;
  pollIntervalMinutes: number;
  receiptDate: string;
  setReceiptDate: (value: string) => void;
  setSelectedCompany: (value: string) => void;
  setSelectedVendor: (value: string) => void;
  setSelectedYear: (value: string) => void;
  setSelectedStage: (value: string) => void;
  setSelectedIsPkp: (value: boolean | null) => void; // ← tambah
  setAutoRefreshEnabled: (value: boolean) => void;
  setPollIntervalMinutes: (value: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      selectedCompany: "",
      selectedVendor: "",
      selectedYear: new Date().getFullYear().toString(),
      selectedStage: "",
      selectedIsPkp: null,
      autoRefreshEnabled: true,
      pollIntervalMinutes: 5,
      receiptDate: new Date().toISOString().split("T")[0], // initial saja, setelah itu dari store
      setReceiptDate: (value) => set({ receiptDate: value }),
      setSelectedCompany: (value) => set({ selectedCompany: value }),
      setSelectedVendor: (value) => set({ selectedVendor: value }),
      setSelectedYear: (value) => set({ selectedYear: value }),
      setSelectedStage: (value) => set({ selectedStage: value }),
      setSelectedIsPkp: (value) => set({ selectedIsPkp: value }),
      setAutoRefreshEnabled: (value) => set({ autoRefreshEnabled: value }),
      setPollIntervalMinutes: (value) => set({ pollIntervalMinutes: value }),
      resetFilters: () =>
        set({
          selectedCompany: "",
          selectedVendor: "",
          selectedYear: new Date().getFullYear().toString(),
          selectedStage: "",
          selectedIsPkp: null,
        }),
    }),
    {
      name: "receipt-filters", // key di localStorage
      // optional: hanya simpan field tertentu
      // partialize: (state) => ({ selectedCompany: state.selectedCompany, ... }),
    },
  ),
);
