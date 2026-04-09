import { useState } from "react";
import { Upload, CheckCircle, AlertTriangle, Download } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FileUpload from "../../components/ui/FileUpload";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import styles from "./SapPoImportPage.module.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function SapPoImportPage() {
  const [files, setFiles] = useState([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  

  const handleImport = async () => {
    if (files.length === 0) {
      setError("Pilih file terlebih dahulu");
      return;
    }

    const token = localStorage.getItem("appacc_token") ?? sessionStorage.getItem("appacc_token");
if (!token) {
  setError("Sesi login habis, silakan login kembali");
  return;
}

    setImporting(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("batch_id", new Date().toISOString().slice(0, 7)); // YYYY-MM

     try {
    const response = await fetch(`${API_BASE_URL}/sap/import-po`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type! Biarkan browser yang atur
      },
      body: formData,
    });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Import gagal");
      }

      setResult(data);
      setFiles([]); // Clear files setelah sukses
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    // TODO: Generate template Excel
    alert("Download template - akan diimplementasi");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Import Data SAP PO</h1>
          <p className={styles.subtitle}>
            Upload file Excel/CSV berisi data Purchase Order dari SAP
          </p>
        </div>
        <Button
          variant="outline"
          iconLeft={<Download size={16} />}
          onClick={downloadTemplate}
        >
          Download Template
        </Button>
      </div>

      <div className={styles.grid}>
        {/* Upload Section */}
        <Card variant="outlined">
          <Card.Header title="Upload File" />
          <Card.Body>
            <FileUpload
              accept=".xlsx,.xls,.csv"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              onFilesChange={setFiles}
              label="File SAP PO"
              hint="Format: Excel (.xlsx, .xls) atau CSV"
            />

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
              disabled={files.length === 0 || importing}
              fullWidth
            >
              {importing ? "Mengimport..." : "Import Data"}
            </Button>
          </Card.Footer>
        </Card>

        {/* Instructions */}
        <Card variant="flat">
          <Card.Header title="Panduan Import" />
          <Card.Body>
            <div className={styles.instructions}>
              <h4>Format File Excel/CSV:</h4>
              <ul>
                <li>
                  <strong>po_number</strong> — Nomor PO (wajib)
                </li>
                <li>
                  <strong>item_line</strong> — Line item PO (wajib)
                </li>
                <li>
                  <strong>business_area_code</strong> — Kode Business Area
                </li>
                <li>
                  <strong>sap_vendor_id</strong> — Kode vendor SAP
                </li>
                <li>
                  <strong>vendor_name</strong> — Nama vendor
                </li>
                <li>
                  <strong>amount</strong> — Nominal
                </li>
                <li>
                  <strong>gr_number</strong> — Goods Receipt (opsional)
                </li>
                <li>
                  <strong>purchasing_group</strong> — Purchasing Group
                  (opsional)
                </li>
                <li>
                  <strong>pr_number</strong> — PR Number (opsional)
                </li>
              </ul>

              <h4 style={{ marginTop: "var(--space-4)" }}>Catatan:</h4>
              <ul>
                <li>
                  Data dengan PO + item line yang sama akan diabaikan (duplicate
                  prevention)
                </li>
                <li>Vendor baru akan otomatis ditambahkan ke master vendor</li>
                <li>Import dilakukan per batch bulanan</li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Import Result */}
      {result && (
        <Card variant="outlined">
          <Card.Header
            title="Hasil Import"
            action={
              <Badge variant="success" icon={<CheckCircle size={14} />}>
                Selesai
              </Badge>
            }
          />
          <Card.Body>
            <div className={styles.resultGrid}>
              <StatCard
                label="Data Diimport"
                value={result.imported}
                variant="success"
              />
              <StatCard
                label="Data Duplikat"
                value={result.duplicates}
                variant="warning"
              />
              <StatCard
                label="Vendor Baru"
                value={result.vendors_synced}
                variant="info"
              />
              <StatCard
                label="Error"
                value={result.errors?.length || 0}
                variant={result.errors?.length > 0 ? "danger" : "default"}
              />
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className={styles.errorSection}>
                <Alert
                  variant="warning"
                  title={`${result.errors.length} baris gagal diimport`}
                  description="Periksa detail error di bawah"
                />
                <div className={styles.errorList}>
                  {result.errors.slice(0, 5).map((err, i) => (
                    <div key={i} className={styles.errorItem}>
                      <AlertTriangle size={14} />
                      <span>
                        <strong>Baris {err.row}:</strong> {err.error}
                      </span>
                    </div>
                  ))}
                  {result.errors.length > 5 && (
                    <p className={styles.errorMore}>
                      ... dan {result.errors.length - 5} error lainnya
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

// Helper Component
function StatCard({ label, value, variant = "default" }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${styles[`stat-${variant}`]}`}>
        {value}
      </span>
    </div>
  );
}
