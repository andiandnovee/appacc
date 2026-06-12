/**
 * ImportDispatcher.tsx
 * Path: frontend/src/pages/invoice/ReceiptManagement/ImportDispatcher.tsx
 *
 * Terima file (Excel/CSV) → parse header → deteksi tipe → render
 * SapPoImportForm atau IcatIdImportForm sesuai hasil deteksi.
 */

import { useState } from "react";
import * as XLSX from "xlsx";
import Alert from "../../../components/ui/Alert";
import FileUpload from "../../../components/ui/FileUpload";
import SapPoImportForm from "./SapPoImportForm";
import IcatIdImportForm from "./IcatIdImportForm";
import { detectImportType, ImportType } from "../../../utils/ImportDetection";

// ─────────────────────────────────────────────
interface Props {
  onSuccess?: () => void;
}

export default function ImportDispatcher({ onSuccess }: Props) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [importType, setImportType] = useState<ImportType | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // ── Parse Excel/CSV ───────────────────────
  const parseExcel = (f: File): Promise<any[]> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target?.result, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const parsed = XLSX.utils.sheet_to_json(ws, { defval: null });
          resolve(parsed as any[]);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsBinaryString(f);
    });

  // ── File change ───────────────────────────
  const handleFilesChange = (files: File[]) => {
    const selected = files[0] ?? null;
    setParseError(null);
    setRows(null);
    setImportType(null);

    if (!selected) return;

    parseExcel(selected)
      .then((parsed) => {
        if (!parsed.length) {
          setParseError("File kosong atau tidak memiliki data");
          return;
        }

        const type = detectImportType(parsed[0]);

        if (type === "unknown") {
          setParseError(
            "Format file tidak dikenali. Pastikan header kolom sesuai panduan SAP PO Export atau ICAT ID Export.",
          );
          return;
        }

        setFileName(selected.name);
        setImportType(type);
        setRows(parsed);
      })
      .catch(() => {
        setParseError(
          "Gagal membaca file. Pastikan format .xlsx, .xls, atau .csv valid.",
        );
      });
  };

  const handleReset = () => {
    setRows(null);
    setFileName("");
    setImportType(null);
    setParseError(null);
  };

  // ─────────────────────────────────────────
  // ── Tampilkan form spesifik setelah file terdeteksi ──
  if (rows && importType === "sap_po") {
    return (
      <SapPoImportForm
        rows={rows}
        fileName={fileName}
        onSuccess={onSuccess}
        onReset={handleReset}
      />
    );
  }

  if (rows && importType === "icat_id") {
    return (
      <IcatIdImportForm
        rows={rows}
        fileName={fileName}
        onSuccess={onSuccess}
        onReset={handleReset}
      />
    );
  }

  // ── Tampilan awal: FileUpload ──
  return (
    <div>
      <FileUpload
        accept=".xlsx,.xls,.csv"
        multiple={false}
        maxSize={20 * 1024 * 1024}
        maxFiles={1}
        label="File Excel / CSV"
        hint="Format: SAP PO Export (.xlsx/.xls) atau ICAT ID Export (.csv) · Maks 20 MB"
        onFilesChange={handleFilesChange}
      />

      {parseError && (
        <Alert
          variant="danger"
          description={parseError}
          dismissible
          onDismiss={() => setParseError(null)}
        />
      )}
    </div>
  );
}
