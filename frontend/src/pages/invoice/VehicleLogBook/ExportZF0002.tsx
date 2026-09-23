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
  mergeDuplicates?: boolean; // default: true
}

export interface ZfPreviewGroup {
  type: "customer" | "cost_center";
  account: string;
  description: string;
  source_count: number;
  km: number;
  cost_amount: number;
}

export interface ZfPreviewVehicle {
  plate_number: string;
  original_count: number;
  result_count: number;
  original_km: number;
  result_km: number;
  original_cost: number;
  result_cost: number;
  is_valid: boolean;
  groups: ZfPreviewGroup[];
}

export interface ZfExportPreview {
  vehicles: ZfPreviewVehicle[];
  all_valid: boolean;
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

function filterDetails(details: ZfDetailRow[], mode: ZfMode): ZfDetailRow[] {
  return mode === "customer"
    ? details.filter((d) => d.customer_code)
    : mode === "cc"
      ? details.filter((d) => d.cost_center)
      : details;
}

function prepareDetails(
  details: ZfDetailRow[],
  mergeDuplicates: boolean,
): Array<ZfDetailRow & { source_count: number }> {
  if (!mergeDuplicates) {
    return details.map((detail) => ({
      ...detail,
      cost_amount: toIntAmount(detail.cost_amount),
      source_count: 1,
    }));
  }

  const grouped = new Map<string, ZfDetailRow & { source_count: number }>();

  details.forEach((detail) => {
    const type = detail.customer_code ? "customer" : "cost_center";
    const account = detail.customer_code ?? detail.cost_center ?? "";
    const key = JSON.stringify([type, account, detail.description]);
    const current = grouped.get(key);

    if (current) {
      current.km += detail.km;
      current.cost_amount += toIntAmount(detail.cost_amount);
      current.source_count += 1;
      return;
    }

    grouped.set(key, {
      ...detail,
      cost_amount: toIntAmount(detail.cost_amount),
      source_count: 1,
    });
  });

  return Array.from(grouped.values());
}

export function buildZf0002Preview(
  payloads: ZfPayload[],
  mode: ZfMode = "all",
  mergeDuplicates = true,
): ZfExportPreview {
  const vehicles = payloads.flatMap((payload) => {
    const original = filterDetails(payload.details, mode);
    if (original.length === 0) return [];

    const result = prepareDetails(original, mergeDuplicates);
    const originalKm = original.reduce((sum, detail) => sum + detail.km, 0);
    const resultKm = result.reduce((sum, detail) => sum + detail.km, 0);
    const originalCost = original.reduce(
      (sum, detail) => sum + toIntAmount(detail.cost_amount),
      0,
    );
    const resultCost = result.reduce(
      (sum, detail) => sum + detail.cost_amount,
      0,
    );

    return [{
      plate_number: payload.vehicle.plate_number,
      original_count: original.length,
      result_count: result.length,
      original_km: originalKm,
      result_km: resultKm,
      original_cost: originalCost,
      result_cost: resultCost,
      is_valid: originalKm === resultKm && originalCost === resultCost,
      groups: result.map((detail) => ({
        type: detail.customer_code ? "customer" : "cost_center",
        account: detail.customer_code ?? detail.cost_center ?? "",
        description: detail.description,
        source_count: detail.source_count,
        km: detail.km,
        cost_amount: detail.cost_amount,
      })),
    }];
  });

  return {
    vehicles,
    all_valid: vehicles.length > 0 && vehicles.every((vehicle) => vehicle.is_valid),
  };
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
  mergeDuplicates = true,
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
    const originalDetails = filterDetails(payload.details, mode);
    const filteredDetails = prepareDetails(originalDetails, mergeDuplicates);

    if (filteredDetails.length === 0) return;

    const originalKm = originalDetails.reduce((sum, d) => sum + d.km, 0);
    const resultKm = filteredDetails.reduce((sum, d) => sum + d.km, 0);
    const originalCost = originalDetails.reduce(
      (sum, d) => sum + toIntAmount(d.cost_amount),
      0,
    );
    const resultCost = filteredDetails.reduce(
      (sum, d) => sum + d.cost_amount,
      0,
    );
    if (originalKm !== resultKm || originalCost !== resultCost) {
      throw new Error(
        `Validasi penggabungan gagal untuk kendaraan ${plate}. Export dibatalkan.`,
      );
    }

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
