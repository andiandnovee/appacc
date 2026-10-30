import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DebetNotaRow {
  id: string;
  senderCompanyCode: string;
  senderBusinessArea: string;
  senderDocument: string;
  postingDate: string;
  period: string;
  fiscalYear: string;
  senderVendorCode: string;
  receiverCompanyCode: string;
  receiverCompanyName: string;
  receiverBusinessArea: string;
  description: string;
  amount: number;
  glAccountId: number | null;
  costCenterCode: string;
}

interface DebetNotaDraftState {
  fileName: string;
  rows: DebetNotaRow[];
  setUpload: (fileName: string, rows: DebetNotaRow[]) => void;
  updateRow: (id: string, patch: Partial<Pick<DebetNotaRow, "glAccountId" | "costCenterCode">>) => void;
  clear: () => void;
}

export const useDebetNotaDraft = create<DebetNotaDraftState>()(
  persist(
    (set) => ({
      fileName: "",
      rows: [],
      setUpload: (fileName, rows) => set({ fileName, rows }),
      updateRow: (id, patch) =>
        set((state) => ({
          rows: state.rows.map((row) => row.id === id ? { ...row, ...patch } : row),
        })),
      clear: () => set({ fileName: "", rows: [] }),
    }),
    { name: "debet-nota-draft" },
  ),
);
