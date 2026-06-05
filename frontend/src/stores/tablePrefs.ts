/**
 * stores/tablePrefs.ts
 *
 * Menyimpan preferensi UI per tabel — view mode, hidden columns.
 * Setiap tabel diidentifikasi oleh `tableId` (string unik, misal "invoice-receipts").
 * State di-persist ke localStorage via zustand/persist.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ViewMode } from "../components/ui/Table";

// ── Per-table preferences ──────────────────────────────────────
interface TablePref {
  viewMode: ViewMode;
  hiddenColumns: string[];
}

// ── Store state ────────────────────────────────────────────────
interface TablePrefsState {
  prefs: Record<string, TablePref>;
  setViewMode: (tableId: string, viewMode: ViewMode) => void;
  setHiddenColumns: (tableId: string, hiddenColumns: string[]) => void;
  resetPrefs: (tableId: string) => void;
}

// ── Default per-table pref ─────────────────────────────────────
const defaultPref = (): TablePref => ({
  viewMode: "table",
  hiddenColumns: [],
});

// ── Store ──────────────────────────────────────────────────────
export const useTablePrefsStore = create<TablePrefsState>()(
  persist(
    (set) => ({
      prefs: {},

      setViewMode: (tableId, viewMode) =>
        set((state) => ({
          prefs: {
            ...state.prefs,
            [tableId]: {
              ...(state.prefs[tableId] ?? defaultPref()),
              viewMode,
            },
          },
        })),

      setHiddenColumns: (tableId, hiddenColumns) =>
        set((state) => ({
          prefs: {
            ...state.prefs,
            [tableId]: {
              ...(state.prefs[tableId] ?? defaultPref()),
              hiddenColumns,
            },
          },
        })),

      resetPrefs: (tableId) =>
        set((state) => {
          const next = { ...state.prefs };
          delete next[tableId];
          return { prefs: next };
        }),
    }),
    {
      name: "table-prefs",
    },
  ),
);