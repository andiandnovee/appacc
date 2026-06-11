// stores/filterVehicleLogbook.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterVehicleLogbookState {
  selectedCompany: string;
  selectedBusArea: string;
  selectedVehicleId: string;
  month: string;
  year: string;

  setSelectedCompany: (value: string) => void;
  setSelectedBusArea: (value: string) => void;
  setSelectedVehicleId: (value: string) => void;
  setMonth: (value: string) => void;
  setYear: (value: string) => void;
  resetFilters: () => void;
}

const now = new Date();

export const useFilterVehicleLogbook = create<FilterVehicleLogbookState>()(
  persist(
    (set) => ({
      selectedCompany: "",
      selectedBusArea: "",
      selectedVehicleId: "",
      month: String(now.getMonth() + 1),
      year: String(now.getFullYear()),

      setSelectedCompany: (value) =>
        set({ selectedCompany: value, selectedBusArea: "", selectedVehicleId: "" }),
      setSelectedBusArea: (value) =>
        set({ selectedBusArea: value, selectedVehicleId: "" }),
      setSelectedVehicleId: (value) => set({ selectedVehicleId: value }),
      setMonth: (value) => set({ month: value }),
      setYear: (value) => set({ year: value }),
      resetFilters: () =>
        set({
          selectedCompany: "",
          selectedBusArea: "",
          selectedVehicleId: "",
          month: String(new Date().getMonth() + 1),
          year: String(new Date().getFullYear()),
        }),
    }),
    {
      name: "vehicle-logbook-filters",
    },
  ),
);