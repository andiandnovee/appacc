// Path: src/stores/stnkVendors.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface StnkVendorEntry {
  id: string;           // uuid lokal
  kode_vendor: string;  // SAP vendor code
  nama_vendor: string;
  jenis: "STNK" | "KIER";
  tarif_pph: number;    // persen, misal 2
  gl_account_pph: string; // GL akun PPh, misal "11302001"
}

interface StnkVendorState {
  vendors: StnkVendorEntry[];
  selectedVendorId: string | null; // vendor aktif untuk jurnal RO

  addVendor: (v: Omit<StnkVendorEntry, "id">) => void;
  updateVendor: (id: string, patch: Partial<Omit<StnkVendorEntry, "id">>) => void;
  removeVendor: (id: string) => void;
  selectVendor: (id: string | null) => void;
}

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────
export const useStnkVendors = create<StnkVendorState>()(
  persist(
    (set) => ({
      vendors: [],
      selectedVendorId: null,

      addVendor: (v) =>
        set((state) => ({
          vendors: [...state.vendors, { ...v, id: uuidv4() }],
        })),

      updateVendor: (id, patch) =>
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === id ? { ...v, ...patch } : v,
          ),
        })),

      removeVendor: (id) =>
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== id),
          selectedVendorId:
            state.selectedVendorId === id ? null : state.selectedVendorId,
        })),

      selectVendor: (id) => set({ selectedVendorId: id }),
    }),
    {
      name: "stnk-vendors",
    },
  ),
);