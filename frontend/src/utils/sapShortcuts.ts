import { createSapFile } from "./sapFile";

/**
 * Spesifik: ME2N - Purchasing Documents per Document Number
 * @param po - nomor PO
 * @param sapUser - dari auth/me -> sap_user
 * @param sapServer - dari auth/me -> sap_server_con
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

  const filename = `ME2N ${po}.sap`;
  createSapFile(filename, content);
}

/**
 * Spesifik: MIR7 - Create Invoice
 * @param po - nomor PO
 * @param sapUser - dari auth/me -> sap_user
 * @param sapServer - dari auth/me -> sap_server_con
 * @param sapCocd - Company Code
 * @param sapVendorName - Nama Vendor
 * @param sapInvoiceDate - Tanggal Invoice
 * @param sapInvoiceAmount - Jumlah Invoice
 * @param sapBusArea - Business Area
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
    `Command=/n*MIR7  BKPF-BUKRS=${sapCocd} ;INVFO-MWSKZ=i0; INVFO-BLDAT=${sapInvoiceDate};INVFO-SGTXT=${po}-${sapVendorName}, PT ;INVFO-WRBTR=${sapInvoiceAmount}; RM08M-EBELN=${po};INVFO-XMWST=;INVFO-XBLNR=;DYNP_OKCODE=HEADER_FI  
`,
    "Type=SystemCommand",
    "[Configuration]",
    "[Options]",
    "Reuse=1",
  ].join("\n");

  const filename = `${sapBusArea}  MIR7  ${po}.sap`;
  createSapFile(filename, content);
}

/**
 * Spesifik: FBV0 - Financial Accounting Documents per Document Number
 * @param doc - nomor document
 * @param cocd - Company Code
 * @param sapUser - dari auth/me -> sap_user
 * @param sapServer - dari auth/me -> sap_server_con
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

  const filename = `FBV0 ${doc} - ${cocd}.sap`;
  createSapFile(filename, content);
}

// ─────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────

/**
 * Format tanggal ISO/Date ke format SAP: DD.MM.YYYY
 */
function toSapDate(date: string | Date): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

/**
 * Format angka ke format id-ID (titik sebagai pemisah ribuan, tanpa desimal)
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

/**
 * Parameter untuk downloadF53
 */
interface F53Params {
  sapUser: string;
  sapServer: string;
  companyCode: string;
  businessArea: string;
  bankAccount: string;
  vendorName: string;
  vendorSapId: string;
  docDate: string | Date;
  postingDate: string | Date;
  headerText: string;
  stageText: string;
  totalAmount: number;
}

/**
 * F-53 Manual Outgoing Payment
 *
 * Mapping field ke SAP:
 *   BKPF-BLDAT  = docDate          (tanggal invoice dari data F53)
 *   BKPF-WAERS  = IDR              (hardcode)
 *   BKPF-BLART  = KZ               (hardcode)
 *   BKPF-BUKRS  = companyCode      (kode perusahaan)
 *   BKPF-BUDAT  = postingDate      (tanggal posting, default today)
 *   BKPF-XBLNR  = vendorName       (nama vendor)
 *   BKPF-BKTXT  = headerText       (busArea + "-" + suffix dari form)
 *   RF05A-KONTO = bankAccount      (dari tabel companies)
 *   BSEG-GSBER  = businessArea     (kode bus area)
 *   BSEG-WRBTR  = totalAmount      (total dari rows yang dicentang)
 *   BSEG-VALUT  = postingDate      (sama dengan BUDAT)
 *   RF05A-AUGTX = "TAG " + stageText + "/" + vendorName
 *   BSEG-SGTXT  = "BYR TAG " + stageText + "/" + vendorName
 *   BSEG-ZUONR  = PO               (hardcode)
 *   RF05A-AGKON = vendorSapId      (SAP ID vendor)
 *   RF05A-XPOS1 = X                (hardcode)
 *   RF05A-XAUTS = X                (hardcode)
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
}: F53Params): void {
  const sapDocDate = toSapDate(docDate);
  const sapPostDate = toSapDate(postingDate);
  const sapAmount = toSapAmount(totalAmount);

  const augtx = `TAG ${stageText}/${vendorName}`;
  const sgtxt = `BYR TAG ${stageText}/${vendorName}`;

  const command =
    [
      `/n*F-53`,
      `BKPF-BLDAT=${sapDocDate}`,
      `BKPF-WAERS=IDR`,
      `BKPF-BLART=KZ`,
      `BKPF-BUKRS=${companyCode}`,
      `BKPF-BUDAT=${sapPostDate}`,
      `BKPF-XBLNR=${vendorName}`,
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
    ].join(";") + ";";

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

  // Nama file: "F53 {busArea} {vendorName(max30)} {DDMMYYYY}.sap"
  const safeName = vendorName.replace(/[\\/:*?"<>|]/g, "_").slice(0, 30);
  const dateStr = toSapDate(postingDate).replace(/\./g, "");
  const filename = `F53 ${businessArea} ${safeName} ${dateStr}.sap`;

  createSapFile(filename, content);
}

/**
 * Data per vendor untuk batch F53
 */
interface VendorGroup {
  vendorName: string;
  vendorSapId: string;
  docDate: string | Date;
  totalAmount: number;
}

/**
 * Parameter umum untuk batch F53 (sama untuk semua vendor)
 */
interface BatchCommonParams {
  sapUser: string;
  sapServer: string;
  companyCode: string;
  businessArea: string;
  bankAccount: string;
  postingDate: string | Date;
  headerText: string;
  stageText: string;
}

/**
 * Generate multiple F-53 shortcuts (1 per vendor)
 * Dipanggil saat user klik "Generate Shortcut" dengan rows dari beda vendor.
 */
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
