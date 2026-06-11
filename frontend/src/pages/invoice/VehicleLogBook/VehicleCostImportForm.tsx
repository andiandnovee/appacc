/**
 * VehicleCostImportForm.tsx
 * Path: frontend/src/pages/vehicles/VehicleCostImportForm.tsx
 *
 * Upload biaya kendaraan dari SAP Excel (2 kolom: costcenter + nominal)
 * Dipakai di dalam Drawer.
 */

import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { CheckCircle, AlertTriangle, Car } from "lucide-react";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import Select from "../../../components/ui/Select";
import Badge from "../../../components/ui/Badge";
import FileUpload from "../../../components/ui/FileUpload";
import api from "../../../api/axios";
import styles from "./VehicleCostImportForm.module.css";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface ParsedRow {
  cost_center: string;
  total_cost: number;
  // diisi setelah lookup ke vehicles
  vehicle_id?: number;
  plate_number?: string;
  description?: string;
  found: boolean;
}

interface ImportResult {
  inserted: number;
  updated: number;
  skipped: number;
  recalculated: number;
  errors: { cost_center: string; message: string }[];
}

interface Props {
  onSuccess?: () => void;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatRupiah(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val);
}

function parseExcel(file: File): Promise<ParsedRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        // Sheet 2 kolom tanpa header — ambil raw array
        const raw = XLSX.utils.sheet_to_json<any[]>(ws, {
          header: 1,
          defval: null,
        });

        const rows: ParsedRow[] = [];
        for (const row of raw) {
          const cc = row[0]?.toString()?.trim();
          const nominal = parseFloat(row[1]);
          if (!cc || isNaN(nominal)) continue;
          rows.push({ cost_center: cc, total_cost: nominal, found: false });
        }

        if (rows.length === 0) {
          reject(new Error("File kosong atau format tidak dikenali."));
          return;
        }
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function VehicleCostImportForm({ onSuccess }: Props) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState<string>(currentYear.toString());
  const [month, setMonth] = useState<string>(currentMonth.toString());

  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState<ParsedRow[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // ── File dipilih → parse + lookup vehicles ──
  const handleFilesChange = useCallback(async (files: File[]) => {
    const selected = files[0] ?? null;
    setFile(selected);
    setPreview(null);
    setParseError(null);
    setResult(null);
    setImportError(null);

    if (!selected) return;

    setParsing(true);
    try {
      const rows = await parseExcel(selected);

      // Lookup ke backend: validasi costcenter → vehicle
      const costCenters = rows.map((r) => r.cost_center);
      const { data } = await api.post("/vehicles/cost-center-lookup", {
        cost_centers: costCenters,
      });

      // data: { [cost_center]: { vehicle_id, plate_number, description } | null }
      const enriched: ParsedRow[] = rows.map((r) => {
        const match = data?.[r.cost_center];
        if (match) {
          return {
            ...r,
            vehicle_id: match.vehicle_id,
            plate_number: match.plate_number,
            description: match.description,
            found: true,
          };
        }
        return r;
      });

      setPreview(enriched);
    } catch (err: any) {
      setParseError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal membaca atau memvalidasi file.",
      );
      setFile(null);
    } finally {
      setParsing(false);
    }
  }, []);

  // ── Konfirmasi import ───────────────────────
  const handleImport = async () => {
    if (!preview || !year || !month) return;

    const validRows = preview.filter((r) => r.found);
    if (validRows.length === 0) return;

    setImporting(true);
    setImportError(null);
    setResult(null);

    try {
      const { data } = await api.post("/vehicles/cost-import", {
        year: parseInt(year),
        month: parseInt(month),
        rows: validRows.map((r) => ({
          vehicle_id: r.vehicle_id,
          cost_center: r.cost_center,
          total_cost: r.total_cost,
        })),
      });

      setResult(data);
      setFile(null);
      setPreview(null);
      onSuccess?.();
    } catch (err: any) {
      setImportError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal mengimport data.",
      );
    } finally {
      setImporting(false);
    }
  };

  // ── Derived ─────────────────────────────────
  const foundCount = preview?.filter((r) => r.found).length ?? 0;
  const notFoundCount = preview?.filter((r) => !r.found).length ?? 0;
  const totalCost =
    preview?.filter((r) => r.found).reduce((s, r) => s + r.total_cost, 0) ?? 0;

  const canImport =
    !!preview && foundCount > 0 && !!year && !!month && !importing;

  const MONTHS = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  // ─────────────────────────────────────────────
  return (
    <div className={styles.form}>
      {/* ── Periode ─────────────────────────── */}
      <div className={styles.periodeRow}>
        <div className={styles.fieldWrap}>
          <label className={styles.label}>Bulan</label>
          <Select
            label="Bulan"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setPreview(null);
              setResult(null);
            }}
            disabled={importing}
            options={MONTHS}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </div>
        <div className={styles.fieldWrap}>
          <label className={styles.label}>Tahun</label>
          <input
            type="number"
            className={styles.yearInput}
            value={year}
            min="2020"
            max="2099"
            disabled={importing}
            onChange={(e) => {
              setYear(e.target.value);
              setPreview(null);
              setResult(null);
            }}
          />
        </div>
      </div>

      {/* ── File Upload ─────────────────────── */}
      <FileUpload
        accept=".xlsx,.xls"
        multiple={false}
        maxSize={10 * 1024 * 1024}
        maxFiles={1}
        label="File Excel Biaya SAP"
        hint="2 kolom: Cost Center | Nominal · Format .xlsx / .xls · Maks 10 MB"
        disabled={importing || parsing}
        onFilesChange={handleFilesChange}
      />

      {/* Parsing indicator */}
      {parsing && (
        <p className={styles.parsingText}>
          Membaca file dan validasi kendaraan...
        </p>
      )}

      {/* Parse error */}
      {parseError && (
        <Alert
          variant="danger"
          description={parseError}
          dismissible
          onDismiss={() => setParseError(null)}
        />
      )}

      {/* ── Preview Tabel ───────────────────── */}
      {preview && !parsing && (
        <div className={styles.previewSection}>
          {/* Summary badges */}
          <div className={styles.summaryRow}>
            <Badge variant="success" icon={<CheckCircle size={12} />}>
              {foundCount} kendaraan ditemukan
            </Badge>
            {notFoundCount > 0 && (
              <Badge variant="warning" icon={<AlertTriangle size={12} />}>
                {notFoundCount} costcenter tidak dikenali
              </Badge>
            )}
            <span className={styles.totalLabel}>
              Total: <strong>{formatRupiah(totalCost)}</strong>
            </span>
          </div>

          {/* Tabel preview */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cost Center</th>
                  <th>Kendaraan</th>
                  <th>No. Polisi</th>
                  <th className={styles.thRight}>Nominal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row) => (
                  <tr
                    key={row.cost_center}
                    className={row.found ? "" : styles.trNotFound}
                  >
                    <td className={styles.tdMono}>{row.cost_center}</td>
                    <td className={styles.tdDesc}>
                      {row.found ? (
                        <span className={styles.vehicleInfo}>
                          <Car size={12} />
                          {row.description ?? "—"}
                        </span>
                      ) : (
                        <span className={styles.notFoundText}>
                          Tidak ditemukan
                        </span>
                      )}
                    </td>
                    <td className={styles.tdMono}>{row.plate_number ?? "—"}</td>
                    <td className={styles.tdRight}>
                      {formatRupiah(row.total_cost)}
                    </td>
                    <td>
                      {row.found ? (
                        <Badge variant="success" size="sm">
                          OK
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="sm">
                          Skip
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={styles.tfootRow}>
                  <td colSpan={3} className={styles.tfootLabel}>
                    Total ({foundCount} kendaraan)
                  </td>
                  <td className={`${styles.tdRight} ${styles.tfootTotal}`}>
                    {formatRupiah(totalCost)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {notFoundCount > 0 && (
            <p className={styles.skipNote}>
              <AlertTriangle size={12} />
              {notFoundCount} baris dengan costcenter tidak dikenali akan
              diabaikan.
            </p>
          )}
        </div>
      )}

      {/* Import error */}
      {importError && (
        <Alert
          variant="danger"
          description={importError}
          dismissible
          onDismiss={() => setImportError(null)}
        />
      )}

      {/* ── Tombol Import ────────────────────── */}
      {preview && (
        <Button
          variant="primary"
          onClick={handleImport}
          loading={importing}
          disabled={!canImport}
          fullWidth
        >
          {importing
            ? "Menyimpan..."
            : `Simpan ${foundCount} Kendaraan — Periode ${
                MONTHS.find((m) => m.value === month)?.label
              } ${year}`}
        </Button>
      )}

      {/* ── Result ──────────────────────────── */}
      {result && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <span className={styles.resultTitle}>Hasil Import</span>
            <Badge variant="success" icon={<CheckCircle size={12} />}>
              Selesai
            </Badge>
          </div>
          <div className={styles.statGrid}>
  <StatItem
    label="Disimpan Baru"
    value={result.inserted}
    variant="success"
  />
  <StatItem
    label="Diperbarui"
    value={result.updated}
    variant="default"
  />
  {result.recalculated > 0 && (
    <StatItem
      label="Dikalkulasi Ulang"
      value={result.recalculated}
      variant="default"
    />
  )}
  <StatItem
    label="Dilewati"
    value={result.skipped}
    variant="warning"
  />
  <StatItem
    label="Error"
    value={result.errors.length}
    variant={result.errors.length > 0 ? "danger" : "default"}
  />
</div>
{result.updated > 0 && result.recalculated > 0 && (
  <p className={styles.recalcNote}>
    {result.recalculated} kendaraan memiliki baris logbook yang
    dikalkulasi ulang karena total biaya SAP berubah.
  </p>
)}
          {result.errors.length > 0 && (
            <div className={styles.errorList}>
              {result.errors.map((e, i) => (
                <div key={i} className={styles.errorItem}>
                  <AlertTriangle size={13} />
                  <span>
                    <strong>{e.cost_center}:</strong> {e.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
