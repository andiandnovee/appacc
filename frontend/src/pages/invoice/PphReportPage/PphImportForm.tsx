/**
 * PphImportForm.tsx
 * Path: frontend/src/pages/invoice/PphReportPage/PphImportForm.tsx
 *
 * Dipakai di dalam Drawer — tidak ada Card wrapper, tidak ada halaman sendiri.
 */

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import Badge from "../../../components/ui/Badge";
import FileUpload from "../../../components/ui/FileUpload";
import api from "../../../api/axios";
import styles from "./PphImportForm.module.css";

// ─────────────────────────────────────────────
const CHUNK_SIZE = 500;

type UploadType = "main" | "vendor" | null;

function detectUploadType(rows: any[]): UploadType {
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);
  if (headers.includes("G/L Account")) return "main";
  if (headers.includes("Vendor")) return "vendor";
  return null;
}

const UPLOAD_TYPE_META: Record<
  string,
  { label: string; variant: "info" | "warning" }
> = {
  main: { label: "Import Utama", variant: "info" },
  vendor: { label: "Update Vendor", variant: "warning" },
};

// ─────────────────────────────────────────────
interface Props {
  onSuccess?: () => void;
}

export default function PphImportForm({ onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<UploadType>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const abortRef = useRef(false);

  // ── Parse Excel ───────────────────────────
  const parseExcel = (f: File): Promise<any[]> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target?.result, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { defval: null });
          resolve(rows as any[]);
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
    setFile(selected);
    setResult(null);
    setError(null);
    setUploadType(null);
    if (!selected) return;

    parseExcel(selected)
      .then((rows) => {
        const type = detectUploadType(rows);
        if (!type) {
          setError(
            "Format tidak dikenali. Pastikan kolom G/L Account atau Vendor tersedia.",
          );
          setFile(null);
        } else {
          setUploadType(type);
        }
      })
      .catch(() => {
        setError("Gagal membaca file Excel.");
        setFile(null);
      });
  };

  // ── Import ────────────────────────────────
  const handleImport = async () => {
    if (!file || !uploadType) return;

    setImporting(true);
    setError(null);
    setResult(null);
    abortRef.current = false;

    try {
      const rows = await parseExcel(file);
      if (!rows.length) throw new Error("File kosong atau tidak memiliki data");

      const chunks: any[][] = [];
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        chunks.push(rows.slice(i, i + CHUNK_SIZE));
      }

      setProgress({ current: 0, total: chunks.length });

      let totalImported = 0;
      let totalUpdated = 0;
      let totalDuplicates = 0;
      const allErrors: any[] = [];

      for (let i = 0; i < chunks.length; i++) {
        if (abortRef.current) break;

        const { data } = await api.post("/sap/import-pph-chunk", {
          rows: chunks[i],
        });

        totalImported += data.imported ?? 0;
        totalUpdated += data.updated ?? 0;
        totalDuplicates += data.duplicates ?? 0;
        if (Array.isArray(data.errors)) allErrors.push(...data.errors);
        setProgress({ current: i + 1, total: chunks.length });
      }

      setResult({
        success: !abortRef.current,
        aborted: abortRef.current,
        uploadType,
        total_rows: rows.length,
        imported: totalImported,
        updated: totalUpdated,
        duplicates: totalDuplicates,
        errors: allErrors,
      });

      if (!abortRef.current) {
        setFile(null);
        onSuccess?.();
      }
    } catch (err: any) {
      if (err.response?.status === 422)
        return setError(err.response?.data?.message || "Validasi gagal");
      if (err.response?.status === 401)
        return setError("Sesi login habis, silakan login kembali");
      if (err.response?.status === 403)
        return setError("Anda tidak memiliki akses");
      setError(
        err.response?.data?.message || err.message || "Gagal mengimport data",
      );
    } finally {
      setImporting(false);
      setFile(null);
    }
  };

  const percent = progress.total
    ? Math.round((progress.current / progress.total) * 100)
    : 0;
  const typeInfo = uploadType ? UPLOAD_TYPE_META[uploadType] : null;
  const canImport = !!file && !!uploadType && !importing;

  // ─────────────────────────────────────────
  return (
    <div className={styles.form}>
      {/* ── File Upload ──────────────────────── */}
      <FileUpload
        accept=".xlsx,.xls,.csv"
        multiple={false}
        maxSize={20 * 1024 * 1024}
        maxFiles={1}
        label="File Excel PPh"
        hint="Format: .xlsx, .xls, atau .csv · Jenis upload terdeteksi otomatis"
        disabled={importing}
        onFilesChange={handleFilesChange}
      />

      {/* Detected type badge */}
      {typeInfo && !importing && (
        <div className={styles.detectedType}>
          <Badge variant={typeInfo.variant}>Terdeteksi: {typeInfo.label}</Badge>
          <p className={styles.detectedDesc}>
            {uploadType === "main"
              ? "Posting Date, Document Number, Reference, Company Code, Amount, Text, G/L Account"
              : "Posting Date, Company Code, Document Number, Vendor, Purchasing Document"}
          </p>
        </div>
      )}

      {/* Progress */}
      {importing && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className={styles.progressMeta}>
            <span>
              {percent}% — chunk {progress.current} dari {progress.total}
            </span>
            <button
              className={styles.abortBtn}
              onClick={() => {
                abortRef.current = true;
              }}
            >
              Batalkan
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert
          variant="danger"
          description={error}
          dismissible
          onDismiss={() => setError(null)}
        />
      )}

      {/* ── Tombol Import ────────────────────── */}
      <Button
        variant="primary"
        iconLeft={<Upload size={16} />}
        onClick={handleImport}
        loading={importing}
        disabled={!canImport}
        fullWidth
      >
        {importing
          ? `Mengimport chunk ${progress.current}/${progress.total}...`
          : `Import ${typeInfo?.label ?? "Data PPh"}`}
      </Button>

      {/* ── Result ──────────────────────────── */}
      {result && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <span className={styles.resultTitle}>
              Hasil Import — {UPLOAD_TYPE_META[result.uploadType]?.label}
            </span>
            <Badge
              variant={result.aborted ? "warning" : "success"}
              icon={<CheckCircle size={12} />}
            >
              {result.aborted ? "Dibatalkan" : "Selesai"}
            </Badge>
          </div>

          <div className={styles.statGrid}>
            <StatItem label="Total Baris" value={result.total_rows} />
            {result.uploadType === "main" ? (
              <>
                <StatItem
                  label="Berhasil"
                  value={result.imported}
                  variant="success"
                />
                <StatItem
                  label="Duplikat Dilewati"
                  value={result.duplicates}
                  variant="warning"
                />
              </>
            ) : (
              <StatItem
                label="Vendor Diupdate"
                value={result.updated}
                variant="success"
              />
            )}
            <StatItem
              label="Error"
              value={result.errors.length}
              variant={result.errors.length > 0 ? "danger" : "default"}
            />
          </div>

          {result.errors.length > 0 && (
            <div className={styles.errorList}>
              {result.errors.slice(0, 50).map((err: any, i: number) => (
                <div key={i} className={styles.errorItem}>
                  <AlertTriangle size={13} />
                  <span>
                    <strong>Baris {err.row}:</strong> {err.error}
                  </span>
                </div>
              ))}
              {result.errors.length > 50 && (
                <p className={styles.errorMore}>
                  ...dan {result.errors.length - 50} error lainnya
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Panduan (collapsible) ────────────── */}
      <div className={styles.guide}>
        <button
          className={styles.guideToggle}
          onClick={() => setShowGuide((v) => !v)}
        >
          <span>Panduan & Kolom Wajib</span>
          {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showGuide && (
          <div className={styles.guideBody}>
            <p className={styles.guideLabel}>Import Utama (G/L Account):</p>
            <ul className={styles.guideList}>
              <li>
                <strong>Posting Date</strong> — Tanggal posting
              </li>
              <li>
                <strong>Document Number</strong> — Nomor dokumen
              </li>
              <li>
                <strong>Reference</strong> — Referensi
              </li>
              <li>
                <strong>Company Code</strong> — Kode perusahaan
              </li>
              <li>
                <strong>Amount in local currency</strong> — Nilai
              </li>
              <li>
                <strong>Text</strong> — Keterangan
              </li>
              <li>
                <strong>G/L Account</strong> — Akun GL / jenis PPh
              </li>
            </ul>
            <p
              className={styles.guideLabel}
              style={{ marginTop: "var(--space-3)" }}
            >
              Update Vendor:
            </p>
            <ul className={styles.guideList}>
              <li>
                <strong>Posting Date</strong> — Tanggal posting
              </li>
              <li>
                <strong>Document Number</strong> — Nomor dokumen
              </li>
              <li>
                <strong>Company Code</strong> — Kode perusahaan
              </li>
              <li>
                <strong>Vendor</strong> — Kode vendor SAP
              </li>
            </ul>
            <p
              className={styles.guideLabel}
              style={{ marginTop: "var(--space-3)" }}
            >
              Jenis PPh dari G/L:
            </p>
            <ul className={styles.guideList}>
              <li>
                <strong>21510001</strong> — PPh Ps. 21
              </li>
              <li>
                <strong>21520001</strong> — PPh Ps. 23
              </li>
              <li>
                <strong>21520002</strong> — PPh Ps. 4 (2)
              </li>
              <li>
                <strong>21520003</strong> — PPh Ps. 22
              </li>
              <li>
                <strong>21540001</strong> — PPh Ps. 26
              </li>
              <li>
                <strong>21580001</strong> — PPh Ps. 15
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
function StatItem({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <div className={styles.statItem}>
      <span className={styles.statValue} data-variant={variant}>
        {value.toLocaleString("id-ID")}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
