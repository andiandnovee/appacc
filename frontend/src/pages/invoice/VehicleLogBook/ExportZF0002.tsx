// exportZF0002.ts
// Path: frontend/src/pages/vehicles/exportZF0002.ts

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ─────────────────────────────────────────────
// TYPES
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
  periode: string;
  total_km: number;
  total_cost: number;
  no_voucher: string;
}

export interface ZfVehicle {
  plate_number: string;
  description: string;
  cost_center: string;
}

export interface ZfPayload {
  vehicle: ZfVehicle;
  header: ZfHeader;
  details: ZfDetailRow[]; // semua details (customer + cc)
  is_balanced: boolean;
}

export type ZfMode = "all" | "customer" | "cc";

export interface ExportZf0002Params {
  payloads: ZfPayload[];
  companyCode: string;
  businessArea: string;
  month: number;
  year: number;
  postingDate: Date;
  mode?: ZfMode; // default: "all"
}

type ZfCell = string | number | null;
type ZfRow = ZfCell[];

export const ZF0002_HEADERS = [
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

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function toIntAmount(val: number): number {
  return Math.round(val);
}

function formatDateSAP(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function periodStr(month: number): string {
  return String(month).padStart(2, "0");
}

function buildFileBaseName(
  companyCode: string,
  month: number,
  year: number,
  mode: ZfMode,
): string {
  const suffix = mode === "customer" ? "-CUST" : mode === "cc" ? "-CC" : "";
  return `ZF0002_AGRI-${companyCode}-${periodStr(month)}-${year}${suffix}`;
}

// ─────────────────────────────────────────────
// SHARED ROW BUILDER
// mode:
//   "all"      → semua details (customer + cc), kredit gabung
//   "customer" → hanya details dengan customer_code (perilaku lama)
//   "cc"       → hanya details dengan cost_center
// ─────────────────────────────────────────────
export function buildZf0002Rows({
  payloads,
  companyCode,
  businessArea,
  month,
  postingDate,
  mode = "all",
}: Omit<ExportZf0002Params, "year">): ZfRow[] {
  const rows: ZfRow[] = [];
  const postingDateStr = formatDateSAP(postingDate);
  const periodVal = periodStr(month);

  payloads.forEach((payload, idx) => {
    const no = idx + 1;
    const plate = payload.vehicle.plate_number;
    const [, yearStr] = payload.header.periode.split("-");
    const mmYYYY = `${periodVal}-${yearStr}`;
    const refDoc = `${plate}-${mmYYYY}`;
    const headerText = `ALK ${refDoc}`;
    const noVoucher = payload.header.no_voucher;

    // Filter details sesuai mode
    const allDetails = payload.details;
    const filteredDetails =
      mode === "customer"
        ? allDetails.filter((d) => d.customer_code)
        : mode === "cc"
          ? allDetails.filter((d) => d.cost_center)
          : allDetails; // "all" — tidak difilter

    if (filteredDetails.length === 0) return;

    let debetTotal = 0;

    for (const d of filteredDetails) {
      const amount = toIntAmount(d.cost_amount);
      debetTotal += amount;

      const isCustomer = !!d.customer_code;

      if (isCustomer) {
        // ── Debet ke CUSTOMER ──
        const text50 = `ALK ${plate}-${d.description}`;
        rows.push([
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
          null, // L - kosong untuk customer
          null, // M
          Number(d.customer_code), // N - customer account
          null, // O
          amount, // P
          Number(businessArea), // Q
          null, // R - kosong untuk customer
          Number(businessArea), // S
          null, // T
          "DN", // U
          text50, // V
          null, // W
          null,
          null,
          null,
          null,
          null,
          null, // X-AC
        ]);
      } else {
        // ── Debet ke COST CENTER (perjalanan dinas) ──
        const text50 = `ALK ${plate}-${d.description}`;
        rows.push([
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
          70920001, // L - akun perjalanan dinas
          null, // M
          null, // N - kosong (beda dari customer)
          null, // O
          amount, // P
          Number(businessArea), // Q
          Number(d.cost_center), // R - cost center pengguna
          Number(businessArea), // S
          null, // T
          null, // U
          text50, // V
          null, // W
          null,
          null,
          null,
          null,
          null,
          null, // X-AC
        ]);
      }
    }

    // ── Baris KREDIT — total gabung semua detail yang difilter ──
    const totalKmAlloc = filteredDetails.reduce((s, d) => s + d.km, 0);
    const assignmentCredit = `ALK ${plate}`;
    const text50Credit = `ALK ${plate}-${totalKmAlloc}KM`;

    rows.push([
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
      debetTotal, // P - total semua debet (gabung)
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

  return rows;
}

// ─────────────────────────────────────────────
// EXPORT: Excel (.xlsx)
// ─────────────────────────────────────────────
export async function exportZf0002Excel(
  params: ExportZf0002Params,
): Promise<void> {
  const { companyCode, month, year, mode = "all" } = params;
  const rows = buildZf0002Rows(params);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Sheet1");

  ws.addRow(ZF0002_HEADERS);
  ws.getRow(1).font = { bold: true };

  rows.forEach((row) => ws.addRow(row));

  ws.columns.forEach((col, i) => {
    const wideCols = [9, 10, 14, 22];
    col.width = wideCols.includes(i + 1) ? 28 : 12;
  });

  const buf = await wb.xlsx.writeBuffer();
  const fileName = `${buildFileBaseName(companyCode, month, year, mode)}.xlsx`;
  saveAs(
    new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
}

// ─────────────────────────────────────────────
// EXPORT: Text (.txt)
// ─────────────────────────────────────────────
export function exportZf0002Text(params: ExportZf0002Params): void {
  const { companyCode, month, year, mode = "all" } = params;
  const rows = buildZf0002Rows(params);

  const lines = rows.map((row) =>
    row
      .map((cell) => (cell === null || cell === undefined ? "" : String(cell)))
      .join("\t"),
  );

  const content = lines.join("\r\n") + "\r\n";
  const fileName = `${buildFileBaseName(companyCode, month, year, mode)}.txt`;
  saveAs(new Blob([content], { type: "text/plain;charset=utf-8" }), fileName);
}

export const exportZf0002Customer = exportZf0002Excel;
