// exportZF0002.ts
// Path: frontend/src/pages/vehicles/exportZF0002.ts
//
// Generate file Excel untuk upload ke tcode ZF0002_AGRI di SAP.
// Berisi jurnal biaya kendaraan ke CUSTOMER (debet per line biaya,
// kredit total per kendaraan ke GL alokasi 73730001).

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
// MAIN EXPORT FUNCTION
// ─────────────────────────────────────────────
export async function exportZf0002Customer({
  payloads,
  companyCode,
  businessArea,
  month,
  year,
  postingDate,
}: ExportZf0002Params): Promise<void> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Sheet1");

  // ── Header row (29 kolom, A–AC) ───────────────
  const headers = [
    "No",
    "Company Code",
    "Posting Date",
    "Period",
    "Document Date",
    "Document Type",
    "Currency",
    "Exchange Rate",
    "Reference",
    "Document Header Text",
    "Debet/Credit",
    "GL Account",
    "Vendor Account",
    "Customer Account",
    "SP GL Ind",
    "Amount in Doc",
    "Business Area",
    "Cost Center",
    "Profit Center",
    "WBS",
    "Assignment",
    "Text",
    "Tax Code",
    "Trading Partner",
    "Term of Payment",
    "Base Line Date",
    "Number of Days",
    "Value Date",
    "Transaction type",
  ];
  ws.addRow(headers);
  ws.getRow(1).font = { bold: true };

  const postingDateStr = formatDateSAP(postingDate);
  const periodVal = periodStr(month);
  const mmYYYY = `${periodVal}-${year}`;

  payloads.forEach((payload, idx) => {
    const no = idx + 1;
    const plate = payload.vehicle.plate_number;
    const refDoc = `${plate}-${mmYYYY}`;
    const headerText = `ALK ${refDoc}`;
    const noVoucher = payload.header.no_voucher;

    let debetTotal = 0;

    // ── Baris DEBET — satu per detail dengan customer_code ──
    for (const d of payload.details) {
      const amount = toIntAmount(d.cost_amount);
      debetTotal += amount;

      const text50 = `ALK ${plate}-${d.description}`;

      ws.addRow([
        no, // A
        Number(companyCode), // B
        postingDateStr, // C
        periodVal, // D
        postingDateStr, // E
        "YA", // F
        "IDR", // G
        null, // H
        noVoucher, // I
        headerText, // J
        "D", // K
        null, // L
        null, // M
        Number(d.customer_code), // N
        null, // O
        amount, // P
        Number(businessArea), // Q
        null, // R - kosong untuk biaya
        Number(businessArea), // S
        null, // T
        "DN", // U
        text50, // V
        null, // W - kosong untuk debet
        null,
        null,
        null,
        null,
        null,
        null, // X-AC
      ]);
    }

    // ── Baris KREDIT — total per kendaraan ──
    const totalKmAlloc = payload.details.reduce((s, d) => s + d.km, 0);
    const assignmentCredit = `ALK ${plate}`;
    const text50Credit = `ALK ${plate}-${totalKmAlloc}KM`;

    ws.addRow([
      no, // A
      Number(companyCode), // B
      postingDateStr, // C
      periodVal, // D
      postingDateStr, // E
      "YA", // F
      "IDR", // G
      null, // H
      noVoucher, // I
      headerText, // J
      "C", // K
      73730001, // L
      null, // M
      null, // N
      null, // O
      debetTotal, // P - total biaya kendaraan ini
      Number(businessArea), // Q
      Number(payload.vehicle.cost_center), // R
      Number(businessArea), // S
      null, // T
      assignmentCredit, // U
      text50Credit, // V
      "I0", // W
      null,
      null,
      null,
      null,
      null,
      null, // X-AC
    ]);
  });

  // ── Column widths (biar enak dilihat sebelum upload) ──
  ws.columns.forEach((col, i) => {
    // Beberapa kolom teks butuh lebih lebar
    const wideCols = [9, 10, 14, 22]; // I, J, N(label?), V (1-indexed via i+1)
    col.width = wideCols.includes(i + 1) ? 28 : 12;
  });

  // ── Generate & download ───────────────────────
  const buf = await wb.xlsx.writeBuffer();
  const fileName = `ZF0002_AGRI-${companyCode}-${periodVal}-${year}.xlsx`;
  saveAs(
    new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
}
