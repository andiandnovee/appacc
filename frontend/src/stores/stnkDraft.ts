// Path: src/stores/stnkDraft.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// ─────────────────────────────────────────────
// TYPES — mirror InputItemDraft di index.tsx
// ─────────────────────────────────────────────
export interface DraftItem {
  id: string;
  plateInput: string;
  lookupState: "idle" | "loading" | "found" | "not_found";
  vehicle: {
    id: number;
    plate_number: string;
    vehicle_type: "R4" | "R2";
    business_area_code: string;
    cost_center: string | null;
    description: string;
  } | null;
  manualBusArea: string;
  manualType: "R4" | "R2";
  biayaPerpj: number;
  admPerpj: number;
  jasaPerpj: number;
  dendaPerpj: number;
}

export interface StnkDraftHeader {
  companyCode: string;
  companyId: number | null;
  postingDate: string;
  documentDate: string;
  noInvoice: string;
  docHeaderText: string;
  period: string;
}

interface StnkDraftState {
  header: StnkDraftHeader;
  drafts: DraftItem[];

  setHeader: (patch: Partial<StnkDraftHeader>) => void;
  setDrafts: (drafts: DraftItem[]) => void;
  addDraft: () => void;
  updateDraft: (id: string, patch: Partial<DraftItem>) => void;
  removeDraft: (id: string) => void;
  resetAll: () => void;
}

const emptyHeader = (): StnkDraftHeader => ({
  companyCode: "",
  companyId: null,
  postingDate: "",
  documentDate: "",
  noInvoice: "",
  docHeaderText: "",
  period: "",
});

export const emptyDraftItem = (): DraftItem => ({
  id: uuidv4(),
  plateInput: "",
  lookupState: "idle",
  vehicle: null,
  manualBusArea: "",
  manualType: "R4",
  biayaPerpj: 0,
  admPerpj: 0,
  jasaPerpj: 0,
  dendaPerpj: 0,
});

export const useStnkDraft = create<StnkDraftState>()(
  persist(
    (set) => ({
      header: emptyHeader(),
      drafts: [emptyDraftItem()],

      setHeader: (patch) =>
        set((state) => ({ header: { ...state.header, ...patch } })),

      setDrafts: (drafts) => set({ drafts }),

      addDraft: () =>
        set((state) => ({ drafts: [...state.drafts, emptyDraftItem()] })),

      updateDraft: (id, patch) =>
        set((state) => ({
          drafts: state.drafts.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),

      removeDraft: (id) =>
        set((state) => ({
          drafts:
            state.drafts.length > 1
              ? state.drafts.filter((d) => d.id !== id)
              : state.drafts,
        })),

      resetAll: () =>
        set({ header: emptyHeader(), drafts: [emptyDraftItem()] }),
    }),
    {
      name: "stnk-draft",
      // lookupState selalu reset ke idle saat restore (vehicle data mungkin stale)
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.drafts = state.drafts.map((d) => ({
            ...d,
            lookupState: d.vehicle ? "found" : "idle",
          }));
        }
      },
    },
  ),
);
