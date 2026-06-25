/**
 * VehicleLogbookPage.tsx
 * Path: frontend/src/pages/vehicles/VehicleLogbookPage.tsx
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Upload,
  Plus,
  RefreshCw,
  Loader2,
  AlertCircle,
  Car,
  History,
  ChevronRight,
  Trash2,
  Calculator,
} from "lucide-react";

import api from "../../../api/axios";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Badge from "../../../components/ui/Badge";
import Drawer from "../../../components/ui/Drawer";
import { useToast } from "../../../components/ui/Toast";
import { useFilterVehicleLogbook } from "../../../stores/filterVehicleLogbook";
import { useAuth } from "../../../hooks/useAuth";

import VehicleCostImportForm from "./VehicleCostImportForm";
import LogbookDetailForm, {
  type LogbookDetailFormRef,
} from "./LogbookDetailForm";
import CarryoverPicker from "./CarryoverPicker";

import LogbookSummarySection, {
  type LogbookSummarySectionRef,
} from "./LogbookSummarySection";

import styles from "./index.module.css";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface Vehicle {
  id: number;
  plate_number: string;
  description: string;
  cost_center: string;
  company_code: string;
  business_area_code: string;
}

export interface CostHeader {
  id: number;
  vehicle_id: number;
  year: number;
  month: number;
  total_cost: number;
  start_km: number | null;
  end_km: number | null;
  start_date: string | null;
  end_date: string | null;
}

export interface CostDetail {
  id: number;
  vehicle_cost_header_id: number;
  start_km: number;
  end_km: number;
  km: number;
  cost_center: string | null;
  customer_code: string | null;
  description: string;
  cost_amount: number | null;
  is_carryover: boolean;
  source_detail_id: number | null;
  cost_center_name?: string;
  customer_name?: string;
  source_month?: number;
  source_year?: number;
}

interface LastKmInfo {
  last_km: number | null;
  month: number | null;
  year: number | null;
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

function formatPeriode(month: number | null, year: number | null): string {
  if (!month || !year) return "";
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

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
// KOMPONEN UTAMA
// ─────────────────────────────────────────────
export default function VehicleLogbookPage() {
  const { addToast } = useToast();

  // ── Zustand filter store ─────────────────────
  const {
    selectedCompany,
    selectedBusArea,
    month,
    year,
    setSelectedCompany,
    setSelectedBusArea,
    setMonth,
    setYear,
  } = useFilterVehicleLogbook();
  const summaryRef = useRef<LogbookSummarySectionRef>(null);

  // ── Auth ─────────────────────────────────────
  const { user } = useAuth();
  const canDelete = useMemo(() => {
    if (!user) return false;
    const roles: string[] = user.roles ?? [];
    const perms: string[] = user.permissions ?? [];
    return (
      roles.some((r: string) => r.toLowerCase().includes("accounting")) ||
      perms.includes("vehicle.logbook.bulk-delete")
    );
  }, [user]);

  // ── Company & BusArea options ────────────────
  const [companies, setCompanies] = useState<
    { id: string; name: string; company_id: number }[]
  >([]);
  const [busAreas, setBusAreas] = useState<
    { id: number; sap_id: string; name: string; company_id: number }[]
  >([]);

  // ── Kendaraan terpilih (dari klik summary) ───
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [header, setHeader] = useState<CostHeader | null>(null);
  const [details, setDetails] = useState<CostDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lastKmInfo, setLastKmInfo] = useState<LastKmInfo>({
    last_km: null,
    month: null,
    year: null,
  });

  // Drawers
  const [importOpen, setImportOpen] = useState(false);
  const [carryoverOpen, setCarryoverOpen] = useState(false);
  const [editDetail, setEditDetail] = useState<CostDetail | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  // Refs
  const inlineFormRef = useRef<LogbookDetailFormRef>(null);
  const inlineFormWrapRef = useRef<HTMLDivElement>(null);
  const logbookSectionRef = useRef<HTMLDivElement>(null);

  // ── Derived options ──────────────────────────
  const activeCompany = companies.find((c) => String(c.id) === selectedCompany);
  const activeBusArea = busAreas.find((b) => String(b.id) === selectedBusArea);

  const companyOptions = companies.map((c) => ({
    value: c.id,
    label: `${c.id} — ${c.name}`,
  }));
  const busAreaOptions = busAreas.map((b) => ({
    value: String(b.id),
    label: `${b.sap_id} — ${b.name}`,
  }));

  // ── Load companies ───────────────────────────
  useEffect(() => {
    api
      .get("/companies/select-options")
      .then((r) => setCompanies(r.data?.data ?? r.data ?? []));
  }, []);

  // ── Load busAreas saat company berubah ───────
  useEffect(() => {
    if (!selectedCompany) {
      setBusAreas([]);
      return;
    }
    const active = companies.find((c) => String(c.id) === selectedCompany);
    api
      .get("/busa", {
        params: {
          company_id: active?.company_id ?? selectedCompany,
          per_page: 999,
        },
      })
      .then((r) => setBusAreas(r.data?.data ?? r.data ?? []));
  }, [selectedCompany, companies]);

  // ── Reset kendaraan saat area/periode berubah ─
  useEffect(() => {
    setSelectedVehicle(null);
    setHeader(null);
    setDetails([]);
    setLastKmInfo({ last_km: null, month: null, year: null });
  }, [selectedBusArea, month, year]);

  // ── Fetch last KM ────────────────────────────
  const fetchLastKm = useCallback(async (vehicleId: number) => {
    try {
      const { data: res } = await api.get<LastKmInfo>(
        "/vehicles/logbook/last-km",
        { params: { vehicle_id: vehicleId } },
      );
      setLastKmInfo(res);
    } catch {
      setLastKmInfo({ last_km: null, month: null, year: null });
    }
  }, []);

  // ── Fetch logbook data ───────────────────────
  const fetchData = useCallback(async () => {
    if (!selectedVehicle || !month || !year) {
      setHeader(null);
      setDetails([]);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/vehicles/logbook", {
        params: { vehicle_id: selectedVehicle.id, month, year },
      });
      setHeader(data.header ?? null);
      setDetails(data.details ?? []);
      fetchLastKm(selectedVehicle.id);
      return data;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Gagal memuat data logbook.");
      setHeader(null);
      setDetails([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedVehicle, month, year, fetchLastKm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Handler: pilih kendaraan dari summary ────
  const handleVehicleSelect = useCallback(
    (vehicle: Vehicle) => {
      setSelectedVehicle(vehicle);
      // Scroll ke section logbook setelah vehicle dipilih
      setTimeout(() => {
        logbookSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
    [],
  );

  // ── Ctrl+A → focus inline form ───────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!header) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        inlineFormWrapRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setTimeout(() => inlineFormRef.current?.focusEndKm(), 300);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [header]);

  const handleScrollToForm = useCallback(() => {
    inlineFormWrapRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setTimeout(() => inlineFormRef.current?.focusEndKm(), 300);
  }, []);

  // ── Recalculate ──────────────────────────────
  const handleRecalculate = useCallback(async () => {
    if (!header) return;
    setRecalculating(true);
    try {
      await api.post(`/vehicles/logbook/${header.id}/recalculate`);
      addToast({ variant: "success", title: "Biaya berhasil dikalkulasi ulang." });
      fetchData();
      summaryRef.current?.refresh();
    } catch (e: any) {
      addToast({
        variant: "danger",
        title: "Gagal kalkulasi: " + (e?.response?.data?.message ?? e.message),
      });
    } finally {
      setRecalculating(false);
    }
  }, [header, fetchData, addToast]);

  // ── Delete detail ────────────────────────────
  const handleDeleteDetail = useCallback(
    async (detail: CostDetail) => {
      if (
        !confirm(
          `Hapus baris logbook ini?\n${detail.description}\nKM: ${formatKm(detail.start_km)} → ${formatKm(detail.end_km)}`,
        )
      )
        return;

      setDeletingId(detail.id);
      try {
        await api.delete(`/vehicles/logbook/detail/${detail.id}`);
        addToast({ variant: "success", title: "Baris logbook dihapus." });
        fetchData();
        summaryRef.current?.refresh();
      } catch {
        addToast({ variant: "danger", title: "Gagal menghapus baris." });
      } finally {
        setDeletingId(null);
      }
    },
    [fetchData, addToast],
  );

  // ── Derived ──────────────────────────────────
  const lastKm = useMemo(() => {
    if (details.length === 0) return header?.start_km ?? null;
    return details[details.length - 1].end_km;
  }, [details, header]);

  const totalKm = useMemo(
    () => details.reduce((s, d) => s + (d.end_km - d.start_km), 0),
    [details],
  );
  const totalAllocated = useMemo(
    () => details.reduce((s, d) => s + (d.cost_amount ?? 0), 0),
    [details],
  );
  const ratePerKm =
    totalKm > 0 && header?.total_cost
      ? Math.round(header.total_cost / totalKm)
      : null;
  const isBalanced = header
    ? Math.abs(totalAllocated - header.total_cost) < 1
    : false;

  // ─────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ── PAGE HEADER ─────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageIcon}>
            <Car size={20} />
          </div>
          <div>
            <h1 className={styles.pageTitle}>Logbook Kendaraan</h1>
            <p className={styles.pageSubtitle}>
              Input pemakaian & alokasi biaya per kendaraan
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
          <Upload size={14} /> Import Biaya SAP
        </Button>
      </div>

      {/* ── FILTER BAR (tanpa Select kendaraan) ── */}
      <div className={styles.filterCard}>
        <div className={styles.filterGridSimple}>
          <Select
            label="Company"
            placeholder="Pilih company..."
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            options={companyOptions}
          />

          <Select
            label="Business Area"
            placeholder={selectedCompany ? "Pilih area..." : "Pilih company dulu"}
            value={selectedBusArea}
            onChange={(e) => setSelectedBusArea(e.target.value)}
            disabled={!selectedCompany || busAreas.length === 0}
            options={busAreaOptions}
          />

          <div className={styles.fieldWrap}>
            <Select
              label="Bulan"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              size="sm"
              options={MONTHS}
            />
          </div>
          <div className={styles.fieldWrap}>
            <label className={styles.filterLabel}>Tahun</label>
            <input
              type="number"
              className={styles.yearInput}
              value={year}
              min="2020"
              max="2099"
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div className={styles.filterActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? styles.spinning : ""} />{" "}
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* ── SUMMARY & EKSPOR SAP ── */}
      {selectedBusArea && month && year && activeBusArea && (
        <LogbookSummarySection
          ref={summaryRef}
          busAreaSapId={activeBusArea.sap_id}
          busAreaLabel={`${activeBusArea.sap_id} — ${activeBusArea.name}`}
          companyCode={activeCompany?.id ?? ""}
          month={Number(month)}
          year={Number(year)}
          canDelete={canDelete}
          selectedVehicleId={selectedVehicle?.id ?? null}
          onVehicleSelect={handleVehicleSelect}
          onDeleted={() => {
            setSelectedVehicle(null);
            setHeader(null);
            setDetails([]);
            fetchData();
          }}
        />
      )}

      {/* ── LOGBOOK SECTION ─────────────────── */}
      <div ref={logbookSectionRef}>
        {/* ── LOADING / ERROR / EMPTY ── */}
        {loading && (
          <div className={styles.stateBox}>
            <Loader2 size={24} className={styles.spinning} />
            <span>Memuat data...</span>
          </div>
        )}
        {!loading && error && (
          <div className={styles.stateBox}>
            <AlertCircle size={18} className={styles.errorIcon} />
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchData}>
              Coba lagi
            </Button>
          </div>
        )}
        {!loading && !error && !selectedVehicle && (
          <div className={styles.stateBox}>
            <Car size={36} className={styles.emptyIcon} />
            <p>Pilih kendaraan dari tabel ringkasan di atas.</p>
          </div>
        )}
        {!loading && !error && selectedVehicle && !header && (
          <div className={styles.stateBox}>
            <Car size={36} className={styles.emptyIcon} />
            <p>Belum ada data biaya untuk <strong>{selectedVehicle.plate_number}</strong> periode ini.</p>
            <p className={styles.stateHint}>
              Upload biaya SAP terlebih dahulu via tombol "Import Biaya SAP".
            </p>
          </div>
        )}

        {/* ── CONTENT ── */}
        {!loading && !error && header && selectedVehicle && (
          <>
            {/* ── HEADER INFO CARD ── */}
            <div className={styles.headerCard}>
              <div className={styles.headerCardLeft}>

                {/* Identitas kendaraan */}
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Kendaraan</span>
                  <span className={styles.statValue}>
                    {selectedVehicle.plate_number}
                  </span>
                  <span className={styles.statSub}>
                    {selectedVehicle.description}
                  </span>
                </div>
                <div className={styles.statDivider} />

                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Total Biaya SAP</span>
                  <span className={styles.statValue}>
                    {formatRupiah(header.total_cost)}
                  </span>
                </div>
                <div className={styles.statDivider} />

                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Total KM</span>
                  <span className={styles.statValue}>{formatKm(totalKm)} km</span>
                </div>
                <div className={styles.statDivider} />

                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Rate Rp/KM</span>
                  <span className={styles.statValue}>
                    {ratePerKm ? formatRupiah(ratePerKm) : "—"}
                  </span>
                </div>
                <div className={styles.statDivider} />

                {/* KM Odometer — real-time dari derived lastKm */}
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>KM Odometer</span>
                  <span className={styles.statValue}>
                    {formatKm(header.start_km)} → {formatKm(lastKm)}
                  </span>
                  {/* Last KM global dari CC, update setiap fetchData */}
                  {lastKmInfo.last_km !== null && (
                    <span className={styles.lastKmHint}>
                      <span className={styles.lastKmHintLabel}>Last KM (CC):</span>
                      <strong>{formatKm(lastKmInfo.last_km)}</strong>
                      {lastKmInfo.month && lastKmInfo.year && (
                        <Badge variant="neutral" size="sm">
                          {formatPeriode(lastKmInfo.month, lastKmInfo.year)}
                        </Badge>
                      )}
                    </span>
                  )}
                </div>

              </div>
              <div className={styles.headerCardRight}>
                {isBalanced ? (
                  <Badge variant="success">✓ Balance</Badge>
                ) : (
                  <Badge variant="warning">
                    Selisih {formatRupiah(header.total_cost - totalAllocated)}
                  </Badge>
                )}
              </div>
            </div>

            {/* ── ACTION BAR ── */}
            <div className={styles.actionBar}>
              <div className={styles.actionBarLeft}>
                <Button variant="primary" size="sm" onClick={handleScrollToForm}>
                  <Plus size={14} /> Tambah Baris
                  <span style={{ opacity: 0.6, fontSize: "0.75em", marginLeft: 4 }}>
                    Ctrl+A
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCarryoverOpen(true)}
                >
                  <History size={14} /> Pakai Bulan Lalu
                </Button>
              </div>
              <div className={styles.actionBarRight}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRecalculate}
                  loading={recalculating}
                  disabled={details.length === 0 || !header.total_cost}
                >
                  <Calculator size={14} /> Kalkulasi Ulang
                </Button>
              </div>
            </div>

            {/* ── TABEL LOGBOOK ── */}
            <div className={styles.tableCard}>
              {details.length === 0 ? (
                <div className={styles.tableEmpty}>
                  <p>Belum ada baris logbook. Isi form di bawah atau pakai data bulan lalu.</p>
                </div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.thNo}>No</th>
                        <th>Log KM</th>
                        <th>Beban</th>
                        <th>CC / Customer</th>
                        <th className={styles.thRight}>KM</th>
                        <th className={styles.thRight}>Rupiah</th>
                        <th>Keterangan</th>
                        <th className={styles.thAction} />
                      </tr>
                    </thead>
                    <tbody>
                      {details.map((d, i) => (
                        <tr
                          key={d.id}
                          className={`${styles.tr} ${d.is_carryover ? styles.trCarryover : ""}`}
                        >
                          <td className={styles.tdNo}>{i + 1}</td>
                          <td className={styles.tdMono}>
                            {formatKm(d.start_km)} → {formatKm(d.end_km)}
                          </td>
                          <td>
                            {d.is_carryover && (
                              <Badge variant="info" size="sm">
                                <History size={10} /> bln lalu
                              </Badge>
                            )}
                            <span className={styles.bebanType}>
                              {d.cost_center ? "Dept" : "Customer"}
                            </span>
                          </td>
                          <td className={styles.tdCode}>
                            <span className={styles.codeText}>
                              {d.cost_center ?? d.customer_code}
                            </span>
                            {(d.cost_center_name || d.customer_name) && (
                              <span className={styles.codeName}>
                                {d.cost_center_name ?? d.customer_name}
                              </span>
                            )}
                          </td>
                          <td className={styles.tdRight}>
                            {formatKm(d.end_km - d.start_km)}
                          </td>
                          <td className={styles.tdRight}>
                            {d.cost_amount !== null ? (
                              formatRupiah(d.cost_amount)
                            ) : (
                              <span className={styles.muted}>—</span>
                            )}
                          </td>
                          <td className={styles.tdDesc}>{d.description || "—"}</td>
                          <td className={styles.tdAction}>
                            <div className={styles.rowActions}>
                              <button
                                className={styles.editBtn}
                                onClick={() => setEditDetail(d)}
                                title="Edit"
                              >
                                <ChevronRight size={14} />
                              </button>
                              <button
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteDetail(d)}
                                disabled={deletingId === d.id}
                                title="Hapus"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className={styles.tfootRow}>
                        <td colSpan={4} className={styles.tfootLabel}>
                          Total ({details.length} baris)
                        </td>
                        <td className={`${styles.tdRight} ${styles.tfootVal}`}>
                          {formatKm(totalKm)}
                        </td>
                        <td
                          className={`${styles.tdRight} ${styles.tfootVal} ${!isBalanced ? styles.tfootUnbalanced : ""}`}
                        >
                          {formatRupiah(totalAllocated)}
                        </td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* ── INLINE FORM TAMBAH BARIS ── */}
            <div ref={inlineFormWrapRef} className={styles.inlineFormCard}>
              <div className={styles.inlineFormHeader}>
                <Plus size={14} />
                <span>Tambah Baris Baru</span>
                {lastKm !== null && (
                  <span className={styles.inlineFormKmHint}>
                    KM awal: <strong>{formatKm(lastKm)}</strong>
                  </span>
                )}
                <span className={styles.inlineFormShortcut}>
                  Ctrl+A untuk fokus
                </span>
              </div>
              <LogbookDetailForm
                ref={inlineFormRef}
                headerId={header.id}
                lastKm={lastKm}
                detail={null}
                inline
                onSuccess={async () => {
                  const data = await fetchData();
                  summaryRef.current?.refresh();
                  const newDetails: CostDetail[] = data?.details ?? [];
                  const newLastKm =
                    newDetails.length > 0
                      ? newDetails[newDetails.length - 1].end_km
                      : (header?.start_km ?? null);
                  inlineFormRef.current?.resetAndFocus(newLastKm);
                }}
                onCancel={() => {}}
              />
            </div>
          </>
        )}
      </div>

      {/* ── DRAWER: Import ── */}
      <Drawer isOpen={importOpen} onClose={() => setImportOpen(false)} size="md">
        <Drawer.Header
          title="Import Biaya Kendaraan"
          subtitle="Upload Excel SAP (cost center + nominal)"
          onClose={() => setImportOpen(false)}
        />
        <Drawer.Body>
          <VehicleCostImportForm
            onSuccess={() => {
              setImportOpen(false);
              fetchData();
              summaryRef.current?.refresh();
            }}
          />
        </Drawer.Body>
      </Drawer>

      {/* ── DRAWER: Edit Baris ── */}
      <Drawer isOpen={!!editDetail} onClose={() => setEditDetail(null)} size="md">
        <Drawer.Header
          title="Edit Baris Logbook"
          subtitle={
            editDetail
              ? `KM ${formatKm(editDetail.start_km)} → ${formatKm(editDetail.end_km)}`
              : ""
          }
          onClose={() => setEditDetail(null)}
        />
        <Drawer.Body>
          {editDetail && header && (
            <LogbookDetailForm
              headerId={header.id}
              lastKm={lastKm}
              detail={editDetail}
              onSuccess={() => {
                setEditDetail(null);
                fetchData();
              }}
              onCancel={() => setEditDetail(null)}
            />
          )}
        </Drawer.Body>
      </Drawer>

      {/* ── DRAWER: Carryover ── */}
      <Drawer
        isOpen={carryoverOpen}
        onClose={() => setCarryoverOpen(false)}
        size="lg"
      >
        <Drawer.Header
          title="Pakai Data Bulan Lalu"
          subtitle="Pilih baris logbook bulan sebelumnya untuk disertakan"
          onClose={() => setCarryoverOpen(false)}
        />
        <Drawer.Body>
          {header && (
            <CarryoverPicker
              headerId={header.id}
              vehicleId={header.vehicle_id}
              currentMonth={Number(month)}
              currentYear={Number(year)}
              lastKm={lastKm}
              onSuccess={() => {
                setCarryoverOpen(false);
                fetchData();
              }}
              onCancel={() => setCarryoverOpen(false)}
            />
          )}
        </Drawer.Body>
      </Drawer>
    </div>
  );
}