/**
 * F53ImportForm.tsx
 * Path: frontend/src/pages/invoice/F53HelperPage/F53ImportForm.tsx
 *
 * Dipakai di dalam Drawer — tidak ada Card wrapper, tidak ada halaman sendiri.
 */

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import Badge from "../../../components/ui/Badge";
import Select from "../../../components/ui/Select";
import FileUpload from "../../../components/ui/FileUpload";
import api from "../../../api/axios";
import styles from "./F53ImportForm.module.css";

// ─────────────────────────────────────────────
const CHUNK_SIZE = 500;

const REQUIRED_HEADERS = [
  "Document Date",
  "Assignment",
  "Business Area",
  "Vendor",
  "Amount in local currency",
  "Text",
  "Document Number",
];

// ─────────────────────────────────────────────
interface Props {
  onSuccess?: () => void;
}

export default function F53ImportForm({ onSuccess }: Props) {
  const [file, setFile]           = useState<File | null>(null);
  const [stageSapId, setStageSapId] = useState<string>("");
  const [stageYear, setStageYear] = useState<string>(new Date().getFullYear().toString());
  const [fileValid, setFileValid] = useState(false);
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
    setFileValid(false);
    if (!selected) return;

    parseExcel(selected)
      .then((rows) => {
        if (!rows.length) {
          setError("File kosong atau tidak memiliki data.");
          setFile(null);
          return;
        }
        const headers = Object.keys(rows[0]);
        const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
        if (missing.length) {
          setError(`Kolom tidak lengkap: ${missing.join(", ")}`);
          setFile(null);
          return;
        }
        setFileValid(true);
      })
      .catch(() => {
        setError("Gagal membaca file Excel.");
        setFile(null);
      });
  };

  // ── Import ────────────────────────────────
  const handleImport = async () => {
    if (!file || !fileValid || !stageSapId) return;

    setImporting(true);
    setError(null);
    setResult(null);
    abortRef.current = false;

    try {
      const rows = await parseExcel(file);
      const chunks: any[][] = [];
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        chunks.push(rows.slice(i, i + CHUNK_SIZE));
      }

      setProgress({ current: 0, total: chunks.length });

      let totalImported   = 0;
      let totalDuplicates = 0;
      const allErrors: any[] = [];

      for (let i = 0; i < chunks.length; i++) {
        if (abortRef.current) break;

        const { data } = await api.post("/sap/f53-import", {
          rows: chunks[i],
          stage_sap_id: parseInt(stageSapId),
        });

        totalImported   += data.imported   ?? 0;
        totalDuplicates += data.duplicates ?? 0;
        if (Array.isArray(data.errors)) allErrors.push(...data.errors);
        setProgress({ current: i + 1, total: chunks.length });
      }

      setResult({
        success:    !abortRef.current,
        aborted:    abortRef.current,
        total_rows: rows.length,
        imported:   totalImported,
        duplicates: totalDuplicates,
        errors:     allErrors,
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
      setFileValid(false);
    }
  };

  const percent   = progress.total ? Math.round((progress.current / progress.total) * 100) : 0;
  const canImport = !!file && fileValid && !!stageSapId && !importing;

  // ─────────────────────────────────────────
  return (
    <div className={styles.form}>

      {/* ── Filter Tahun + Stage ─────────────── */}
      <div className={styles.stageRow}>
        <div className={styles.yearWrap}>
          <label className={styles.label}>Tahun</label>
          <input
            type="number"
            value={stageYear}
            onChange={(e) => {
              setStageSapId("");
              setStageYear(e.target.value);
            }}
            disabled={importing}
            min="2020"
            max="2099"
            className={styles.yearInput}
          />
        </div>
        <div className={styles.stageWrap}>
          <Select
            label="Stage"
            placeholder="Pilih stage..."
            required
            disabled={importing}
            value={stageSapId}
            onChange={(e) => setStageSapId(e.target.value)}
            fetchOptions={{
              endpoint: "/stages",
              searchParam: "search",
              limit: 10,
              filters: stageYear ? { year: stageYear } : {},
            }}
          />
        </div>
      </div>

      {/* ── File Upload ──────────────────────── */}
      <FileUpload
        accept=".xlsx,.xls,.csv"
        multiple={false}
        maxSize={20 * 1024 * 1024}
        maxFiles={1}
        label="File Excel F53"
        hint="Format: .xlsx, .xls, atau .csv · Maks 20 MB"
        disabled={importing}
        onFilesChange={handleFilesChange}
      />

      {/* Valid badge */}
      {fileValid && !importing && (
        <Badge variant="success" icon={<CheckCircle size={12} />}>
          Format valid — siap diimport
        </Badge>
      )}

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
          : "Import Data F53"}
      </Button>

      {/* ── Result ──────────────────────────── */}
      {result && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <span className={styles.resultTitle}>Hasil Import</span>
            <Badge variant={result.aborted ? "warning" : "success"} icon={<CheckCircle size={12} />}>
              {result.aborted ? "Dibatalkan" : "Selesai"}
            </Badge>
          </div>

          <div className={styles.statGrid}>
            <StatItem label="Total Baris"       value={result.total_rows}  />
            <StatItem label="Berhasil"          value={result.imported}    variant="success" />
            <StatItem label="Duplikat Dilewati" value={result.duplicates}  variant="warning" />
            <StatItem label="Error"             value={result.errors.length} variant={result.errors.length > 0 ? "danger" : "default"} />
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
              <li><strong>Document Date</strong> — Tanggal dokumen</li>
              <li><strong>Assignment</strong> — Assignment</li>
              <li><strong>Business Area</strong> — Kode business area (auto-detect company)</li>
              <li><strong>Vendor</strong> — Kode vendor SAP</li>
              <li><strong>Amount in local currency</strong> — Nilai (tanda dibalik otomatis)</li>
              <li><strong>Text</strong> — Keterangan; diawali <strong>45</strong> (10 digit) → PO number</li>
              <li><strong>Document Number</strong> — Nomor dokumen</li>
              <li><strong>Reference</strong> — Referensi</li>
            </ul>
            <p className={styles.guideLabel} style={{ marginTop: "var(--space-3)" }}>Catatan:</p>
            <ul className={styles.guideList}>
              <li>Duplikasi dicek: <strong>Document Number + Business Area</strong></li>
              <li>Amount negatif → positif, positif → negatif (otomatis)</li>
              <li>Company terisi otomatis dari mapping Business Area</li>
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