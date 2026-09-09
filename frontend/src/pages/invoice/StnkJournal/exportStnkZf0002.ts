// Path: src/pages/invoice/StnkJournal/exportStnkZf0002.ts

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ZF0002_HEADERS } from "../VehicleLogBook/ExportZF0002";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface StnkItem {
  id: string;
  plateNumber: string;
  vehicleType: "R4" | "R2";
  businessAreaCode: string;
  costCenter: string | null;
  busAreaKendaraan: boolean; // true = punya costcenter DAN bukan current BusArea
  textItem: string;
  biayaPerpj: number;
  admPerpj: number;
  jasaPerpj: number;
  dendaPerpj: number;
}

export interface StnkHeader {
  companyCode: string;
  postingDate: Date;
  documentDate: Date;
  noInvoice: string;     // ← dulu namaVendor, sekarang No. Invoice
  docHeaderText: string;
  period: string;        // ← input manual, misal "01" atau "JANUARI 2026"
  tarifPph: number;
}

export interface BusAreaMeta {
  sapId: string;
  sapVendorCode: string;
  sapCustomerCode: string;
  isCurrent: boolean;
}

export interface VendorRO {
  kode_vendor: string;
  nama_vendor: string;   // ← dipakai sebagai Reference & Assignment
  jenis: "STNK" | "KIER";
  tarif_pph: number;
  gl_account_pph: string;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatDateSAP(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function toInt(v: number) {
  return Math.round(v);
}

type ZfCell = string | number | null;
type ZfRow = ZfCell[];

function makeRow(fields: {
  no: number;
  companyCode: string;
  postingDateStr: string;
  period: string;
  documentDateStr: string;
  dc: "D" | "C";
  glAccount: number | null;
  vendorAccount: number | null;
  customerAccount: number | null;
  amount: number;
  businessArea: string | number;
  costCenter: string | null;
  assignment: string;
  text: string;
  taxCode: string;
  reference: string;   // kolom I — selalu nama_vendor dari Zustand
  headerText: string;
}): ZfRow {
  return [
    fields.no,
    Number(fields.companyCode),
    fields.postingDateStr,
    fields.period,
    fields.documentDateStr,
    "YA",
    "IDR",
    null,
    fields.reference,          // Reference = nama_vendor Zustand
    fields.headerText,
    fields.dc,
    fields.glAccount,
    fields.vendorAccount,
    fields.customerAccount,
    null,
    fields.amount,
    Number(fields.businessArea),
    fields.costCenter ? Number(fields.costCenter) : null,
    null,
    null,
    fields.assignment,
    fields.text,
    fields.taxCode,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
}

// ─────────────────────────────────────────────
// CLASSIFIER — apakah item masuk BusAreaKendaraan
// Syarat: punya costCenter DAN costCenter != current BusArea sap_id
// ─────────────────────────────────────────────
export function isKendaraanItem(item: StnkItem, currentBaSapId: string): boolean {
  return !!item.costCenter && item.costCenter !== currentBaSapId;
}

// ─────────────────────────────────────────────
// BUILDER 1 — Jurnal BusAreaKendaraan
// Item: punya costCenter DAN bukan current BusArea
// No sequential mulai dari startNo
// ─────────────────────────────────────────────
export function buildStnkKendaraanRows(
  header: StnkHeader,
  items: StnkItem[],
  busAreaMetaList: BusAreaMeta[],
  vendorRO: VendorRO,
  startNo: number = 1,
): { rows: ZfRow[]; docCount: number } {
  const rows: ZfRow[] = [];
  const postingDateStr = formatDateSAP(header.postingDate);
  const documentDateStr = formatDateSAP(header.documentDate);
  const period = header.period;  // ← dari input manual

  const currentMeta = busAreaMetaList.find((m) => m.isCurrent);
  const currentVendorCode = currentMeta?.sapVendorCode ?? "";
  const currentBaSapId = currentMeta?.sapId ?? "";

  // Reference = nama_vendor dari Zustand
  const reference = vendorRO.nama_vendor;

  // Filter: hanya item yang BUKAN current BusArea
  const eligible = items.filter((i) => isKendaraanItem(i, currentBaSapId));

  // Group per businessAreaCode
  const grouped = new Map<string, StnkItem[]>();
  for (const item of eligible) {
    const list = grouped.get(item.businessAreaCode) ?? [];
    list.push(item);
    grouped.set(item.businessAreaCode, list);
  }

  let docNo = startNo;

  for (const [baCode, baItems] of grouped) {
    let totalBiayaAdm = 0;
    let totalJasa = 0;

    for (const item of baItems) {
      const biayaAdm = toInt(item.biayaPerpj + item.admPerpj);
      const jasa = toInt(item.jasaPerpj);
      totalBiayaAdm += biayaAdm;
      totalJasa += jasa;

      const base = {
        no: docNo,
        companyCode: header.companyCode,
        postingDateStr,
        period,
        documentDateStr,
        dc: "D" as const,
        glAccount: 71830001,
        vendorAccount: null,
        customerAccount: null,
        businessArea: baCode,
        costCenter: item.costCenter,
        assignment: vendorRO.nama_vendor,
        taxCode: "I0",
        reference,
        headerText: header.docHeaderText,
      };

      if (biayaAdm > 0) {
        rows.push(makeRow({
          ...base,
          amount: biayaAdm,
          text: `BY PERPJ ${vendorRO.jenis} ${item.textItem}`,
        }));
      }

      if (jasa > 0) {
        rows.push(makeRow({
          ...base,
          amount: jasa,
          text: `JASA PERPJ ${vendorRO.jenis} ${item.textItem}`,
        }));
      }
    }

    const totalDebet = totalBiayaAdm + totalJasa;
    const itemCount = baItems.length;

    // C — vendor dari current BusArea
    rows.push(makeRow({
      no: docNo,
      companyCode: header.companyCode,
      postingDateStr,
      period,
      documentDateStr,
      dc: "C",
      glAccount: null,
      vendorAccount: currentVendorCode ? Number(currentVendorCode) : null,
      customerAccount: null,
      amount: totalDebet,
      businessArea: baCode,
      costCenter: null,
      assignment: vendorRO.nama_vendor,
      text: `BY PERPJ ${vendorRO.jenis} ${itemCount} KENDARAAN`,
      taxCode: "**",
      reference,
      headerText: header.docHeaderText,
    }));

    docNo++;
  }

  return { rows, docCount: grouped.size };
}

// ─────────────────────────────────────────────
// BUILDER 2 — Jurnal BusAreaRO
// Semua item masuk (termasuk yg costCenter = current BusArea)
// Satu dokumen, No = startNo
// ─────────────────────────────────────────────
export function buildStnkRoRows(
  header: StnkHeader,
  items: StnkItem[],
  busAreaMetaList: BusAreaMeta[],
  vendorRO: VendorRO,
  startNo: number,
): ZfRow[] {
  const rows: ZfRow[] = [];
  const postingDateStr = formatDateSAP(header.postingDate);
  const documentDateStr = formatDateSAP(header.documentDate);
  const period = header.period;  // ← dari input manual

  const currentMeta = busAreaMetaList.find((m) => m.isCurrent);
  const currentBaId = currentMeta?.sapId ?? "";
  const currentCustomerCode = currentMeta?.sapCustomerCode ?? "";
  const currentBaSapId = currentMeta?.sapId ?? "";

  // Reference = nama_vendor Zustand
  const reference = vendorRO.nama_vendor;
  const jenis = vendorRO.jenis;
  const docNo = startNo;

  let grandTotalBiayaAdm = 0;
  let grandTotalJasa = 0;
  let grandTotalDenda = 0;

  for (const item of items) {
    const biayaAdm = toInt(item.biayaPerpj + item.admPerpj);
    const jasa = toInt(item.jasaPerpj);
    const denda = toInt(item.dendaPerpj);

    grandTotalBiayaAdm += biayaAdm;
    grandTotalJasa += jasa;
    grandTotalDenda += denda;

    // Tentukan apakah item ini adalah "current BusArea item"
    const isCurrentBaItem = !!item.costCenter && item.costCenter === currentBaSapId;
    // Tanpa cost_center = not_found/no_cc item
    const isNoCcItem = !item.costCenter;

    // GL Account debet:
    // - current BusArea item → 71830001, customer = null
    // - item biasa (busAreaKendaraan true) → null (kosong), customer = current
    // - no CC item → null (kosong), customer = current
    const glDebet = isCurrentBaItem ? 71830001 : null;
    const customerDebet = isCurrentBaItem
      ? null
      : (currentCustomerCode ? Number(currentCustomerCode) : null);

    // Assignment:
    // - tanpa cost_center (not_found / no_cc) → "DN"
    // - lainnya → nama_vendor
    const assignment = isNoCcItem ? "DN" : vendorRO.nama_vendor;

    const baseDebet = {
      no: docNo,
      companyCode: header.companyCode,
      postingDateStr,
      period,
      documentDateStr,
      dc: "D" as const,
      vendorAccount: null,
      businessArea: currentBaId,
      costCenter: null,
      taxCode: "I0",
      reference,
      headerText: header.docHeaderText,
      assignment,
    };

    // D1 — Biaya + Adm
    if (biayaAdm > 0) {
      rows.push(makeRow({
        ...baseDebet,
        glAccount: glDebet,
        customerAccount: customerDebet,
        amount: biayaAdm,
        text: `BY PERPJ ${jenis} ${item.textItem}`,
      }));
    }

    // D2 — Jasa
    if (jasa > 0) {
      rows.push(makeRow({
        ...baseDebet,
        glAccount: glDebet,
        customerAccount: customerDebet,
        amount: jasa,
        text: `JASA PERPJ ${jenis} ${item.textItem}`,
      }));
    }

    // D3 — Denda: GL 11494001, customer = null selalu
    if (denda > 0) {
      rows.push(makeRow({
        ...baseDebet,
        glAccount: 11494001,
        customerAccount: null,          // ← selalu null untuk denda
        amount: denda,
        text: `DENDA ${jenis} ${item.textItem}`,
      }));
    }
  }

  // ── Kredit ──
  const pph = Math.round((grandTotalJasa * vendorRO.tarif_pph) / 100);
  // Total bayar = biaya+adm+jasa+denda - pph
  const totalBayar = grandTotalBiayaAdm + grandTotalJasa + grandTotalDenda - pph;
  const totalItems = items.length;

  // C1 — Bayar ke vendor (net)
  rows.push(makeRow({
    no: docNo,
    companyCode: header.companyCode,
    postingDateStr,
    period,
    documentDateStr,
    dc: "C",
    glAccount: null,
    vendorAccount: vendorRO.kode_vendor ? Number(vendorRO.kode_vendor) : null,
    customerAccount: null,
    amount: totalBayar,
    businessArea: currentBaId,
    costCenter: null,
    assignment: vendorRO.nama_vendor,
    // text: PERPJ STNK/KIER {count} KEND {no_invoice}
    text: `PERPJ ${jenis} ${totalItems} KEND ${header.noInvoice}`,
    taxCode: "**",
    reference,
    headerText: header.docHeaderText,
  }));

  // C2 — PPh (GL PPh, vendor & customer kosong)
  if (pph > 0) {
    rows.push(makeRow({
      no: docNo,
      companyCode: header.companyCode,
      postingDateStr,
      period,
      documentDateStr,
      dc: "C",
      glAccount: vendorRO.gl_account_pph ? Number(vendorRO.gl_account_pph) : null,
      vendorAccount: null,
      customerAccount: null,
      amount: pph,
      businessArea: currentBaId,
      costCenter: null,
      assignment: vendorRO.nama_vendor,
      text: `PPH PERPJ ${jenis} ${totalItems} KEND`,
      taxCode: "**",
      reference,
      headerText: header.docHeaderText,
    }));
  }

  return rows;
}

// ─────────────────────────────────────────────
// COMBINED BUILDER
// ─────────────────────────────────────────────
export function buildAllStnkRows(
  header: StnkHeader,
  items: StnkItem[],
  busAreaMetaList: BusAreaMeta[],
  vendorRO: VendorRO,
): ZfRow[] {
  const { rows: kendRows, docCount } = buildStnkKendaraanRows(
    header, items, busAreaMetaList, vendorRO, 1,
  );
  const roRows = buildStnkRoRows(
    header, items, busAreaMetaList, vendorRO, docCount + 1,
  );
  return [...kendRows, ...roRows];
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────
export async function exportStnkKendaraanExcel(
  header: StnkHeader, items: StnkItem[],
  busAreaMetaList: BusAreaMeta[], vendorRO: VendorRO,
): Promise<void> {
  const { rows } = buildStnkKendaraanRows(header, items, busAreaMetaList, vendorRO, 1);
  await _writeExcel(rows, header, "KEND");
}

export function exportStnkKendaraanText(
  header: StnkHeader, items: StnkItem[],
  busAreaMetaList: BusAreaMeta[], vendorRO: VendorRO,
): void {
  const { rows } = buildStnkKendaraanRows(header, items, busAreaMetaList, vendorRO, 1);
  _writeText(rows, header, "KEND");
}

export async function exportStnkRoExcel(
  header: StnkHeader, items: StnkItem[],
  busAreaMetaList: BusAreaMeta[], vendorRO: VendorRO, startNo: number,
): Promise<void> {
  const rows = buildStnkRoRows(header, items, busAreaMetaList, vendorRO, startNo);
  await _writeExcel(rows, header, `RO-${vendorRO.jenis}`);
}

export function exportStnkRoText(
  header: StnkHeader, items: StnkItem[],
  busAreaMetaList: BusAreaMeta[], vendorRO: VendorRO, startNo: number,
): void {
  const rows = buildStnkRoRows(header, items, busAreaMetaList, vendorRO, startNo);
  _writeText(rows, header, `RO-${vendorRO.jenis}`);
}

export async function exportStnkAllExcel(
  header: StnkHeader, items: StnkItem[],
  busAreaMetaList: BusAreaMeta[], vendorRO: VendorRO,
): Promise<void> {
  const rows = buildAllStnkRows(header, items, busAreaMetaList, vendorRO);
  await _writeExcel(rows, header, "ALL");
}

export function exportStnkAllText(
  header: StnkHeader, items: StnkItem[],
  busAreaMetaList: BusAreaMeta[], vendorRO: VendorRO,
): void {
  const rows = buildAllStnkRows(header, items, busAreaMetaList, vendorRO);
  _writeText(rows, header, "ALL");
}

// ─────────────────────────────────────────────
// INTERNAL WRITERS
// ─────────────────────────────────────────────
async function _writeExcel(rows: ZfRow[], header: StnkHeader, suffix: string) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Sheet1");
  ws.addRow(ZF0002_HEADERS);
  ws.getRow(1).font = { bold: true };
  rows.forEach((r) => ws.addRow(r));
  ws.columns.forEach((col, i) => {
    col.width = [9, 10, 14, 22].includes(i + 1) ? 28 : 12;
  });
  const buf = await wb.xlsx.writeBuffer();
  const month = String(header.postingDate.getMonth() + 1).padStart(2, "0");
  const year = header.postingDate.getFullYear();
  saveAs(
    new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `ZF0002_STNK-${header.companyCode}-${month}-${year}-${suffix}.xlsx`,
  );
}

function _writeText(rows: ZfRow[], header: StnkHeader, suffix: string) {
  const lines = rows.map((row) =>
    row.map((c) => (c === null || c === undefined ? "" : String(c))).join("\t"),
  );
  const content = lines.join("\r\n") + "\r\n";
  const month = String(header.postingDate.getMonth() + 1).padStart(2, "0");
  const year = header.postingDate.getFullYear();
  saveAs(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
    `ZF0002_STNK-${header.companyCode}-${month}-${year}-${suffix}.txt`,
  );
}