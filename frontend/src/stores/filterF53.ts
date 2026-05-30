/**
 * stores/filterF53.ts
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterF53State {
  selectedCompany: string;
  selectedStage: string;
  selectedBusArea: string;
  selectedVendor: string;
  postingDate: string;
  screenSkip: boolean; // skip confirmation screen di SAP (/n*F-53)
  docSkip: boolean; // skip doc number field (RF05A-XPOS1=X)
  headerSuffixMap: Record<string, string>;

  setSelectedCompany: (value: string) => void;
  setSelectedStage: (value: string) => void;
  setSelectedBusArea: (value: string) => void;
  setSelectedVendor: (value: string) => void;
  setPostingDate: (value: string) => void;
  setScreenSkip: (value: boolean) => void;
  setDocSkip: (value: boolean) => void;
  setHeaderSuffix: (busAreaId: string, suffix: string) => void;
  getHeaderSuffix: (busAreaId: string) => string;
  incrementHeaderSuffix: (busAreaId: string) => void;
  resetFilters: () => void;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export const useFilterF53Store = create<FilterF53State>()(
  persist(
    (set, get) => ({
      selectedCompany: "",
      selectedStage: "",
      selectedBusArea: "",
      selectedVendor: "",
      postingDate: todayIso(),
      screenSkip: false,
      docSkip: false,
      headerSuffixMap: {},

      setSelectedCompany: (value) =>
        set({
          selectedCompany: value,
          selectedBusArea: "",
          selectedVendor: "",
        }),
      setSelectedStage: (value) => set({ selectedStage: value }),
      setSelectedBusArea: (value) =>
        set({ selectedBusArea: value, selectedVendor: "" }),
      setSelectedVendor: (value) => set({ selectedVendor: value }),
      setPostingDate: (value) => set({ postingDate: value }),
      setScreenSkip: (value) => set({ screenSkip: value }),
      setDocSkip: (value) => set({ docSkip: value }),

      setHeaderSuffix: (busAreaId, suffix) =>
        set((state) => ({
          headerSuffixMap: { ...state.headerSuffixMap, [busAreaId]: suffix },
        })),

      getHeaderSuffix: (busAreaId) => get().headerSuffixMap[busAreaId] ?? "",

      incrementHeaderSuffix: (busAreaId) =>
        set((state) => {
          const current = state.headerSuffixMap[busAreaId] ?? "000000";
          const next = (parseInt(current, 10) + 1).toString().padStart(6, "0");
          return {
            headerSuffixMap: { ...state.headerSuffixMap, [busAreaId]: next },
          };
        }),

      resetFilters: () =>
        set({
          selectedCompany: "",
          selectedStage: "",
          selectedBusArea: "",
          selectedVendor: "",
          postingDate: todayIso(),
          // headerSuffixMap, screenSkip, docSkip TIDAK direset — preferensi user
        }),
    }),
    { name: "f53-filters" },
  ),
);
