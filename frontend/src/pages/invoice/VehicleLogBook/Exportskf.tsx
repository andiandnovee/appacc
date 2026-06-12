// exportSKF.ts
// Path: frontend/src/pages/vehicles/exportSKF.ts
//
// Generate file untuk SKF (Statistical Key Figures) — alokasi internal
// biaya kendaraan ke cost center penerima, berdasarkan data
// /vehicles/logbook/export-skf.
//
// Dua aksi:
//  - Copy to clipboard : hanya kolom C, D, E, F (tab-delimited)
//  - Export Excel      : kolom A-F + header row (row 1), data mulai row 3

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ─────────────────────────────────────────────
// TYPES (subset dari ZfPayload — cocok dengan response export-skf)
// ─────────────────────────────────────────────
export interface SkfDetailRow {
  start_km: number;
  end_km: number;
  km: number;
  cost_center: string | null;
  cost_center_name: string | null;
  description: string;
}

export interface SkfHeader {
  periode: string; // "4-2026"
}

export interface SkfVehicle {
  plate_number: string;
  description: string;
  cost_center: string; // CC kendaraan, contoh "3512147003"
}

export interface SkfPayload {
  vehicle: SkfVehicle;
  header: SkfHeader;
  details: SkfDetailRow[]; // sudah difilter hanya yang punya cost_center
}

export interface ExportSkfParams {
  payloads: SkfPayload[];
  postingDate: Date; // diambil dari input posting date di summary
}

type SkfCell = string | number | null;
type SkfRow = SkfCell[];

export const SKF_HEADERS = [
  "Document date",
  "Posting date",
  "Rec. CCtr",
  "SKF",
  "Total Qty",
  "Text",
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Date -> "dd.mm.yyyy" */
function formatDateSAP(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

/** "3512147003" -> "147003" (6 digit terakhir CC kendaraan) */
function vehicleSkf(vehicleCostCenter: string): string {
  return vehicleCostCenter.slice(-6);
}

/** km integer -> "623,00" (format Total Qty di SAP) */
function formatQty(km: number): string {
  return `${Math.round(km)},00`;
}

/** Nama file dasar (tanpa ekstensi) */
function buildFileBaseName(month: number, year: number): string {
  const mm = String(month).padStart(2, "0");
  return `SKF-${mm}${year}`;
}

// ─────────────────────────────────────────────
// SHARED ROW BUILDER
// Satu sumber kebenaran untuk urutan & isi kolom A-F.
// Tidak ada kredit/debet — satu baris output per detail.
// ─────────────────────────────────────────────
export function buildSkfRows({
  payloads,
  postingDate,
}: ExportSkfParams): SkfRow[] {
  const rows: SkfRow[] = [];
  const postingDateStr = formatDateSAP(postingDate);

  payloads.forEach((payload) => {
    const skf = vehicleSkf(payload.vehicle.cost_center);

    for (const d of payload.details) {
      rows.push([
        postingDateStr,        // A - Document date
        postingDateStr,        // B - Posting date
        d.cost_center,         // C - Rec. CCtr (cost center penerima)
        skf,                    // D - SKF (6 digit terakhir CC kendaraan)
        formatQty(d.km),        // E - Total Qty
        d.description,          // F - Text
      ]);
    }
  });

  return rows;
}

// ─────────────────────────────────────────────
// EXPORT: Excel (.xlsx)
// Row 1 = header kolom, row 2 = kosong, data mulai row 3
// (mengikuti format file contoh SKF-3500-03-2026.xlsx)
// ─────────────────────────────────────────────
export async function exportSkfExcel(
  params: ExportSkfParams & { month: number; year: number },
): Promise<void> {
  const { month, year } = params;
  const rows = buildSkfRows(params);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("ZC0006_AGRI");

  ws.addRow(SKF_HEADERS);
  ws.getRow(1).font = { bold: true };
  ws.addRow([]); // row 2 kosong

  rows.forEach((row) => ws.addRow(row));

  ws.columns.forEach((col, i) => {
    const wideCols = [6]; // F - Text
    col.width = wideCols.includes(i + 1) ? 28 : 14;
  });

  const buf = await wb.xlsx.writeBuffer();
  const fileName = `${buildFileBaseName(month, year)}.xlsx`;
  saveAs(
    new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
}

// ─────────────────────────────────────────────
// COPY TO CLIPBOARD
// Hanya kolom C, D, E, F — tab-delimited, tanpa header.
// ─────────────────────────────────────────────
export async function copySkfToClipboard(
  params: ExportSkfParams,
): Promise<number> {
  const rows = buildSkfRows(params);

  const lines = rows.map((row) => {
    const [, , c, d, e, f] = row;
    return [c, d, e, f]
      .map((cell) => (cell === null || cell === undefined ? "" : String(cell)))
      .join("\t");
  });

  const content = lines.join("\n");
  await navigator.clipboard.writeText(content);

  return rows.length;
}