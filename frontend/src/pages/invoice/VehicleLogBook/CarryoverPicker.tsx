/**
 * CarryoverPicker.tsx
 * Path: frontend/src/pages/vehicles/CarryoverPicker.tsx
 *
 * Drawer content: pilih baris logbook dari bulan lalu untuk di-carry ke bulan ini.
 *
 * Rules:
 * - Tampilkan semua details bulan sebelumnya untuk kendaraan ini
 * - Row bisa disisipkan sebelum KM awal atau ditambahkan setelah KM akhir
 *   bulan ini (kontinuitas km — tidak boleh loncat)
 * - Multiple select diperbolehkan asalkan km nyambung secara berurutan
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { History, CheckCircle, Lock } from "lucide-react";
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
  firstKm: number | null;      // km awal row pertama bulan ini
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

function sameKm(left: number | null, right: number | null) {
  return left !== null && right !== null && Number(left) === Number(right);
}

// ─────────────────────────────────────────────
export default function CarryoverPicker({
  headerId,
  vehicleId,
  currentMonth,
  currentYear,
  firstKm,
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
  const selectedDetails = useMemo(
    () => prevDetails.filter((d) => selectedIds.has(d.id)),
    [prevDetails, selectedIds],
  );

  const selectionDirection = useMemo<"prepend" | "append" | null>(() => {
    if (selectedDetails.length === 0) return null;
    if (sameKm(selectedDetails[selectedDetails.length - 1].end_km, firstKm)) {
      return "prepend";
    }
    if (sameKm(selectedDetails[0].start_km, lastKm)) return "append";
    return null;
  }, [selectedDetails, firstKm, lastKm]);

  // Pilihan pertama boleh menempel ke batas awal atau akhir bulan ini.
  // Setelah itu, pilihan berikutnya harus meneruskan rantai pada arah yang sama.
  const rowEligibility = useMemo(() => {
    const map = new Map<number, { canSelect: boolean; reason?: string }>();

    const prependKm = selectedDetails[0]?.start_km ?? firstKm;
    const appendKm = selectedDetails[selectedDetails.length - 1]?.end_km ?? lastKm;

    for (const d of prevDetails) {
      if (selectedIds.has(d.id)) {
        map.set(d.id, { canSelect: true });
      } else if (firstKm === null && lastKm === null) {
        map.set(d.id, { canSelect: true });
      } else if (
        selectionDirection === "prepend" && sameKm(d.end_km, prependKm)
      ) {
        map.set(d.id, { canSelect: true });
      } else if (
        selectionDirection === "append" && sameKm(d.start_km, appendKm)
      ) {
        map.set(d.id, { canSelect: true });
      } else if (
        selectionDirection === null &&
        (sameKm(d.end_km, firstKm) || sameKm(d.start_km, lastKm))
      ) {
        map.set(d.id, { canSelect: true });
      } else {
        map.set(d.id, {
          canSelect: false,
          reason: `Rentang ${formatKm(d.start_km)}–${formatKm(d.end_km)} tidak menyambung ke batas KM bulan ini`,
        });
      }
    }

    return map;
  }, [prevDetails, selectedDetails, selectedIds, selectionDirection, firstKm, lastKm]);

  // ── Toggle row ───────────────────────────────
  const toggleRow = useCallback((id: number, canSelect: boolean) => {
    if (!canSelect) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        const idx = prevDetails.findIndex((d) => d.id === id);
        const toRemove = selectionDirection === "append"
          ? prevDetails.slice(idx).map((d) => d.id)
          : prevDetails.slice(0, idx + 1).map((d) => d.id);
        toRemove.forEach((rid) => next.delete(rid));
      } else {
        next.add(id);
      }
      return next;
    });
  }, [prevDetails, selectionDirection]);

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

      {/* Info anchor KM */}
      <div className={styles.infoBar}>
        <History size={13} />
        <span>
          Batas KM bulan ini:{" "}
          <strong>
            {firstKm !== null ? formatKm(firstKm) : "—"}
            {" → "}
            {lastKm !== null ? formatKm(lastKm) : "—"}
          </strong>
          {" "}— baris dapat disisipkan di awal atau ditambahkan di akhir.
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
