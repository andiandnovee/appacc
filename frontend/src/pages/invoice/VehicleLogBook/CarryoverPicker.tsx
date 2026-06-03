/**
 * CarryoverPicker.tsx
 * Path: frontend/src/pages/vehicles/CarryoverPicker.tsx
 *
 * Drawer content: pilih baris logbook dari bulan lalu untuk di-carry ke bulan ini.
 *
 * Rules:
 * - Tampilkan semua details bulan sebelumnya untuk kendaraan ini
 * - Row hanya bisa dipilih kalau km_awal = km_akhir_row_terakhir_bulan_ini
 *   (kontinuitas km — tidak boleh loncat)
 * - Multiple select diperbolehkan asalkan km nyambung secara berurutan
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { History, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Alert from "../../../components/ui/Alert";
import api from "../../../api/axios";
import styles from "./CarryoverPicker.module.css";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface PrevDetail {
  id: number;
  start_km: number;
  end_km: number;
  cost_center: string | null;
  customer_code: string | null;
  description: string;
  cost_amount: number | null;
  is_carryover: boolean;
  cost_center_name?: string;
  customer_name?: string;
}

interface Props {
  headerId: number;
  vehicleId: number;
  currentMonth: number;
  currentYear: number;
  lastKm: number | null;       // km akhir row terakhir bulan ini
  onSuccess: () => void;
  onCancel: () => void;
}

const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

function prevPeriod(month: number, year: number) {
  if (month === 1) return { month: 12, year: year - 1 };
  return { month: month - 1, year };
}

function formatKm(val: number) {
  return new Intl.NumberFormat("id-ID").format(val);
}

function formatRupiah(val: number | null) {
  if (!val) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(val);
}

// ─────────────────────────────────────────────
export default function CarryoverPicker({
  headerId,
  vehicleId,
  currentMonth,
  currentYear,
  lastKm,
  onSuccess,
  onCancel,
}: Props) {
  // Periode yang dipilih user (default: bulan lalu)
  const defaultPrev = prevPeriod(currentMonth, currentYear);
  const [pickerMonth, setPickerMonth] = useState<number>(defaultPrev.month);
  const [pickerYear, setPickerYear] = useState<number>(defaultPrev.year);

  const [prevDetails, setPrevDetails] = useState<PrevDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Fetch detail bulan yang dipilih ─────────
  const fetchPrev = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    setSelectedIds(new Set());
    try {
      const { data } = await api.get("/vehicles/logbook", {
        params: { vehicle_id: vehicleId, month: pickerMonth, year: pickerYear },
      });
      setPrevDetails(data.details ?? []);
    } catch (e: any) {
      setFetchError(e?.response?.data?.message ?? "Gagal memuat data.");
      setPrevDetails([]);
    } finally {
      setLoading(false);
    }
  }, [vehicleId, pickerMonth, pickerYear]);

  useEffect(() => { fetchPrev(); }, [fetchPrev]);

  // ── Tentukan row mana yang bisa dipilih ──────
  // Aturan: km harus menyambung dengan lastKm bulan ini
  // Setelah row dipilih, row berikutnya harus menyambung dengan km akhir row yang dipilih
  const rowEligibility = useMemo(() => {
    const map = new Map<number, { canSelect: boolean; reason?: string }>();

    // Hitung "km akhir efektif" — dimulai dari lastKm bulan ini,
    // lalu bergerak sesuai row yang sudah dipilih (secara urutan)
    let expectedKm = lastKm;

    for (const d of prevDetails) {
      if (selectedIds.has(d.id)) {
        // Row ini sudah dipilih — km akhirnya jadi expectedKm berikutnya
        map.set(d.id, { canSelect: true });
        expectedKm = d.end_km;
      } else if (expectedKm === null) {
        // Belum ada km referensi sama sekali — semua bisa dipilih sebagai awal
        map.set(d.id, { canSelect: true });
      } else if (d.start_km === expectedKm) {
        // Nyambung
        map.set(d.id, { canSelect: true });
      } else {
        // Loncat — tidak bisa dipilih
        map.set(d.id, {
          canSelect: false,
          reason: `KM awal (${formatKm(d.start_km)}) tidak menyambung dari ${formatKm(expectedKm)}`,
        });
      }
    }

    return map;
  }, [prevDetails, selectedIds, lastKm]);

  // ── Toggle row ───────────────────────────────
  const toggleRow = useCallback((id: number, canSelect: boolean) => {
    if (!canSelect) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        // Deselect — harus deselect semua yang di belakangnya juga
        // (karena chain bisa putus)
        const idx = prevDetails.findIndex((d) => d.id === id);
        const toRemove = prevDetails.slice(idx).map((d) => d.id);
        toRemove.forEach((rid) => next.delete(rid));
      } else {
        next.add(id);
      }
      return next;
    });
  }, [prevDetails]);

  // ── Carry ke bulan ini ───────────────────────
  const handleCarry = async () => {
    if (selectedIds.size === 0) return;
    setSaving(true);
    setSaveError(null);
    try {
      await api.post(`/vehicles/logbook/${headerId}/carryover`, {
        source_detail_ids: Array.from(selectedIds),
      });
      onSuccess();
    } catch (e: any) {
      setSaveError(e?.response?.data?.message ?? "Gagal menyalin baris.");
    } finally {
      setSaving(false);
    }
  };

  // ── KM total terpilih ────────────────────────
  const totalKmSelected = useMemo(() => {
    return prevDetails
      .filter((d) => selectedIds.has(d.id))
      .reduce((s, d) => s + (d.end_km - d.start_km), 0);
  }, [prevDetails, selectedIds]);

  const MONTH_OPTS = MONTHS.map((label, i) => ({ value: i + 1, label }));
  const yearOpts = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // ─────────────────────────────────────────────
  return (
    <div className={styles.picker}>

      {/* ── Pilih periode ───────────────────── */}
      <div className={styles.periodeRow}>
        <div className={styles.fieldWrap}>
          <label className={styles.label}>Bulan</label>
          <select
            className={styles.select}
            value={pickerMonth}
            onChange={(e) => setPickerMonth(Number(e.target.value))}
          >
            {MONTH_OPTS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.fieldWrap}>
          <label className={styles.label}>Tahun</label>
          <select
            className={styles.select}
            value={pickerYear}
            onChange={(e) => setPickerYear(Number(e.target.value))}
          >
            {yearOpts.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Info lastKm */}
      <div className={styles.infoBar}>
        <History size={13} />
        <span>
          KM terakhir bulan ini:{" "}
          <strong>{lastKm !== null ? formatKm(lastKm) : "belum ada baris"}</strong>
          {" "}— row hanya bisa dipilih jika km menyambung.
        </span>
      </div>

      {/* Loading */}
      {loading && <p className={styles.loadingText}>Memuat data...</p>}

      {/* Fetch error */}
      {fetchError && (
        <Alert variant="danger" description={fetchError} dismissible onDismiss={() => setFetchError(null)} />
      )}

      {/* Tidak ada data */}
      {!loading && !fetchError && prevDetails.length === 0 && (
        <div className={styles.empty}>
          <p>Tidak ada data logbook untuk periode {MONTHS[pickerMonth - 1]} {pickerYear}.</p>
        </div>
      )}

      {/* ── Tabel row bulan lalu ─────────────── */}
      {!loading && prevDetails.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thCheck} />
                <th>Log KM</th>
                <th>CC / Customer</th>
                <th className={styles.thRight}>KM</th>
                <th>Keterangan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {prevDetails.map((d) => {
                const eligibility = rowEligibility.get(d.id);
                const canSelect = eligibility?.canSelect ?? false;
                const isSelected = selectedIds.has(d.id);

                return (
                  <tr
                    key={d.id}
                    className={`
                      ${styles.tr}
                      ${isSelected ? styles.trSelected : ""}
                      ${!canSelect ? styles.trDisabled : ""}
                    `}
                    onClick={() => toggleRow(d.id, canSelect)}
                    title={!canSelect ? eligibility?.reason : undefined}
                  >
                    <td className={styles.tdCheck}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(d.id, canSelect)}
                        disabled={!canSelect}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className={styles.tdMono}>
                      {formatKm(d.start_km)} → {formatKm(d.end_km)}
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
                    <td className={styles.tdDesc}>{d.description || "—"}</td>
                    <td>
                      {!canSelect ? (
                        <span className={styles.lockIcon} title={eligibility?.reason}>
                          <Lock size={13} />
                        </span>
                      ) : isSelected ? (
                        <CheckCircle size={14} className={styles.checkIcon} />
                      ) : null}
                      {d.is_carryover && (
                        <Badge variant="info" size="sm">carry</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Save error */}
      {saveError && (
        <Alert variant="danger" description={saveError} dismissible onDismiss={() => setSaveError(null)} />
      )}

      {/* ── Summary + Aksi ───────────────────── */}
      {selectedIds.size > 0 && (
        <div className={styles.summaryBar}>
          <span>
            <strong>{selectedIds.size}</strong> baris dipilih ·{" "}
            <strong>{formatKm(totalKmSelected)} km</strong>
          </span>
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>Batal</Button>
        <Button
          variant="primary"
          onClick={handleCarry}
          loading={saving}
          disabled={selectedIds.size === 0}
        >
          Salin {selectedIds.size > 0 ? `${selectedIds.size} Baris` : ""} ke Bulan Ini
        </Button>
      </div>
    </div>
  );
}