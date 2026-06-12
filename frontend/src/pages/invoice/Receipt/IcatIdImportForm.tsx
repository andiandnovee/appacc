/**
 * IcatIdImportForm.tsx
 * Path: frontend/src/pages/invoice/ReceiptManagement/IcatIdImportForm.tsx
 *
 * Update kolom icat_id pada invoice_receipts berdasarkan PO_Number,
 * dengan Total sebagai disambiguator untuk PO yang punya >1 invoice receipt.
 * Mengikuti pattern SapPoImportForm.
 */

import { useState, useRef } from "react";
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import Badge from "../../../components/ui/Badge";
import api from "../../../api/axios";
import styles from "./SapPoImportForm.module.css";

// ─────────────────────────────────────────────
const CHUNK_SIZE = 500;

// ─────────────────────────────────────────────
interface Props {
  rows: any[];
  fileName: string;
  onSuccess?: () => void;
  onReset: () => void;
}

export default function IcatIdImportForm({ rows, fileName, onSuccess, onReset }: Props) {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress]   = useState({ current: 0, total: 0 });
  const [result, setResult]       = useState<any>(null);
  const [error, setError]         = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const abortRef = useRef(false);

  // ── Import ────────────────────────────────
  const handleImport = async () => {
    if (!rows.length) return;

    setImporting(true);
    setError(null);
    setResult(null);
    abortRef.current = false;

    try {
      const chunks: any[][] = [];
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        chunks.push(rows.slice(i, i + CHUNK_SIZE));
      }

      setProgress({ current: 0, total: chunks.length });

      let totalImported = 0;
      const allNotFound: any[] = [];
      const allAmbiguous: any[] = [];

      for (let i = 0; i < chunks.length; i++) {
        if (abortRef.current) break;

        const { data } = await api.post("/receipts/import-icat-chunk", {
          rows: chunks[i],
        });

        totalImported += data.imported ?? 0;
        if (Array.isArray(data.not_found)) allNotFound.push(...data.not_found);
        if (Array.isArray(data.ambiguous)) allAmbiguous.push(...data.ambiguous);
        setProgress({ current: i + 1, total: chunks.length });
      }

      setResult({
        aborted:    abortRef.current,
        total_rows: rows.length,
        imported:   totalImported,
        not_found:  allNotFound,
        ambiguous:  allAmbiguous,
      });

      if (!abortRef.current) {
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
  const canImport = rows.length > 0 && !importing;

  // ─────────────────────────────────────────
  return (
    <div className={styles.form}>

      {/* ── File terdeteksi ──────────────────── */}
      <div className={styles.detectedFile}>
        <span>
          File: <strong>{fileName}</strong> · {rows.length.toLocaleString("id-ID")} baris
        </span>
        <Badge variant="default">ICAT ID Export</Badge>
        {!importing && !result && (
          <button className={styles.changeFileBtn} onClick={onReset}>
            Ganti file
          </button>
        )}
      </div>

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
      {!result && (
        <Button
          variant="primary"
          onClick={handleImport}
          loading={importing}
          disabled={!canImport}
          fullWidth
        >
          {importing
            ? `Mengimport chunk ${progress.current}/${progress.total}...`
            : "Update ICAT ID"}
        </Button>
      )}

      {/* ── Result ──────────────────────────── */}
      {result && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <span className={styles.resultTitle}>Hasil Update ICAT ID</span>
            <Badge variant={result.aborted ? "warning" : "success"} icon={<CheckCircle size={12} />}>
              {result.aborted ? "Dibatalkan" : "Selesai"}
            </Badge>
          </div>

          <div className={styles.statGrid}>
            <StatItem label="Total Baris"     value={result.total_rows} />
            <StatItem label="Berhasil"        value={result.imported}   variant="success" />
            <StatItem label="Tidak Ditemukan" value={result.not_found.length} variant={result.not_found.length > 0 ? "warning" : "default"} />
            <StatItem label="Ambigu"          value={result.ambiguous.length}  variant={result.ambiguous.length > 0 ? "danger" : "default"} />
          </div>

          {result.not_found.length > 0 && (
            <div className={styles.errorList}>
              <p className={styles.guideLabel}>PO tidak ditemukan di Invoice Receipt:</p>
              {result.not_found.slice(0, 50).map((item: any, i: number) => (
                <div key={i} className={styles.errorItem}>
                  <AlertTriangle size={13} />
                  <span>PO <strong>{item.po_number}</strong> (ICAT ID: {item.icat_id})</span>
                </div>
              ))}
              {result.not_found.length > 50 && (
                <p className={styles.errorMore}>...dan {result.not_found.length - 50} lainnya</p>
              )}
            </div>
          )}

          {result.ambiguous.length > 0 && (
            <div className={styles.errorList}>
              <p className={styles.guideLabel}>PO ambigu (multi-invoice, total tidak cocok persis):</p>
              {result.ambiguous.slice(0, 50).map((item: any, i: number) => (
                <div key={i} className={styles.errorItem}>
                  <AlertTriangle size={13} />
                  <span>
                    PO <strong>{item.po_number}</strong> — {item.candidates} kandidat,
                    {" "}{item.amount_match} cocok dgn Total {Number(item.total).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
              {result.ambiguous.length > 50 && (
                <p className={styles.errorMore}>...dan {result.ambiguous.length - 50} lainnya</p>
              )}
            </div>
          )}

          <Button variant="outline" onClick={onReset} fullWidth>
            Import File Lain
          </Button>
        </div>
      )}

      {/* ── Panduan (collapsible) ────────────── */}
      <div className={styles.guide}>
        <button className={styles.guideToggle} onClick={() => setShowGuide((v) => !v)}>
          <span>Panduan</span>
          {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showGuide && (
          <div className={styles.guideBody}>
            <p className={styles.guideLabel}>Kolom yang dibaca:</p>
            <ul className={styles.guideList}>
              <li><strong>ID</strong> — ICAT ID, akan diisi ke kolom <code>icat_id</code></li>
              <li><strong>PO_Number</strong> — dicocokkan ke <code>po_number</code></li>
              <li><strong>Total</strong> — dicocokkan ke <code>amount</code> jika 1 PO punya lebih dari 1 invoice receipt</li>
            </ul>
            <p className={styles.guideLabel} style={{ marginTop: "var(--space-3)" }}>Catatan:</p>
            <ul className={styles.guideList}>
              <li>Receipt yang sudah punya <code>icat_id</code> tidak akan ditimpa (aman untuk re-import)</li>
              <li>Jika 1 PO = 1 invoice receipt, ICAT ID langsung diisi tanpa cek Total</li>
              <li>Jika 1 PO &gt; 1 invoice receipt, dicari yang nilai <code>amount</code>-nya cocok persis dengan <code>Total</code></li>
              <li>Jika tidak ketemu kecocokan persis → masuk daftar "Ambigu", perlu dicek manual</li>
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