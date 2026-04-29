import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, CheckCircle, AlertTriangle, Download } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import styles from "./SapPoImportPage.module.css";

const CHUNK_SIZE = 500;

export default function SapPoImportPage() {
  const [file, setFile]           = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress]   = useState({ current: 0, total: 0 });
  const [result, setResult]       = useState<any>(null);
  const [error, setError]         = useState<string | null>(null);
  const abortRef                  = useRef(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setResult(null);
    setError(null);
  };

  const parseExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb   = XLSX.read(e.target?.result, { type: "binary" });
          const ws   = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { defval: null });
          resolve(rows as any[]);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  };

  const handleImport = async () => {
    if (!file) { setError("Pilih file terlebih dahulu"); return; }

    const token = localStorage.getItem("appacc_token") ?? sessionStorage.getItem("appacc_token");
    if (!token) { setError("Sesi login habis, silakan login kembali"); return; }

    setImporting(true);
    setError(null);
    setResult(null);
    abortRef.current = false;

    try {
      const rows    = await parseExcel(file);
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

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/sap/import-po-chunk`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rows: chunks[i], batch_id: batchId }),
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Import chunk gagal");

        totalImported   += data.imported        ?? 0;
        totalDuplicates += data.duplicates      ?? 0;
        totalVendors    += data.vendors_synced  ?? 0;
        totalGroups     += data.groups_synced   ?? 0;
        allErrors.push(...(data.errors ?? []));

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

      if (!abortRef.current) setFile(null);

    } catch (err: any) {
      setError(err.message ?? "Gagal mengimport data");
    } finally {
      setImporting(false);
    }
  };

  const percent = progress.total
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Import Data SAP PO</h1>
          <p className={styles.subtitle}>
            Upload file Excel/CSV berisi data Purchase Order dari SAP
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Upload Section */}
        <Card variant="outlined">
          <Card.Header title="Upload File" />
          <Card.Body>
            <div className={styles.uploadArea}>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                disabled={importing}
                id="po-file"
                className={styles.fileInput}
              />
              <label htmlFor="po-file" className={styles.fileLabel}>
                {file ? file.name : "Pilih file Excel (.xlsx, .xls, .csv)"}
              </label>
              {file && (
                <p className={styles.fileInfo}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
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
                  <button
                    className={styles.abortBtn}
                    onClick={() => { abortRef.current = true; }}
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            )}

            {error && (
              <Alert
                variant="danger"
                description={error}
                dismissible
                onDismiss={() => setError(null)}
              />
            )}
          </Card.Body>
          <Card.Footer>
            <Button
              variant="primary"
              iconLeft={<Upload size={16} />}
              onClick={handleImport}
              loading={importing}
              disabled={!file || importing}
              fullWidth
            >
              {importing
                ? `Mengimport chunk ${progress.current}/${progress.total}...`
                : "Import Data"}
            </Button>
          </Card.Footer>
        </Card>

        {/* Instructions */}
        <Card variant="flat">
          <Card.Header title="Panduan Import" />
          <Card.Body>
            <div className={styles.instructions}>
              <h4>Format Kolom Excel:</h4>
              <ul>
                <li><strong>PO No</strong> — Nomor PO (wajib)</li>
                <li><strong>Item No</strong> — Line item PO (wajib)</li>
                <li><strong>PO UoM</strong> — Satuan</li>
                <li><strong>PO Qty</strong> — Jumlah</li>
                <li><strong>Net Value</strong> — Nilai PO (angka)</li>
                <li><strong>Plant</strong> — Kode Business Area</li>
                <li><strong>Vendor</strong> — Kode vendor SAP</li>
                <li><strong>Vendor Name</strong> — Nama vendor</li>
                <li><strong>Purc. Grp</strong> — Purchasing Group</li>
                <li><strong>Buyer Name</strong> — Nama buyer</li>
              </ul>
              <h4 style={{ marginTop: "var(--spacing-4)" }}>Catatan:</h4>
              <ul>
                <li>Duplikat PO + Item No akan dilewati otomatis</li>
                <li>Vendor baru otomatis disync ke master vendor</li>
                <li>File besar diproses per 500 baris (chunked)</li>
                <li>Import dapat dibatalkan di tengah proses</li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Result */}
      {result && (
        <Card variant="outlined">
          <Card.Header
            title={`Hasil Import — Batch ${result.batch_id}`}
            action={
              <Badge variant={result.aborted ? "warning" : "success"} icon={<CheckCircle size={14} />}>
                {result.aborted ? "Dibatalkan" : "Selesai"}
              </Badge>
            }
          />
          <Card.Body>
            <div className={styles.resultGrid}>
              <StatCard label="Total Baris"        value={result.total_rows.toLocaleString("id-ID")}     variant="default"  />
              <StatCard label="Berhasil Diimport"  value={result.imported.toLocaleString("id-ID")}       variant="success"  />
              <StatCard label="Duplikat Dilewati"  value={result.duplicates.toLocaleString("id-ID")}     variant="warning"  />
              <StatCard label="Vendor Baru"         value={result.vendors_synced.toLocaleString("id-ID")} variant="info"     />
              <StatCard label="Purc. Group Baru"   value={result.groups_synced.toLocaleString("id-ID")}  variant="info"     />
              <StatCard label="Error"               value={result.errors.length.toLocaleString("id-ID")}  variant={result.errors.length > 0 ? "danger" : "default"} />
            </div>

            {result.errors.length > 0 && (
              <div className={styles.errorSection}>
                <Alert
                  variant="warning"
                  title={`${result.errors.length} baris gagal diimport`}
                  description="Periksa detail error di bawah"
                />
                <div className={styles.errorList}>
                  {result.errors.slice(0, 50).map((err: any, i: number) => (
                    <div key={i} className={styles.errorItem}>
                      <AlertTriangle size={14} />
                      <span><strong>Baris {err.row}:</strong> {err.error}</span>
                    </div>
                  ))}
                  {result.errors.length > 50 && (
                    <p className={styles.errorMore}>
                      ...dan {result.errors.length - 50} error lainnya
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

function StatCard({ label, value, variant = "default" }: { label: string; value: any; variant?: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${styles[`stat_${variant}`]}`}>{value}</span>
    </div>
  );
}