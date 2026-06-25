// LogbookSummarySection.tsx
// Path: frontend/src/pages/vehicles/LogbookSummarySection.tsx

import { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Car,
  AlertTriangle,
  Loader2,
  Printer,
  FileSpreadsheet,
  FileOutput,
  FileText,
} from "lucide-react";
import api from "../../../api/axios";
import Button from "../../../components/ui/Button";
import { SplitButton } from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { useToast } from "../../../components/ui/Toast";
import {
  openPrintSingle,
  openPrintAll,
  buildRekapFromPayloads,
  openPrintRekap,
  type PrintPayload,
} from "./printLogbook";
import {
  exportZf0002Excel,
  exportZf0002Text,
  type ZfPayload,
  type ZfMode,
} from "./ExportZF0002";
import {
  copySkfToClipboard,
  exportSkfExcel,
  type SkfPayload,
} from "./Exportskf";
import styles from "./LogbookSummarySection.module.css";
import { forwardRef, useImperativeHandle } from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface VehicleWithCost {
  vehicle_id: number;
  plate_number: string;
  description: string;
  header_id: number;
  total_cost: number;
  total_km: number | null;
  detail_count: number;
  is_balanced: boolean;
  // KM akhir header periode ini (dari vehicle_cost_headers.end_km)
  current_end_km: number | null;
  // Last KM tertinggi lintas waktu dari cost_center yang sama
  last_km: number | null;
  last_km_month: number | null;
  last_km_year: number | null;
}

interface VehicleNoCost {
  vehicle_id: number;
  plate_number: string;
  description: string;
  cost_center: string;
  // ── NEW ──
  last_km: number | null;
  last_km_month: number | null;
  last_km_year: number | null;
}

interface SummaryData {
  with_cost: VehicleWithCost[];
  no_cost: VehicleNoCost[];
  period_label: string;
  bus_area_label: string;
  total_cost_all: number;
  total_km_all: number;
}

interface Props {
  busAreaSapId: string;
  busAreaLabel: string;
  companyCode: string;
  month: number;
  year: number;
  canDelete: boolean;
  onDeleted: () => void;
}

export interface LogbookSummarySectionRef {
  refresh: () => void;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatRupiah(val: number | null): string {
  if (val === null || val === undefined) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val);
}

function formatKm(val: number | null): string {
  if (val === null || val === undefined) return "—";
  return new Intl.NumberFormat("id-ID").format(val);
}

/** Format periode (month, year) → "Apr 2026" */
function formatPeriode(month: number | null, year: number | null): string {
  if (!month || !year) return "—";
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

function todayInputValue(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ─────────────────────────────────────────────
const LogbookSummarySection = forwardRef<LogbookSummarySectionRef, Props>(
  (
    {
      busAreaSapId,
      busAreaLabel,
      companyCode,
      month,
      year,
      canDelete,
      onDeleted,
    },
    ref,
  ) => {
    const { addToast } = useToast();

    const [open, setOpen] = useState(true);
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [printingId, setPrintingId] = useState<number | null>(null);
    const [printingAll, setPrintingAll] = useState(false);
    const [exportingZf, setExportingZf] = useState(false);
    const [exportingSkf, setExportingSkf] = useState(false);

    const [postingDate, setPostingDate] = useState<string>(todayInputValue());
    

    // ── Fetch summary ────────────────────────────
    const fetchSummary = useCallback(async () => {
      if (!busAreaSapId || !month || !year) return;
      setLoading(true);
      setError(null);
      try {
        const { data: res } = await api.get("/vehicles/logbook/summary", {
          params: {
            bus_area_sap_id: busAreaSapId,
            company_code: companyCode,
            month,
            year,
          },
        });
        setData(res);
      } catch (e: any) {
        setError(e?.response?.data?.message ?? "Gagal memuat ringkasan.");
      } finally {
        setLoading(false);
      }
    }, [busAreaSapId, companyCode, month, year]);

    useImperativeHandle(ref, () => ({
      refresh: fetchSummary,
    }));

    useEffect(() => {
      fetchSummary();
    }, [fetchSummary]);

    // ── Derived: status balance keseluruhan ─────
    const hasVehicles = (data?.with_cost.length ?? 0) > 0;
    const allBalanced =
      hasVehicles && data!.with_cost.every((v) => v.is_balanced);

    // ── Delete all ───────────────────────────────
    const handleDelete = useCallback(async () => {
      setDeleting(true);
      try {
        const { data: res } = await api.delete("/vehicles/logbook/bulk", {
          params: {
            bus_area_sap_id: busAreaSapId,
            company_code: companyCode,
            month,
            year,
          },
        });
        addToast({
          variant: "success",
          title: `${res.deleted} header biaya dihapus untuk ${busAreaLabel} periode ${month}/${year}.`,
        });
        setConfirmDelete(false);
        setData(null);
        fetchSummary();
        onDeleted();
      } catch (e: any) {
        addToast({
          variant: "danger",
          title:
            "Gagal hapus: " + (e?.response?.data?.message ?? "Unknown error"),
        });
      } finally {
        setDeleting(false);
      }
    }, [
      busAreaSapId,
      companyCode,
      month,
      year,
      busAreaLabel,
      addToast,
      onDeleted,
      fetchSummary,
    ]);

    // ── Print single ──────────────────────────────
    const handlePrintOne = useCallback(
      async (vehicleId: number) => {
        setPrintingId(vehicleId);
        try {
          const { data: payload } = await api.get<PrintPayload>(
            "/vehicles/logbook/print",
            { params: { vehicle_id: vehicleId, month, year } },
          );
          openPrintSingle(payload);
        } catch (e: any) {
          addToast({
            variant: "danger",
            title:
              "Gagal memuat data print: " +
              (e?.response?.data?.message ?? "Unknown error"),
          });
        } finally {
          setPrintingId(null);
        }
      },
      [month, year, addToast],
    );

    // ── Print all ─────────────────────────────────
    const handlePrintAll = useCallback(async () => {
      setPrintingAll(true);
      try {
        const { data: res } = await api.get<{ vehicles: PrintPayload[] }>(
          "/vehicles/logbook/print-all",
          {
            params: {
              bus_area_sap_id: busAreaSapId,
              company_code: companyCode,
              month,
              year,
            },
          },
        );
        if (res.vehicles.length === 0) {
          addToast({
            variant: "warning",
            title: "Tidak ada kendaraan balance untuk dicetak.",
          });
          return;
        }
        openPrintAll(res.vehicles);
      } catch (e: any) {
        addToast({
          variant: "danger",
          title:
            "Gagal memuat data print: " +
            (e?.response?.data?.message ?? "Unknown error"),
        });
      } finally {
        setPrintingAll(false);
      }
    }, [busAreaSapId, companyCode, month, year, addToast]);

    // ── Print Rekap ───────────────────────────────
    const handlePrintRekap = useCallback(async () => {
      setPrintingAll(true);
      try {
        const { data: res } = await api.get<{ vehicles: PrintPayload[] }>(
          "/vehicles/logbook/print-all",
          {
            params: {
              bus_area_sap_id: busAreaSapId,
              company_code: companyCode,
              month,
              year,
            },
          },
        );
        if (res.vehicles.length === 0) {
          addToast({
            variant: "warning",
            title: "Tidak ada kendaraan balance untuk dicetak.",
          });
          return;
        }
        const rekap = buildRekapFromPayloads(
          res.vehicles,
          busAreaLabel,
          month,
          year,
        );
        openPrintRekap(rekap);
      } catch (e: any) {
        addToast({
          variant: "danger",
          title:
            "Gagal memuat data rekap: " +
            (e?.response?.data?.message ?? "Unknown error"),
        });
      } finally {
        setPrintingAll(false);
      }
    }, [busAreaSapId, companyCode, month, year, busAreaLabel, addToast]);

    // ── Export ZF0002_AGRI (customer) ─────────────
    
const handleExportZf0002 = useCallback(
  async (type: "excel" | "text", mode: ZfMode = "all") => {
    if (!postingDate) {
      addToast({ variant: "warning", title: "Pilih posting date terlebih dahulu." });
      return;
    }
    setExportingZf(true);
    try {
      const { data: res } = await api.get<{
        vehicles: ZfPayload[];
        all_balanced: boolean;
        vehicle_count: number;
      }>("/vehicles/logbook/export-zf0002", {
        params: { bus_area_sap_id: busAreaSapId, company_code: companyCode, month, year },
      });
 
      if (!res.all_balanced) {
        addToast({ variant: "warning", title: "Semua kendaraan harus Balance sebelum export ZF0002_AGRI." });
        return;
      }
      if (res.vehicles.length === 0) {
        addToast({ variant: "warning", title: "Tidak ada data untuk diexport." });
        return;
      }
 
      const exportParams = {
        payloads: res.vehicles,
        companyCode,
        businessArea: busAreaSapId,
        month,
        year,
        postingDate: new Date(postingDate + "T00:00:00"),
        mode,
      };
 
      if (type === "excel") {
        await exportZf0002Excel(exportParams);
      } else {
        exportZf0002Text(exportParams);
      }
 
      const modeLabel = mode === "customer" ? "Customer" : mode === "cc" ? "CC" : "Gabung";
      addToast({
        variant: "success",
        title: `File ZF0002_AGRI (${modeLabel}) berhasil dibuat (${res.vehicles.length} kendaraan).`,
      });
    } catch (e: any) {
      addToast({ variant: "danger", title: "Gagal export: " + (e?.response?.data?.message ?? "Unknown error") });
    } finally {
      setExportingZf(false);
    }
  },
  [busAreaSapId, companyCode, month, year, postingDate, addToast],
);

    // ── Export SKF (cost center penerima) ─────────
    const handleCopySkf = useCallback(async () => {
      if (!postingDate) {
        addToast({
          variant: "warning",
          title: "Pilih posting date terlebih dahulu.",
        });
        return;
      }
      setExportingSkf(true);
      try {
        const { data: res } = await api.get<{
          vehicles: SkfPayload[];
          vehicle_count: number;
        }>("/vehicles/logbook/export-skf", {
          params: {
            bus_area_sap_id: busAreaSapId,
            company_code: companyCode,
            month,
            year,
          },
        });

        if (res.vehicles.length === 0) {
          addToast({
            variant: "warning",
            title: "Tidak ada baris biaya ke cost center untuk diexport.",
          });
          return;
        }

        const count = await copySkfToClipboard({
          payloads: res.vehicles,
          postingDate: new Date(postingDate + "T00:00:00"),
        });

        addToast({
          variant: "success",
          title: `${count} baris SKF berhasil dicopy ke clipboard.`,
        });
      } catch (e: any) {
        addToast({
          variant: "danger",
          title:
            "Gagal copy: " + (e?.response?.data?.message ?? "Unknown error"),
        });
      } finally {
        setExportingSkf(false);
      }
    }, [busAreaSapId, companyCode, month, year, postingDate, addToast]);

    const handleExportSkfExcel = useCallback(async () => {
      if (!postingDate) {
        addToast({
          variant: "warning",
          title: "Pilih posting date terlebih dahulu.",
        });
        return;
      }
      setExportingSkf(true);
      try {
        const { data: res } = await api.get<{
          vehicles: SkfPayload[];
          vehicle_count: number;
        }>("/vehicles/logbook/export-skf", {
          params: {
            bus_area_sap_id: busAreaSapId,
            company_code: companyCode,
            month,
            year,
          },
        });

        if (res.vehicles.length === 0) {
          addToast({
            variant: "warning",
            title: "Tidak ada baris biaya ke cost center untuk diexport.",
          });
          return;
        }

        await exportSkfExcel({
          payloads: res.vehicles,
          postingDate: new Date(postingDate + "T00:00:00"),
          month,
          year,
        });

        addToast({
          variant: "success",
          title: `File SKF berhasil dibuat (${res.vehicles.length} kendaraan).`,
        });
      } catch (e: any) {
        addToast({
          variant: "danger",
          title:
            "Gagal export: " + (e?.response?.data?.message ?? "Unknown error"),
        });
      } finally {
        setExportingSkf(false);
      }
    }, [busAreaSapId, companyCode, month, year, postingDate, addToast]);

    // ─────────────────────────────────────────────
    return (
      <div className={styles.section}>
        {/* ── Header / Toolbar (selalu terlihat) ── */}
        <div className={styles.headerBar}>
          <button
            className={styles.toggleBtn}
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            <span className={styles.toggleLeft}>
              {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              <span className={styles.toggleLabel}>Ringkasan & Ekspor SAP</span>
              {loading && <Loader2 size={14} className={styles.spinning} />}
              {!loading && data !== null && (
                <>
                  <Badge variant="success" size="sm">
                    {data.with_cost.length} kendaraan
                  </Badge>
                  {data.no_cost.length > 0 && (
                    <Badge variant="warning" size="sm">
                      {data.no_cost.length} tanpa biaya
                    </Badge>
                  )}
                  {hasVehicles && (
                    <Badge
                      variant={allBalanced ? "success" : "warning"}
                      size="sm"
                    >
                      {allBalanced ? "Semua Balance" : "Belum Balance"}
                    </Badge>
                  )}
                </>
              )}
            </span>
          </button>

          {/* ── Toolbar Aksi ── */}
          <div className={styles.toolbar}>
            <div className={styles.postingDateWrap}>
              <label className={styles.postingDateLabel}>Posting Date</label>
              <input
                type="date"
                className={styles.postingDateInput}
                value={postingDate}
                onChange={(e) => setPostingDate(e.target.value)}
              />
            </div>
            // 4. Ganti SplitButton ZF0002 di toolbar (dari 1 menjadi 2):
<SplitButton
  label={<><FileSpreadsheet size={13} /> ZF0002 Excel</>}
  variant="outline"
  size="sm"
  onClick={() => handleExportZf0002("excel", "all")}
  options={[
    {
      label: "Excel — Hanya Customer",
      icon: <FileSpreadsheet size={13} />,
      onClick: () => handleExportZf0002("excel", "customer"),
    },
    {
      label: "Excel — Hanya CC",
      icon: <FileSpreadsheet size={13} />,
      onClick: () => handleExportZf0002("excel", "cc"),
    },
  ]}
  loading={exportingZf}
  disabled={!allBalanced || exportingZf || !hasVehicles}
/>
<SplitButton
  label={<><FileOutput size={13} /> ZF0002 Text</>}
  variant="outline"
  size="sm"
  onClick={() => handleExportZf0002("text", "all")}
  options={[
    {
      label: "Text — Hanya Customer",
      icon: <FileOutput size={13} />,
      onClick: () => handleExportZf0002("text", "customer"),
    },
    {
      label: "Text — Hanya CC",
      icon: <FileOutput size={13} />,
      onClick: () => handleExportZf0002("text", "cc"),
    },
  ]}
  loading={exportingZf}
  disabled={!allBalanced || exportingZf || !hasVehicles}
/>

            <SplitButton
              label="Copy SKF"
              variant="outline"
              size="sm"
              onClick={handleCopySkf}
              options={[
                {
                  label: "Export SKF to Excel",
                  icon: <FileSpreadsheet size={13} />,
                  onClick: handleExportSkfExcel,
                },
              ]}
              loading={exportingSkf}
              disabled={exportingSkf || !hasVehicles}
            />

            <SplitButton
              label="Print Semua"
              variant="outline"
              size="sm"
              onClick={handlePrintAll}
              options={[
                {
                  label: "Print Rekap Kendaraan",
                  icon: <FileText size={13} />,
                  onClick: handlePrintRekap,
                },
              ]}
              loading={printingAll}
              disabled={!allBalanced || printingAll || !hasVehicles}
            />

            {canDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                disabled={!hasVehicles}
                title="Hapus seluruh data biaya periode ini"
              >
                <Trash2 size={13} /> Hapus Semua
              </Button>
            )}
          </div>
        </div>

        {/* ── Confirm delete (banner di luar collapsible) ── */}
        {confirmDelete && (
          <div className={styles.confirmBox}>
            <span className={styles.confirmText}>
              ⚠️ Yakin? Tindakan ini <strong>tidak bisa dibatalkan</strong>.
              Semua header biaya dan baris logbook untuk {busAreaLabel} {month}/
              {year} akan dihapus permanen.
            </span>
            <div className={styles.confirmActions}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                loading={deleting}
              >
                Ya, Hapus Sekarang
              </Button>
            </div>
          </div>
        )}

        {/* ── Collapsible Body ── */}
        {open && (
          <div className={styles.body}>
            {loading && (
              <div className={styles.loadingBox}>
                <Loader2 size={18} className={styles.spinning} />
                <span>Memuat ringkasan...</span>
              </div>
            )}

            {!loading && error && (
              <div className={styles.errorBox}>
                <AlertTriangle size={16} />
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={fetchSummary}>
                  Coba lagi
                </Button>
              </div>
            )}

            {!loading && !error && data && (
              <>
                {/* ── Kendaraan DENGAN biaya ── */}
                <div className={styles.subSection}>
                  <div className={styles.subHeader}>
                    <span className={styles.subTitle}>
                      Kendaraan dengan Biaya
                    </span>
                    <Badge variant="success" size="sm">
                      {data.with_cost.length} kendaraan
                    </Badge>
                    {data.with_cost.length > 0 && (
                      <Badge variant="info" size="sm">
                        Total: {formatRupiah(data.total_cost_all)}
                      </Badge>
                    )}
                  </div>

                  {data.with_cost.length === 0 ? (
                    <p className={styles.emptyNote}>
                      Belum ada kendaraan dengan data biaya di periode ini.
                    </p>
                  ) : (
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Plat / Keterangan</th>
                            <th className={styles.thRight}>Total Biaya SAP</th>
                            <th className={styles.thRight}>Total KM</th>
                            <th className={styles.thRight}>KM Akhir Periode</th>
                            <th className={styles.thRight}>Last KM (All Time)</th>
                            <th className={styles.thRight}>Baris</th>
                            <th>Status</th>
                            <th className={styles.thRight}>Print</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.with_cost.map((v, i) => (
                            <tr key={v.vehicle_id} className={styles.tr}>
                              <td className={styles.tdNo}>{i + 1}</td>
                              <td>
                                <span className={styles.plate}>
                                  {v.plate_number}
                                </span>
                                <span className={styles.vDesc}>
                                  {v.description}
                                </span>
                              </td>
                              <td className={styles.tdRight}>
                                {formatRupiah(v.total_cost)}
                              </td>
                              <td className={styles.tdRight}>
                                {v.total_km
                                  ? `${formatKm(v.total_km)} km`
                                  : "—"}
                              </td>
                              {/* KM Akhir Periode — end_km header bulan ini */}
                              <td className={styles.tdRight}>
                                {v.current_end_km !== null ? (
                                  <span className={styles.currentEndKm}>
                                    {formatKm(v.current_end_km)}
                                  </span>
                                ) : (
                                  <span className={styles.muted}>—</span>
                                )}
                              </td>
                              {/* Last KM All Time — end_km tertinggi lintas waktu per CC */}
                              <td className={styles.tdRight}>
                                {v.last_km !== null ? (
                                  <span className={styles.lastKmCell}>
                                    <span className={styles.lastKmValue}>
                                      {formatKm(v.last_km)}
                                    </span>
                                    <Badge variant="neutral" size="sm">
                                      {formatPeriode(v.last_km_month, v.last_km_year)}
                                    </Badge>
                                  </span>
                                ) : (
                                  <span className={styles.muted}>—</span>
                                )}
                              </td>
                              <td className={styles.tdRight}>
                                {v.detail_count}
                              </td>
                              <td>
                                {v.is_balanced ? (
                                  <Badge variant="success" size="sm">
                                    Balance
                                  </Badge>
                                ) : (
                                  <Badge variant="warning" size="sm">
                                    Belum
                                  </Badge>
                                )}
                              </td>
                              <td className={styles.tdRight}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePrintOne(v.vehicle_id)}
                                  loading={printingId === v.vehicle_id}
                                  disabled={
                                    !v.is_balanced || printingId !== null
                                  }
                                  title={
                                    v.is_balanced
                                      ? "Print laporan kendaraan ini"
                                      : "Kalkulasi belum balance"
                                  }
                                >
                                  <Printer size={13} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className={styles.tfootRow}>
                            <td colSpan={2} className={styles.tfootLabel}>
                              Total ({data.with_cost.length} kendaraan)
                            </td>
                            <td
                              className={`${styles.tdRight} ${styles.tfootVal}`}
                            >
                              {formatRupiah(data.total_cost_all)}
                            </td>
                            <td
                              className={`${styles.tdRight} ${styles.tfootVal}`}
                            >
                              {formatKm(data.total_km_all)} km
                            </td>
                            {/* current_end_km + last_km + baris + status + print */}
                            <td colSpan={5} />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {/* ── Kendaraan TANPA biaya ── */}
                <div className={styles.subSection}>
                  <div className={styles.subHeader}>
                    <span className={styles.subTitle}>
                      Kendaraan Tanpa Biaya
                    </span>
                    <Badge
                      variant={data.no_cost.length > 0 ? "warning" : "success"}
                      size="sm"
                    >
                      {data.no_cost.length} kendaraan
                    </Badge>
                  </div>

                  {data.no_cost.length === 0 ? (
                    <p className={styles.emptyNote}>
                      Semua kendaraan sudah memiliki data biaya. ✓
                    </p>
                  ) : (
                    <div className={styles.noCostGrid}>
                      {data.no_cost.map((v) => (
                        <div key={v.vehicle_id} className={styles.noCostCard}>
                          <Car size={14} className={styles.noCostIcon} />
                          <div>
                            <span className={styles.plate}>
                              {v.plate_number}
                            </span>
                            <span className={styles.vDesc}>
                              {v.description}
                            </span>
                            {/* ── NEW: Last KM hint di card no-cost ── */}
                            {v.last_km !== null && (
                              <span className={styles.noCostLastKm}>
                                Last KM:{" "}
                                <strong>{formatKm(v.last_km)}</strong>{" "}
                                <Badge variant="neutral" size="sm">
                                  {formatPeriode(v.last_km_month, v.last_km_year)}
                                </Badge>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  },
);

LogbookSummarySection.displayName = "LogbookSummarySection";
export default LogbookSummarySection;