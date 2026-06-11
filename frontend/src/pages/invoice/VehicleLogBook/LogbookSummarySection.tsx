// LogbookSummarySection.tsx
// Path: frontend/src/pages/vehicles/LogbookSummarySection.tsx

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, Trash2, Car, AlertTriangle, Loader2, Printer } from "lucide-react";
import api from "../../../api/axios";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { useToast } from "../../../components/ui/Toast";
import { openPrintSingle, openPrintAll, type PrintPayload } from "./printLogbook";
import styles from "./LogbookSummarySection.module.css";

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
}

interface VehicleNoCost {
  vehicle_id: number;
  plate_number: string;
  description: string;
  cost_center: string;
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
  month: number;
  year: number;
  companyCode: string;
  canDelete: boolean; // hanya true kalau role = accounting
  onDeleted: () => void;
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

// ─────────────────────────────────────────────
export default function LogbookSummarySection({
  busAreaSapId,
  busAreaLabel,
  month,
  year,
  companyCode,
  canDelete,
  onDeleted,
}: Props) {
  const { addToast } = useToast();

  const [open, setOpen] = useState(false);
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [printingId, setPrintingId] = useState<number | null>(null);
  const [printingAll, setPrintingAll] = useState(false);

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

  // Fetch saat panel dibuka atau filter berubah
  useEffect(() => {
    if (open) fetchSummary();
    else setData(null);
  }, [open, fetchSummary]);

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
      onDeleted();
    } catch (e: any) {
      addToast({
        variant: "danger",
        title: "Gagal hapus: " + (e?.response?.data?.message ?? "Unknown error"),
      });
    } finally {
      setDeleting(false);
    }
  }, [busAreaSapId, companyCode, month, year, busAreaLabel, addToast, onDeleted]);

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
          title: "Gagal memuat data print: " + (e?.response?.data?.message ?? "Unknown error"),
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
        title: "Gagal memuat data print: " + (e?.response?.data?.message ?? "Unknown error"),
      });
    } finally {
      setPrintingAll(false);
    }
  }, [busAreaSapId, companyCode, month, year, addToast]);

  // ─────────────────────────────────────────────
  return (
    <div className={styles.section}>
      {/* ── Toggle Header ── */}
      <button
        className={styles.toggleBtn}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className={styles.toggleLeft}>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          <span className={styles.toggleLabel}>Ringkasan & Manajemen Data</span>
          {!open && data === null && (
            <span className={styles.toggleHint}>
              {busAreaLabel} · {month}/{year}
            </span>
          )}
          {!open && data !== null && (
            <>
              <Badge variant="success" size="sm">
                {data.with_cost.length} kendaraan
              </Badge>
              {data.no_cost.length > 0 && (
                <Badge variant="warning" size="sm">
                  {data.no_cost.length} tanpa biaya
                </Badge>
              )}
            </>
          )}
        </span>
      </button>

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
                  {data.with_cost.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrintAll}
                      loading={printingAll}
                      disabled={
                        printingAll ||
                        data.with_cost.some((v) => !v.is_balanced)
                      }
                      title={
                        data.with_cost.some((v) => !v.is_balanced)
                          ? "Semua kendaraan harus Balance untuk print semua"
                          : "Print semua kendaraan (PDF)"
                      }
                    >
                      <Printer size={13} /> Print Semua
                    </Button>
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
                              {v.total_km ? `${formatKm(v.total_km)} km` : "—"}
                            </td>
                            <td className={styles.tdRight}>{v.detail_count}</td>
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
                          <td className={`${styles.tdRight} ${styles.tfootVal}`}>
                            {formatRupiah(data.total_cost_all)}
                          </td>
                          <td className={`${styles.tdRight} ${styles.tfootVal}`}>
                            {formatKm(data.total_km_all)} km
                          </td>
                          <td colSpan={3} />
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
                          <span className={styles.plate}>{v.plate_number}</span>
                          <span className={styles.vDesc}>{v.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Delete Zone (hanya kalau canDelete) ── */}
              {canDelete && (
                <div className={styles.deleteZone}>
                  {!confirmDelete ? (
                    <>
                      <div className={styles.deleteInfo}>
                        <AlertTriangle
                          size={15}
                          className={styles.deleteWarningIcon}
                        />
                        <span>
                          Hapus seluruh data biaya{" "}
                          <strong>{busAreaLabel}</strong> periode{" "}
                          <strong>
                            {month}/{year}
                          </strong>{" "}
                          ({data.with_cost.length} kendaraan,{" "}
                          {data.with_cost.reduce(
                            (s, v) => s + v.detail_count,
                            0,
                          )}{" "}
                          baris logbook).
                        </span>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setConfirmDelete(true)}
                        disabled={data.with_cost.length === 0}
                      >
                        <Trash2 size={13} /> Hapus Semua Data Periode Ini
                      </Button>
                    </>
                  ) : (
                    <div className={styles.confirmBox}>
                      <span className={styles.confirmText}>
                        ⚠️ Yakin? Tindakan ini{" "}
                        <strong>tidak bisa dibatalkan</strong>. Semua header
                        biaya dan baris logbook untuk {busAreaLabel} {month}/
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
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}