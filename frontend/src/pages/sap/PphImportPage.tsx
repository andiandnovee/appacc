import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, CheckCircle, AlertTriangle } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import styles from "./SapPoImportPage.module.css";
import api from "../../api/axios";

const CHUNK_SIZE = 500;

type UploadType = "main" | "vendor" | null;

function detectUploadType(rows: any[]): UploadType {
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);
  if (headers.includes("G/L Account")) return "main";
  if (headers.includes("Vendor")) return "vendor";
  return null;
}

const UPLOAD_TYPE_LABEL: Record<
  string,
  { label: string; variant: string; desc: string }
> = {
  main: {
    label: "Import Utama",
    variant: "info",
    desc: "Posting Date, Document Number, Reference, Company Code, Amount in local currency, Text, G/L Account",
  },
  vendor: {
    label: "Update Vendor",
    variant: "warning",
    desc: "Posting Date, Company Code, Document Number, Vendor, Purchasing Document",
  },
};

export default function PphImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<UploadType>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
    setError(null);
    setUploadType(null);

    if (selected) {
      parseExcel(selected)
        .then((rows) => {
          const type = detectUploadType(rows);
          if (!type) {
            setError(
              "Format file tidak dikenali. Pastikan kolom G/L atau Vendor tersedia.",
            );
            setFile(null);
          } else {
            setUploadType(type);
          }
        })
        .catch(() => {
          setError("Gagal membaca file Excel");
          setFile(null);
        });
    }
  };

  const parseExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
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
      reader.readAsBinaryString(file);
    });
  };

  const handleImport = async () => {
    if (!file || !uploadType) return;

    setImporting(true);
    setError(null);
    setResult(null);
    abortRef.current = false;

    try {
      const rows = await parseExcel(file);

      if (!rows.length) throw new Error("File kosong atau tidak memiliki data");

      // Split chunks
      const chunks: any[][] = [];
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        chunks.push(rows.slice(i, i + CHUNK_SIZE));
      }

      setProgress({ current: 0, total: chunks.length });

      // Aggregated
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

      if (!abortRef.current) setFile(null);
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError(err.response?.data?.message || "Validasi gagal");
        return;
      }
      if (err.response?.status === 401) {
        setError("Sesi login habis, silakan login kembali");
        return;
      }
      if (err.response?.status === 403) {
        setError("Anda tidak memiliki akses");
        return;
      }
      setError(
        err.response?.data?.message || err.message || "Gagal mengimport data",
      );
    } finally {
      setImporting(false);
    }
  };

  const percent = progress.total
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  const typeInfo = uploadType ? UPLOAD_TYPE_LABEL[uploadType] : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Import Data PPh</h1>
          <p className={styles.subtitle}>
            Upload file Excel data PPh — jenis upload terdeteksi otomatis dari
            kolom
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
                id="pph-file"
                className={styles.fileInput}
              />
              <label htmlFor="pph-file" className={styles.fileLabel}>
                {file ? file.name : "Pilih file Excel (.xlsx, .xls, .csv)"}
              </label>
              {file && (
                <p className={styles.fileInfo}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>

            {/* Detected type badge */}
            {typeInfo && !importing && (
              <div style={{ marginBottom: "var(--space-4)" }}>
                <Badge variant={typeInfo.variant as any}>
                  Terdeteksi: {typeInfo.label}
                </Badge>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-secondary)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {typeInfo.desc}
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
              disabled={!file || !uploadType || importing}
              fullWidth
            >
              {importing
                ? `Mengimport chunk ${progress.current}/${progress.total}...`
                : `Import ${typeInfo?.label ?? "Data"}`}
            </Button>
          </Card.Footer>
        </Card>

        {/* Panduan */}
        <Card variant="flat">
          <Card.Header title="Panduan Import" />
          <Card.Body>
            <div className={styles.instructions}>
              <h4>Upload Pertama — Import Utama:</h4>
              <ul>
                <li>
                  <strong>Posting Date</strong> — Tanggal posting (wajib)
                </li>
                <li>
                  <strong>Document Number</strong> — Nomor dokumen (wajib)
                </li>
                <li>
                  <strong>Reference</strong> — Referensi
                </li>
                <li>
                  <strong>Company Code</strong> — Kode perusahaan (wajib)
                </li>
                <li>
                  <strong>Amount in local currency</strong> — Nilai (wajib)
                </li>
                <li>
                  <strong>Text</strong> — Keterangan
                </li>
                <li>
                  <strong>G/L</strong> — Akun GL / jenis PPh (wajib)
                </li>
              </ul>
              <h4 style={{ marginTop: "var(--space-4)" }}>
                Upload Kedua — Update Vendor:
              </h4>
              <ul>
                <li>
                  <strong>Posting Date</strong> — Tanggal posting (wajib)
                </li>
                <li>
                  <strong>Document Number</strong> — Nomor dokumen (wajib)
                </li>
                <li>
                  <strong>Company Code</strong> — Kode perusahaan (wajib)
                </li>
                <li>
                  <strong>Vendor</strong> — Kode vendor (wajib)
                </li>
              </ul>
              <h4 style={{ marginTop: "var(--space-4)" }}>
                Jenis PPh dari G/L:
              </h4>
              <ul>
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
          </Card.Body>
        </Card>
      </div>

      {/* Result */}
      {result && (
        <Card variant="outlined">
          <Card.Header
            title={`Hasil Import — ${UPLOAD_TYPE_LABEL[result.uploadType]?.label}`}
            action={
              <Badge
                variant={result.aborted ? "warning" : "success"}
                icon={<CheckCircle size={14} />}
              >
                {result.aborted ? "Dibatalkan" : "Selesai"}
              </Badge>
            }
          />
          <Card.Body>
            <div className={styles.resultGrid}>
              <StatCard
                label="Total Baris"
                value={result.total_rows.toLocaleString("id-ID")}
                variant="default"
              />
              {result.uploadType === "main" ? (
                <>
                  <StatCard
                    label="Berhasil Diimport"
                    value={result.imported.toLocaleString("id-ID")}
                    variant="success"
                  />
                  <StatCard
                    label="Duplikat Dilewati"
                    value={result.duplicates.toLocaleString("id-ID")}
                    variant="warning"
                  />
                </>
              ) : (
                <StatCard
                  label="Vendor Diupdate"
                  value={result.updated.toLocaleString("id-ID")}
                  variant="success"
                />
              )}
              <StatCard
                label="Error"
                value={result.errors.length.toLocaleString("id-ID")}
                variant={result.errors.length > 0 ? "danger" : "default"}
              />
            </div>

            {result.errors.length > 0 && (
              <div className={styles.errorSection}>
                <Alert
                  variant="warning"
                  title={`${result.errors.length} baris gagal diproses`}
                  description="Periksa detail error di bawah"
                />
                <div className={styles.errorList}>
                  {result.errors.slice(0, 50).map((err: any, i: number) => (
                    <div key={i} className={styles.errorItem}>
                      <AlertTriangle size={14} />
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
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: any;
  variant?: string;
}) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${styles[`stat_${variant}`]}`}>
        {value}
      </span>
    </div>
  );
}
