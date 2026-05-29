import { createSapFile } from "./sapFile";

/**
 * Spesifik: ME2N - Purchasing Documents per Document Number
 */
export function downloadME2N(
  po: string,
  sapUser: string,
  sapServer: string,
): void {
  const content = [
    "[System]",
    "Name=P08",
    `Description=${sapServer}`,
    "Client=800",
    "[User]",
    `Name=${sapUser}`,
    "Language=EN",
    "[Function]",
    "Title=P08(1)800 Purchasing Documents per Document Number",
    `Command=/n*ME2N EN_EBELN-LOW=${po}; LISTU=ALV;`,
    "Type=SystemCommand",
    "[Configuration]",
    "[Options]",
    "Reuse=1",
  ].join("\n");
  createSapFile(`ME2N ${po}.sap`, content);
}

/**
 * Spesifik: MIR7 - Create Invoice
 */
export function downloadMIR7(
  po: string,
  sapUser: string,
  sapServer: string,
  sapCocd: string,
  sapVendorName: string,
  sapInvoiceDate: string,
  sapInvoiceAmount: string,
  sapBusArea: string,
): void {
  const content = [
    "[System]",
    "Name=P08",
    `Description=${sapServer}`,
    "Client=800",
    "[User]",
    `Name=${sapUser}`,
    "Language=EN",
    "[Function]",
    `Title=${sapBusArea} P08(1)800 Purchasing Create Invoice`,
    `Command=/n*MIR7  BKPF-BUKRS=${sapCocd} ;INVFO-MWSKZ=i0; INVFO-BLDAT=${sapInvoiceDate};INVFO-SGTXT=${po}-${sapVendorName}, PT ;INVFO-WRBTR=${sapInvoiceAmount}; RM08M-EBELN=${po};INVFO-XMWST=;INVFO-XBLNR=;DYNP_OKCODE=HEADER_FI  \n`,
    "Type=SystemCommand",
    "[Configuration]",
    "[Options]",
    "Reuse=1",
  ].join("\n");
  createSapFile(`${sapBusArea}  MIR7  ${po}.sap`, content);
}

/**
 * Spesifik: FBV0
 */
export function downloadFBV0(
  doc: string,
  cocd: string,
  sapUser: string,
  sapServer: string,
): void {
  const content = [
    "[System]",
    "Name=P08",
    `Description=${sapServer}`,
    "Client=800",
    "[User]",
    `Name=${sapUser}`,
    "Language=EN",
    "[Function]",
    "Title=P08(1)800 Purchasing Documents per Document Number",
    `Command=/n*FBV0 RF05V-BUKRS=${cocd};RF05V-BELNR=${doc}; `,
    "Type=SystemCommand",
    "[Configuration]",
    "[Options]",
    "Reuse=1",
  ].join("\n");
  createSapFile(`FBV0 ${doc} - ${cocd}.sap`, content);
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Format tanggal ke format SAP: DD.MM.YYYY
 *
 * Handle dua format:
 *   1. Excel serial date (integer, misal 46112) — doc_date dari SAP export
 *   2. ISO string / Date object (misal "2026-03-13")
 */
function toSapDate(date: string | Date | number): string {
  if (!date) return "";

  const num = Number(date);
  // Excel serial date: integer antara 40000–60000 (tahun ~2009–2064)
  if (!isNaN(num) && Number.isInteger(num) && num > 40000 && num < 60000) {
    const msPerDay = 86400000;
    // Excel epoch = 30 Des 1899 (kompensasi bug leap year 1900 di Excel)
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const jsDate = new Date(excelEpoch.getTime() + num * msPerDay);
    const dd = String(jsDate.getUTCDate()).padStart(2, "0");
    const mm = String(jsDate.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = jsDate.getUTCFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  // ISO string atau Date object
  const d = new Date(date as string | Date);
  if (isNaN(d.getTime())) return String(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

/**
 * Format angka ke format id-ID tanpa desimal
 * Misal: 1888110 → "1.888.110"
 */
function toSapAmount(amount: number | string): string {
  const num = Number(String(amount).replace(/[^\d]/g, ""));
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(num));
}

// ─────────────────────────────────────────────────────────────
// F-53
// ─────────────────────────────────────────────────────────────

interface F53Params {
  sapUser: string;
  sapServer: string;
  companyCode: string;
  businessArea: string;
  bankAccount: string;
  vendorName: string;
  vendorSapId: string;
  docDate: string | Date | number;
  postingDate: string | Date;
  headerText: string;
  stageText?: string;
  totalAmount: number;
  // Override untuk mode perdin (SAKU/MKN)
  augtxOverride?: string;
  sgtxtOverride?: string;
  xblnrOverride?: string;
}

/**
 * F-53 Manual Outgoing Payment
 *
 * Field mapping:
 *   BKPF-BLDAT  = docDate        (Excel serial atau ISO)
 *   BKPF-WAERS  = IDR
 *   BKPF-BLART  = KZ
 *   BKPF-BUKRS  = companyCode
 *   BKPF-BUDAT  = postingDate
 *   BKPF-XBLNR  = vendorName
 *   BKPF-BKTXT  = headerText     (busArea-suffix)
 *   RF05A-KONTO = bankAccount
 *   BSEG-GSBER  = businessArea
 *   BSEG-WRBTR  = totalAmount
 *   BSEG-VALUT  = postingDate
 *   RF05A-AUGTX = TAG stageText/vendorName
 *   BSEG-SGTXT  = BYR TAG stageText/vendorName
 *   BSEG-ZUONR  = PO
 *   RF05A-AGKON = vendorSapId
 *   RF05A-XPOS1 = X
 *   RF05A-XAUTS = X
 */
export function downloadF53({
  sapUser,
  sapServer,
  companyCode,
  businessArea,
  bankAccount,
  vendorName,
  vendorSapId,
  docDate,
  postingDate,
  headerText,
  stageText,
  totalAmount,
  augtxOverride,
  sgtxtOverride,
  xblnrOverride,
}: F53Params): void {
  const sapDocDate = toSapDate(docDate);
  const sapPostDate = toSapDate(postingDate);
  const sapAmount = toSapAmount(totalAmount);

  const augtx = augtxOverride ?? `TAG ${stageText}/${vendorName}`;
  const sgtxt = sgtxtOverride ?? `BYR TAG ${stageText}/${vendorName}`;
  const xblnr = xblnrOverride ?? vendorName;

  // Command: /n*F-53 diikuti field SAP dipisah ";"
  // Tidak ada spasi ekstra setelah /n*F-53 — langsung semicolon pertama
  const fields = [
    `BKPF-BLDAT=${sapDocDate}`,
    `BKPF-WAERS=IDR`,
    `BKPF-BLART=KZ`,
    `BKPF-BUKRS=${companyCode}`,
    `BKPF-BUDAT=${sapPostDate}`,
    `BKPF-XBLNR=${xblnr}`,
    `BKPF-BKTXT=${headerText}`,
    `RF05A-KONTO=${bankAccount}`,
    `BSEG-GSBER=${businessArea}`,
    `BSEG-WRBTR=${sapAmount}`,
    `BSEG-VALUT=${sapPostDate}`,
    `RF05A-AUGTX=${augtx}`,
    `BSEG-SGTXT=${sgtxt}`,
    `BSEG-ZUONR=PO`,
    `RF05A-AGKON=${vendorSapId}`,
    `RF05A-XPOS1=X`,
    `RF05A-XAUTS=X`,
  ].join(";");

  const command = `/n*F-53; ${fields};`;

  const content = [
    "[System]",
    "Name=P08",
    `Description=${sapServer}`,
    "Client=800",
    "[User]",
    `Name=${sapUser}`,
    "Language=EN",
    "[Function]",
    `Title=P08(1)800 F-53 Payment ${businessArea} ${vendorName}`,
    `Command=${command}`,
    "Type=SystemCommand",
    "[Configuration]",
    "[Options]",
    "Reuse=1",
  ].join("\n");

  const safeName = vendorName.replace(/[\\/:*?"<>|]/g, "_").slice(0, 30);
  const dateStr = toSapDate(postingDate).replace(/\./g, "");
  createSapFile(`F53 ${businessArea} ${safeName} ${dateStr}.sap`, content);
}

// ─────────────────────────────────────────────────────────────
// Batch
// ─────────────────────────────────────────────────────────────

interface VendorGroup {
  vendorName: string;
  vendorSapId: string;
  docDate: string | Date | number;
  totalAmount: number;
}

interface BatchCommonParams {
  sapUser: string;
  sapServer: string;
  companyCode: string;
  businessArea: string;
  bankAccount: string;
  postingDate: string | Date;
  headerText: string;
  stageText?: string;
}

export function downloadF53Batch(
  vendorGroups: VendorGroup[],
  commonParams: BatchCommonParams,
): void {
  vendorGroups.forEach((group) => {
    downloadF53({
      ...commonParams,
      vendorName: group.vendorName,
      vendorSapId: group.vendorSapId,
      docDate: group.docDate,
      totalAmount: group.totalAmount,
    });
  });
}
