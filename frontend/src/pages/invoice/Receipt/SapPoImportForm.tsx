/**
 * SapPoImportForm.tsx
 * Path: frontend/src/pages/invoice/ReceiptManagement/SapPoImportForm.tsx
 *
 * Dipakai di dalam Drawer — tidak ada Card wrapper, tidak ada halaman sendiri.
 * Extracted dari SapPoImportPage.tsx, mengikuti pattern F53ImportForm.
 */

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import Badge from "../../../components/ui/Badge";
import FileUpload from "../../../components/ui/FileUpload";
import api from "../../../api/axios";
import styles from "./SapPoImportForm.module.css";

// ─────────────────────────────────────────────
const CHUNK_SIZE = 500;

// ─────────────────────────────────────────────
interface Props {
  onSuccess?: () => void;
}

export default function SapPoImportForm({ onSuccess }: Props) {
  const [file, setFile]           = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress]   = useState({ current: 0, total: 0 });
  const [result, setResult]       = useState<any>(null);
  const [error, setError]         = useState<string | null>(null);
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
        } catch (err) { reject(err); }
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

    if (!selected) return;

    parseExcel(selected).catch(() => {
      setError("Gagal membaca file Excel.");
      setFile(null);
    });
  };

  // ── Import ────────────────────────────────
  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);
    setResult(null);
    abortRef.current = false;

    try {
      const rows = await parseExcel(file);

      if (!rows.length) {
        throw new Error("File kosong atau tidak memiliki data");
      }

      const batchId = new Date().toISOString().slice(0, 7); // YYYY-MM

      const chunks: any[][] = [];
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        chunks.push(rows.slice(i, i + CHUNK_SIZE));
      }

      setProgress({ current: 0, total: chunks.length });

      let totalImported   = 0;
      let totalDuplicates = 0;
      let totalVendors    = 0;
      let totalGroups     = 0;
      const allErrors: any[] = [];

      for (let i = 0; i < chunks.length; i++) {
        if (abortRef.current) break;

        const { data } = await api.post("/sap/import-po-chunk", {
          rows: chunks[i],
          batch_id: batchId,
        });

        totalImported   += data.imported ?? 0;
        totalDuplicates += data.duplicates ?? 0;
        totalVendors    += data.vendors_synced ?? 0;
        totalGroups     += data.groups_synced ?? 0;
        if (Array.isArray(data.errors)) allErrors.push(...data.errors);
        setProgress({ current: i + 1, total: chunks.length });
      }

      setResult({
        success:        !abortRef.current,
        aborted:        abortRef.current,
        batch_id:       batchId,
        total_rows:     rows.length,
        imported:       totalImported,
        duplicates:     totalDuplicates,
        vendors_synced: totalVendors,
        groups_synced:  totalGroups,
        errors:         allErrors,
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
      setError(err.response?.data?.message || err.message || "Gagal mengimport data");
    } finally {
      setImporting(false);
    }
  };

  const percent   = progress.total ? Math.round((progress.current / progress.total) * 100) : 0;
  const canImport = !!file && !importing;

  // ─────────────────────────────────────────
  return (
    <div className={styles.form}>

      {/* ── File Upload ──────────────────────── */}
      <FileUpload
        accept=".xlsx,.xls,.csv"
        multiple={false}
        maxSize={20 * 1024 * 1024}
        maxFiles={1}
        label="File Excel SAP PO"
        hint="Format: .xlsx, .xls, atau .csv · Maks 20 MB"
        disabled={importing}
        onFilesChange={handleFilesChange}
      />

      {/* Progress */}
      {importing && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${percent}%` }} />
          </div>
          <div className={styles.progressMeta}>
            <span>{percent}% — chunk {progress.current} dari {progress.total}</span>
            <button className={styles.abortBtn} onClick={() => { abortRef.current = true; }}>
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
          : "Import Data PO"}
      </Button>

      {/* ── Result ──────────────────────────── */}
      {result && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <span className={styles.resultTitle}>Hasil Import — Batch {result.batch_id}</span>
            <Badge variant={result.aborted ? "warning" : "success"} icon={<CheckCircle size={12} />}>
              {result.aborted ? "Dibatalkan" : "Selesai"}
            </Badge>
          </div>

          <div className={styles.statGrid}>
            <StatItem label="Total Baris"       value={result.total_rows}     />
            <StatItem label="Berhasil"          value={result.imported}       variant="success" />
            <StatItem label="Duplikat Dilewati" value={result.duplicates}     variant="warning" />
            <StatItem label="Vendor Baru"       value={result.vendors_synced} variant="default" />
            <StatItem label="Purc. Group Baru"  value={result.groups_synced}  variant="default" />
            <StatItem label="Error"             value={result.errors.length}  variant={result.errors.length > 0 ? "danger" : "default"} />
          </div>

          {result.errors.length > 0 && (
            <div className={styles.errorList}>
              {result.errors.slice(0, 50).map((err: any, i: number) => (
                <div key={i} className={styles.errorItem}>
                  <AlertTriangle size={13} />
                  <span><strong>Baris {err.row}:</strong> {err.error}</span>
                </div>
              ))}
              {result.errors.length > 50 && (
                <p className={styles.errorMore}>...dan {result.errors.length - 50} error lainnya</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Panduan (collapsible) ────────────── */}
      <div className={styles.guide}>
        <button className={styles.guideToggle} onClick={() => setShowGuide((v) => !v)}>
          <span>Panduan & Kolom Wajib</span>
          {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showGuide && (
          <div className={styles.guideBody}>
            <p className={styles.guideLabel}>Kolom wajib:</p>
            <ul className={styles.guideList}>
              <li><strong>PO No</strong> — Nomor PO</li>
              <li><strong>Item No</strong> — Line item PO</li>
              <li><strong>PO UoM</strong> — Satuan</li>
              <li><strong>PO Qty</strong> — Jumlah</li>
              <li><strong>Net Value</strong> — Nilai PO (angka)</li>
              <li><strong>Plant</strong> — Kode Business Area</li>
              <li><strong>Vendor</strong> — Kode vendor SAP</li>
              <li><strong>Vendor Name</strong> — Nama vendor</li>
              <li><strong>Purc. Grp</strong> — Purchasing Group</li>
              <li><strong>Buyer Name</strong> — Nama buyer</li>
            </ul>
            <p className={styles.guideLabel} style={{ marginTop: "var(--space-3)" }}>Catatan:</p>
            <ul className={styles.guideList}>
              <li>Duplikat <strong>PO No + Item No</strong> akan dilewati otomatis</li>
              <li>Vendor baru otomatis disync ke master vendor</li>
              <li>File besar diproses per 500 baris (chunked)</li>
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────
function StatItem({
  label, value, variant = "default",
}: {
  label: string; value: number; variant?: "default" | "success" | "warning" | "danger";
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