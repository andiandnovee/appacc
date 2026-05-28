import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, CheckCircle, AlertTriangle } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import styles from "./SapPoImportPage.module.css";
import api from "../../api/axios";
import FileUpload from "../../components/ui/FileUpload";
import Select from "../../components/ui/Select";

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

export default function F53ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [stageSapId, setStageSapId] = useState<string>("");
  const [fileValid, setFileValid] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

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
  // tambah state di atas, setelah stageSapId
const [stageYear, setStageYear] = useState<string>(
  new Date().getFullYear().toString()
);

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

      let totalImported = 0;
      let totalDuplicates = 0;
      const allErrors: any[] = [];

      for (let i = 0; i < chunks.length; i++) {
        if (abortRef.current) break;

        const { data } = await api.post("/sap/f53-import", {
          rows: chunks[i],
          stage_sap_id: parseInt(stageSapId),
        });

        totalImported += data.imported ?? 0;
        totalDuplicates += data.duplicates ?? 0;

        if (Array.isArray(data.errors)) allErrors.push(...data.errors);

        setProgress({ current: i + 1, total: chunks.length });
      }

      setResult({
        success: !abortRef.current,
        aborted: abortRef.current,
        total_rows: rows.length,
        imported: totalImported,
        duplicates: totalDuplicates,
        errors: allErrors,
      });

      if (!abortRef.current) setFile(null);
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
      setFileValid(false);
    }
  };

  const percent = progress.total
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  const canImport = !!file && fileValid && !!stageSapId && !importing;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Import Data F53</h1>
          <p className={styles.subtitle}>
            Upload file Excel laporan F53 — kolom wajib divalidasi otomatis
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Upload Section */}
        <Card variant="outlined">
          <Card.Header title="Upload File" />
          <Card.Body>
            {/* Stage input */}

            {/* Filter tahun + Stage */}
<div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-end", marginBottom: "var(--space-1)" }}>
  <div style={{ width: "90px", flexShrink: 0 }}>
    <label style={{
      display: "block",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-medium)",
      color: "var(--text-primary)",
      marginBottom: "var(--space-1)",
    }}>
      Tahun
    </label>
    <input
      type="number"
      value={stageYear}
      onChange={(e) => {
        setStageSapId("");         // reset pilihan stage saat tahun berubah
        setStageYear(e.target.value);
      }}
      disabled={importing}
      min="2020"
      max="2099"
      style={{
        width: "100%",
        padding: "var(--space-2) var(--space-3)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-default)",
        fontSize: "var(--text-sm)",
        background: "var(--surface-primary)",
        color: "var(--text-primary)",
        boxSizing: "border-box",
      }}
    />
  </div>

  <div style={{ flex: 1 }}>
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

            <FileUpload
              accept=".xlsx,.xls,.csv"
              multiple={false}
              maxSize={20 * 1024 * 1024}
              maxFiles={1}
              label="File Excel F53"
              hint="Format: .xlsx, .xls, atau .csv"
              disabled={importing}
              onFilesChange={handleFilesChange}
            />

            {/* Valid badge */}
            {fileValid && !importing && (
              <div style={{ marginTop: "var(--space-3)" }}>
                <Badge variant="success" icon={<CheckCircle size={12} />}>
                  Format valid — siap diimport
                </Badge>
              </div>
            )}

            {/* Progress */}
            {importing && (
              <div
                className={styles.progressWrap}
                style={{ marginTop: "var(--space-4)" }}
              >
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
              <div style={{ marginTop: "var(--space-3)" }}>
                <Alert
                  variant="danger"
                  description={error}
                  dismissible
                  onDismiss={() => setError(null)}
                />
              </div>
            )}
          </Card.Body>
          <Card.Footer>
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
          </Card.Footer>
        </Card>

        {/* Panduan */}
        <Card variant="flat">
          <Card.Header title="Panduan Import" />
          <Card.Body>
            <div className={styles.instructions}>
              <h4>Kolom wajib:</h4>
              <ul>
                <li>
                  <strong>Document Date</strong> — Tanggal dokumen
                </li>
                <li>
                  <strong>Assignment</strong> — Assignment
                </li>
                <li>
                  <strong>Business Area</strong> — Kode business area (untuk
                  auto-detect company)
                </li>
                <li>
                  <strong>Vendor</strong> — Kode vendor SAP
                </li>
                <li>
                  <strong>Amount in local currency</strong> — Nilai (tanda
                  dibalik otomatis)
                </li>
                <li>
                  <strong>Text</strong> — Keterangan; jika diawali{" "}
                  <strong>45</strong> (10 digit), otomatis jadi PO number
                </li>
                <li>
                  <strong>Document Number</strong> — Nomor dokumen
                </li>
                <li>
                  <strong>Reference</strong> — Referensi
                </li>
              </ul>
              <h4 style={{ marginTop: "var(--space-4)" }}>Catatan:</h4>
              <ul>
                <li>
                  Duplikasi dicek berdasarkan{" "}
                  <strong>Document Number + Business Area</strong>
                </li>
                <li>Amount negatif → positif, positif → negatif (otomatis)</li>
                <li>Company terisi otomatis dari mapping Business Area</li>
                <li>Stage SAP ID wajib dipilih sebelum upload</li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Result */}
      {result && (
        <Card variant="outlined">
          <Card.Header
            title="Hasil Import F53"
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
