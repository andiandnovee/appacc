/**
 * stores/filterF53.ts
 *
 * Zustand store untuk filter state di F53HelperPage.
 * headerSuffix disimpan per busArea ID supaya saat user ganti busArea
 * lalu kembali, nilai terakhir muncul kembali.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterF53State {
  selectedCompany: string;
  selectedStage: string;
  selectedBusArea: string;
  selectedVendor: string;
  postingDate: string;
incrementHeaderSuffix: (busAreaId: string) => void;
  /**
   * headerSuffix disimpan per busArea ID.
   * key  : busArea ID (string)
   * value: suffix terakhir yang diisi user
   */
  headerSuffixMap: Record<string, string>;

  setSelectedCompany: (value: string) => void;
  setSelectedStage: (value: string) => void;
  setSelectedBusArea: (value: string) => void;
  setSelectedVendor: (value: string) => void;
  setPostingDate: (value: string) => void;

  /** Simpan suffix untuk busArea tertentu */
  setHeaderSuffix: (busAreaId: string, suffix: string) => void;

  /** Ambil suffix untuk busArea tertentu (default "") */
  getHeaderSuffix: (busAreaId: string) => string;

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

      setHeaderSuffix: (busAreaId, suffix) =>
        set((state) => ({
          headerSuffixMap: { ...state.headerSuffixMap, [busAreaId]: suffix },
        })),
      /** Increment suffix untuk busArea tertentu, zero-pad 6 digit */
      incrementHeaderSuffix: (busAreaId: string) =>
        set((state) => {
          const current = state.headerSuffixMap[busAreaId] ?? "000000";
          const next = (parseInt(current, 10) + 1).toString().padStart(6, "0");
          return {
            headerSuffixMap: { ...state.headerSuffixMap, [busAreaId]: next },
          };
        }),
      getHeaderSuffix: (busAreaId) => get().headerSuffixMap[busAreaId] ?? "",

      resetFilters: () =>
        set({
          selectedCompany: "",
          selectedStage: "",
          selectedBusArea: "",
          selectedVendor: "",
          postingDate: todayIso(),
          // headerSuffixMap sengaja TIDAK direset — biar nilai per-busArea tetap tersimpan
        }),
    }),
    {
      name: "f53-filters",
      // headerSuffixMap ikut persist supaya nilai tersimpan antar session
    },
  ),
);
