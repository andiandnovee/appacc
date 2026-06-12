/**
 * importDetection.ts
 * Path: frontend/src/utils/importDetection.ts
 *
 * Deteksi tipe file import berdasarkan header kolom baris pertama.
 */

export type ImportType = "icat_id" | "sap_po" | "unknown";

export function detectImportType(
  firstRow: Record<string, any> | undefined,
): ImportType {
  if (!firstRow) return "unknown";

  const keys = Object.keys(firstRow).map((k) => k.trim().toLowerCase());

  // ICAT ID export: ID, PO_Number, Total
  if (
    keys.includes("id") &&
    keys.includes("po_number") &&
    keys.includes("total")
  ) {
    return "icat_id";
  }

  // SAP PO export: PO No, Vendor, ...
  if (keys.includes("po no") && keys.includes("vendor")) {
    return "sap_po";
  }

  return "unknown";
}
