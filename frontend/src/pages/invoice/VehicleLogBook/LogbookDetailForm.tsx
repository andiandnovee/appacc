/**
 * LogbookDetailForm.tsx
 * Path: frontend/src/pages/vehicles/LogbookDetailForm.tsx
 *
 * Form tambah / edit satu baris logbook (vehicle_cost_details).
 * Dirender di dalam Drawer.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import Badge from "../../../components/ui/Badge";
import api from "../../../api/axios";
import type { CostDetail } from "./index";
import styles from "./LogbookDetailForm.module.css";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type AllocType = "cost_center" | "customer";

interface FormState {
  start_km: string;
  end_km: string;
  description: string;
  alloc_type: AllocType;
  cost_center: string;
  customer_code: string;
}

interface Props {
  headerId: number;
  lastKm: number | null;       // km akhir row terakhir — prefill start_km
  detail?: CostDetail | null;  // null = mode tambah
  onSuccess: () => void;
  onCancel: () => void;
}

// ─────────────────────────────────────────────
export default function LogbookDetailForm({
  headerId,
  lastKm,
  detail,
  onSuccess,
  onCancel,
}: Props) {
  const isEdit = !!detail?.id;

  const makeInitial = useCallback((): FormState => {
    if (detail) {
      return {
        start_km: String(detail.start_km),
        end_km: String(detail.end_km),
        description: detail.description ?? "",
        alloc_type: detail.cost_center ? "cost_center" : "customer",
        cost_center: detail.cost_center ?? "",
        customer_code: detail.customer_code ?? "",
      };
    }
    return {
      start_km: lastKm !== null ? String(lastKm) : "",
      end_km: "",
      description: "",
      alloc_type: "cost_center",
      cost_center: "",
      customer_code: "",
    };
  }, [detail, lastKm]);

  const [form, setForm] = useState<FormState>(makeInitial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Reset saat detail prop berubah
  useEffect(() => {
    setForm(makeInitial());
    setError(null);
    setErrors({});
  }, [detail, makeInitial]);

  // ── Derived ─────────────────────────────────
  const kmDiff = useMemo(() => {
    const s = parseInt(form.start_km);
    const e = parseInt(form.end_km);
    if (!isNaN(s) && !isNaN(e) && e > s) return e - s;
    return null;
  }, [form.start_km, form.end_km]);

  // ── Validate ─────────────────────────────────
  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    const s = parseInt(form.start_km);
    const e = parseInt(form.end_km);

    if (!form.start_km) errs.start_km = "KM awal wajib diisi.";
    if (!form.end_km) errs.end_km = "KM akhir wajib diisi.";
    if (!isNaN(s) && !isNaN(e) && e <= s) errs.end_km = "KM akhir harus lebih besar dari KM awal.";
    if (!form.description.trim()) errs.description = "Keterangan wajib diisi.";
    if (form.alloc_type === "cost_center" && !form.cost_center)
      errs.cost_center = "Pilih cost center.";
    if (form.alloc_type === "customer" && !form.customer_code)
      errs.customer_code = "Pilih customer.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ───────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        vehicle_cost_header_id: headerId,
        start_km: parseInt(form.start_km),
        end_km: parseInt(form.end_km),
        description: form.description.trim(),
        cost_center: form.alloc_type === "cost_center" ? form.cost_center : null,
        customer_code: form.alloc_type === "customer" ? form.customer_code : null,
      };

      if (isEdit && detail?.id) {
        await api.put(`/vehicles/logbook/detail/${detail.id}`, payload);
      } else {
        await api.post("/vehicles/logbook/detail", payload);
      }

      onSuccess();
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      const errs = e?.response?.data?.errors;
      if (errs) {
        const mapped: any = {};
        Object.entries(errs).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(mapped);
      } else {
        setError(msg ?? "Gagal menyimpan data.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────
  return (
    <div className={styles.form}>

      {/* ── KM Range ────────────────────────── */}
      <div className={styles.kmRow}>
        <Input
          label="KM Awal"
          type="number"
          value={form.start_km}
          onChange={(e) => setForm((p) => ({ ...p, start_km: e.target.value }))}
          error={errors.start_km}
          readOnly={!isEdit && lastKm !== null}
          hint={!isEdit && lastKm !== null ? "Otomatis dari baris sebelumnya" : undefined}
          required
        />
        <Input
          label="KM Akhir"
          type="number"
          value={form.end_km}
          onChange={(e) => setForm((p) => ({ ...p, end_km: e.target.value }))}
          error={errors.end_km}
          required
          hint={kmDiff !== null ? `${new Intl.NumberFormat("id-ID").format(kmDiff)} km` : undefined}
        />
      </div>

      {/* ── Keterangan ──────────────────────── */}
      <Input
        label="Keterangan"
        type="textarea"
        rows={2}
        placeholder="contoh: FADHLAN LGL/POLRES ROHIL"
        value={form.description}
        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        error={errors.description}
        required
      />

      {/* ── Tipe Alokasi ────────────────────── */}
      <div className={styles.allocTypeRow}>
        <label className={styles.allocLabel}>Alokasi ke</label>
        <div className={styles.allocToggle}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${form.alloc_type === "cost_center" ? styles.toggleBtnActive : ""}`}
            onClick={() => setForm((p) => ({ ...p, alloc_type: "cost_center", customer_code: "" }))}
          >
            Cost Center Dept
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${form.alloc_type === "customer" ? styles.toggleBtnActive : ""}`}
            onClick={() => setForm((p) => ({ ...p, alloc_type: "customer", cost_center: "" }))}
          >
            Customer (GL)
          </button>
        </div>
      </div>

      {/* ── Pilih CC atau Customer ───────────── */}
      {form.alloc_type === "cost_center" ? (
        <Select
          label="Cost Center"
          placeholder="Pilih departemen..."
          value={form.cost_center}
          onChange={(e) => setForm((p) => ({ ...p, cost_center: e.target.value }))}
          error={errors.cost_center}
          fetchOptions={{
            endpoint: "/cost-centers",
            searchParam: "search",
            limit: 10,
          }}
          required
        />
      ) : (
        <Select
          label="Customer (Business Area)"
          placeholder="Pilih customer..."
          value={form.customer_code}
          onChange={(e) => setForm((p) => ({ ...p, customer_code: e.target.value }))}
          error={errors.customer_code}
          fetchOptions={{
            endpoint: "/customers",
            searchParam: "search",
            limit: 10,
          }}
          required
        />
      )}

      {/* Error umum */}
      {error && (
        <Alert variant="danger" description={error} dismissible onDismiss={() => setError(null)} />
      )}

      {/* ── Actions ─────────────────────────── */}
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSave} loading={saving}>
          {isEdit ? "Simpan Perubahan" : "Tambah Baris"}
        </Button>
      </div>

      {/* Info balance */}
      <p className={styles.hint}>
        Biaya akan dikalkulasi otomatis saat "Kalkulasi Ulang" diklik.
        Rate = Total Biaya SAP ÷ Total KM semua baris.
      </p>
    </div>
  );
}