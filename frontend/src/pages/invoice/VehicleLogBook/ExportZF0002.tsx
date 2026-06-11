// exportZF0002.ts
// Path: frontend/src/pages/vehicles/exportZF0002.ts
//
// Generate file untuk upload ke tcode ZF0002_AGRI di SAP.
// Berisi jurnal biaya kendaraan ke CUSTOMER (debet per line biaya,
// kredit total per kendaraan ke GL alokasi 73730001).
//
// Dua format output, sumber data sama (buildZf0002Rows):
//  - Excel (.xlsx)  : dengan header kolom, untuk preview/arsip
//  - Text (.txt)    : tanpa header, tab-delimited, siap upload ke SAP

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ─────────────────────────────────────────────
// TYPES (cocok dengan response /vehicles/logbook/export-zf0002)
// ─────────────────────────────────────────────
export interface ZfDetailRow {
  start_km: number;
  end_km: number;
  km: number;
  cost_center: string | null;
  cost_center_name: string | null;
  customer_code: string | null;
  customer_name: string | null;
  description: string;
  cost_amount: number;
}

export interface ZfHeader {
  periode: string; // "4-2026"
  total_km: number;
  total_cost: number;
  no_voucher: string; // "042026-3512147016"
}

export interface ZfVehicle {
  plate_number: string;
  description: string;
  cost_center: string;
}

export interface ZfPayload {
  vehicle: ZfVehicle;
  header: ZfHeader;
  details: ZfDetailRow[]; // sudah difilter hanya yang punya customer_code
  is_balanced: boolean;
}

export interface ExportZf0002Params {
  payloads: ZfPayload[];
  companyCode: string; // contoh "3500"
  businessArea: string; // contoh "3512"
  month: number;
  year: number;
  postingDate: Date; // input user, default hari ini
}

// Satu cell bisa string, number, atau null (kosong)
type ZfCell = string | number | null;
type ZfRow = ZfCell[];

export const ZF0002_HEADERS = [
  "No", "Company Code", "Posting Date", "Period", "Document Date",
  "Document Type", "Currency", "Exchange Rate", "Reference", "Document Header Text",
  "Debet/Credit", "GL Account", "Vendor Account", "Customer Account", "SP GL Ind",
  "Amount in Doc", "Business Area", "Cost Center", "Profit Center", "WBS",
  "Assignment", "Text", "Tax Code", "Trading Partner", "Term of Payment",
  "Base Line Date", "Number of Days", "Value Date", "Transaction type",
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** "12.345.678" -> 12345678 (integer, tanpa titik/koma) */
function toIntAmount(val: number): number {
  return Math.round(val);
}

/** Date -> "dd.mm.yyyy" */
function formatDateSAP(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

/** bulan numerik 2 digit, contoh 4 -> "04" */
function periodStr(month: number): string {
  return String(month).padStart(2, "0");
}

// ─────────────────────────────────────────────
// SHARED ROW BUILDER
// Dipakai oleh export Excel & Text — satu sumber kebenaran
// untuk urutan & isi kolom A-AC.
// ─────────────────────────────────────────────
export function buildZf0002Rows({
  payloads,
  companyCode,
  businessArea,
  month,
  postingDate,
}: Omit<ExportZf0002Params, "year">): ZfRow[] {
  const rows: ZfRow[] = [];

  const postingDateStr = formatDateSAP(postingDate);
  const periodVal = periodStr(month);

  payloads.forEach((payload, idx) => {
    const no = idx + 1;
    const plate = payload.vehicle.plate_number;
    const periodeLabel = payload.header.periode; // "4-2026"
    const [, yearStr] = periodeLabel.split("-");
    const mmYYYY = `${periodVal}-${yearStr}`;
    const refDoc = `${plate}-${mmYYYY}`;
    const headerText = `ALK ${refDoc}`;
    const noVoucher = payload.header.no_voucher;

    let debetTotal = 0;

    // ── Baris DEBET — satu per detail dengan customer_code ──
    for (const d of payload.details) {
      const amount = toIntAmount(d.cost_amount);
      debetTotal += amount;

      const text50 = `ALK ${plate}-${d.description}`;

      rows.push([
        no,                          // A
        Number(companyCode),         // B
        postingDateStr,              // C
        periodVal,                   // D
        postingDateStr,              // E
        "YA",                        // F
        "IDR",                       // G
        null,                        // H
        noVoucher,                   // I
        headerText,                  // J
        "D",                         // K
        null,                        // L
        null,                        // M
        Number(d.customer_code),     // N
        null,                        // O
        amount,                      // P
        Number(businessArea),        // Q
        null,                        // R - kosong untuk biaya
        Number(businessArea),        // S
        null,                        // T
        "DN",                        // U
        text50,                      // V
        null,                        // W - kosong untuk debet
        null, null, null, null, null, null, // X-AC
      ]);
    }

    // ── Baris KREDIT — total per kendaraan ──
    const totalKmAlloc = payload.details.reduce((s, d) => s + d.km, 0);
    const assignmentCredit = `ALK ${plate}`;
    const text50Credit = `ALK ${plate}-${totalKmAlloc}KM`;

    rows.push([
      no,                            // A
      Number(companyCode),           // B
      postingDateStr,                // C
      periodVal,                     // D
      postingDateStr,                // E
      "YA",                          // F
      "IDR",                         // G
      null,                          // H
      noVoucher,                     // I
      headerText,                    // J
      "C",                           // K
      73730001,                      // L
      null,                          // M
      null,                          // N
      null,                          // O
      debetTotal,                    // P - total biaya kendaraan ini
      Number(businessArea),          // Q
      Number(payload.vehicle.cost_center), // R
      Number(businessArea),          // S
      null,                          // T
      assignmentCredit,              // U
      text50Credit,                  // V
      "I0",                          // W
      null, null, null, null, null, null, // X-AC
    ]);
  });

  return rows;
}

/** Nama file dasar (tanpa ekstensi) */
function buildFileBaseName(companyCode: string, month: number, year: number): string {
  return `ZF0002_AGRI-${companyCode}-${periodStr(month)}-${year}`;
}

// ─────────────────────────────────────────────
// EXPORT: Excel (.xlsx) — dengan header, untuk preview/arsip
// ─────────────────────────────────────────────
export async function exportZf0002Excel(params: ExportZf0002Params): Promise<void> {
  const { companyCode, month, year } = params;
  const rows = buildZf0002Rows(params);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Sheet1");

  ws.addRow(ZF0002_HEADERS);
  ws.getRow(1).font = { bold: true };

  rows.forEach((row) => ws.addRow(row));

  // Column widths (biar enak dilihat sebelum upload)
  ws.columns.forEach((col, i) => {
    const wideCols = [9, 10, 14, 22]; // I, J, N, V
    col.width = wideCols.includes(i + 1) ? 28 : 12;
  });

  const buf = await wb.xlsx.writeBuffer();
  const fileName = `${buildFileBaseName(companyCode, month, year)}.xlsx`;
  saveAs(
    new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
}

// ─────────────────────────────────────────────
// EXPORT: Text (.txt) — tanpa header, tab-delimited
// Siap upload langsung ke tcode ZF0002_AGRI.
// ─────────────────────────────────────────────
export function exportZf0002Text(params: ExportZf0002Params): void {
  const { companyCode, month, year } = params;
  const rows = buildZf0002Rows(params);

  const lines = rows.map((row) =>
    row
      .map((cell) => (cell === null || cell === undefined ? "" : String(cell)))
      .join("\t"),
  );

  // Gunakan CRLF — umum dipakai untuk file upload SAP di Windows
  const content = lines.join("\r\n") + "\r\n";

  const fileName = `${buildFileBaseName(companyCode, month, year)}.txt`;
  saveAs(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
    fileName,
  );
}

// ─────────────────────────────────────────────
// Backward-compat alias (kalau ada pemanggilan lama)
// ─────────────────────────────────────────────
export const exportZf0002Customer = exportZf0002Excel;