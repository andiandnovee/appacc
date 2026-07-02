import { createSapFile } from "./sapFile";

export function downloadME2N(po: string, sapUser: string, sapServer: string): void {
  const content = [
    "[System]", "Name=P08", `Description=${sapServer}`, "Client=800",
    "[User]", `Name=${sapUser}`, "Language=EN",
    "[Function]",
    "Title=P08(1)800 Purchasing Documents per Document Number",
    `Command=/n*ME2N EN_EBELN-LOW=${po}; LISTU=ALV;`,
    "Type=SystemCommand", "[Configuration]", "[Options]", "Reuse=1",
  ].join("\n");
  createSapFile(`ME2N ${po}.sap`, content);
}

export function downloadMIR7(
  po: string, sapUser: string, sapServer: string,
  sapCocd: string, sapVendorName: string, sapInvoiceDate: string,
  sapInvoiceAmount: string, sapBusArea: string,
): void {
  const content = [
    "[System]", "Name=P08", `Description=${sapServer}`, "Client=800",
    "[User]", `Name=${sapUser}`, "Language=EN",
    "[Function]",
    `Title=${sapBusArea} P08(1)800 Purchasing Create Invoice`,
    `Command=/n*MIR7  BKPF-BUKRS=${sapCocd} ;INVFO-MWSKZ=i0; INVFO-BLDAT=${sapInvoiceDate};INVFO-SGTXT=${po}-${sapVendorName}, PT ;INVFO-WRBTR=${sapInvoiceAmount}; RM08M-EBELN=${po};INVFO-XMWST=;INVFO-XBLNR=;DYNP_OKCODE=HEADER_FI  \n`,
    "Type=SystemCommand", "[Configuration]", "[Options]", "Reuse=1",
  ].join("\n");
  createSapFile(`${sapBusArea}  MIR7  ${po}.sap`, content);
}

export function downloadFBV0(doc: string, cocd: string, sapUser: string, sapServer: string): void {
  const content = [
    "[System]", "Name=P08", `Description=${sapServer}`, "Client=800",
    "[User]", `Name=${sapUser}`, "Language=EN",
    "[Function]",
    "Title=P08(1)800 Purchasing Documents per Document Number",
    `Command=/n*FBV0 RF05V-BUKRS=${cocd};RF05V-BELNR=${doc}; `,
    "Type=SystemCommand", "[Configuration]", "[Options]", "Reuse=1",
  ].join("\n");
  createSapFile(`FBV0 ${doc} - ${cocd}.sap`, content);
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Format tanggal ke format SAP: DD.MM.YYYY
 * Handle dua format:
 *   1. Excel serial date (integer, misal 46112)
 *   2. ISO string / Date object
 */
function toSapDate(date: string | Date | number): string {
  if (!date) return "";
  const num = Number(date);
  if (!isNaN(num) && Number.isInteger(num) && num > 40000 && num < 60000) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const jsDate = new Date(excelEpoch.getTime() + num * 86400000);
    const dd = String(jsDate.getUTCDate()).padStart(2, "0");
    const mm = String(jsDate.getUTCMonth() + 1).padStart(2, "0");
    return `${dd}.${mm}.${jsDate.getUTCFullYear()}`;
  }
  const d = new Date(date as string | Date);
  if (isNaN(d.getTime())) return String(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

/** Format angka ke id-ID tanpa desimal. Misal: 1888110 → "1.888.110" */
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
  sZUONR?: string;
  /**
   * skipScreen: true  → /n*F-53 (langsung eksekusi, lewati konfirmasi SAP)
   *             false → /nF-53  (buka form biasa)
   */
  skipScreen?: boolean;
  /**
   * skipDoc: true  → sertakan RF05A-XPOS1=X (SAP auto-assign doc number)
   *          false → tidak sertakan, user isi manual
   */
  skipDoc?: boolean;
}

/**
 * F-53 Manual Outgoing Payment
 *
 * Field mapping:
 *   BKPF-BLDAT  = docDate
 *   BKPF-WAERS  = IDR
 *   BKPF-BLART  = KZ
 *   BKPF-BUKRS  = companyCode
 *   BKPF-BUDAT  = postingDate
 *   BKPF-XBLNR  = xblnr (vendorName atau reference perdin)
 *   BKPF-BKTXT  = headerText
 *   RF05A-KONTO = bankAccount
 *   BSEG-GSBER  = businessArea
 *   BSEG-WRBTR  = totalAmount
 *   BSEG-VALUT  = postingDate
 *   RF05A-AUGTX = TAG stageText/vendorName (atau override perdin)
 *   BSEG-SGTXT  = BYR TAG stageText/vendorName (atau override perdin)
 *   BSEG-ZUONR  = PO
 *   RF05A-AGKON = vendorSapId
 *   RF05A-XPOS1 = X (hanya jika skipDoc=true)
 *   RF05A-XAUTS = X
 */
export function downloadF53({
  sapUser, sapServer, companyCode, businessArea, bankAccount,
  vendorName, vendorSapId, docDate, postingDate,
  headerText, stageText, totalAmount,
  augtxOverride, sgtxtOverride, xblnrOverride, sZUONR,
  skipScreen = false,
  skipDoc = false,
}: F53Params): void {
  const sapDocDate  = toSapDate(docDate);
  const sapPostDate = toSapDate(postingDate);
  const sapAmount   = toSapAmount(totalAmount);

  const augtx = augtxOverride ?? `TAG ${stageText ?? ""}/${vendorName}`;
  const sgtxt = sgtxtOverride ?? `BYR TAG ${stageText ?? ""}/${vendorName}`;
  const xblnr = xblnrOverride ?? vendorName;

  // Bangun array field, RF05A-XPOS1 hanya dimasukkan kalau skipDoc=true
  const fieldList = [
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
    `BSEG-ZUONR=${sZUONR || "PO"}`,
    `RF05A-AGKON=${vendorSapId}`,
    ...(skipDoc ? ["RF05A-XPOS1=X"] : []),
    `RF05A-XAUTS=X`,
  ];

  // skipScreen: true  → /n*F-53 (asterisk = eksekusi langsung)
  //             false → /nF-53  (buka form)
  const tcode   = skipScreen ? "/n*F-53" : "/nF-53";
  const command = `${tcode} ${fieldList.join(";")};`;

  const content = [
    "[System]", "Name=P08", `Description=${sapServer}`, "Client=800",
    "[User]", `Name=${sapUser}`, "Language=EN",
    "[Function]",
    `Title=P08(1)800 F-53 Payment ${businessArea} ${vendorName}`,
    `Command=${command}`,
    "Type=SystemCommand", "[Configuration]", "[Options]", "Reuse=1",
  ].join("\n");

  const safeName = vendorName.replace(/[\\/:*?"<>|]/g, "_").slice(0, 30);
  const dateStr  = toSapDate(postingDate).replace(/\./g, "");
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
      vendorName:  group.vendorName,
      vendorSapId: group.vendorSapId,
      docDate:     group.docDate,
      totalAmount: group.totalAmount,
    });
  });
}