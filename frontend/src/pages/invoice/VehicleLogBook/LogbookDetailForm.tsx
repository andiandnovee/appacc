// LogbookDetailForm.tsx
import { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback, useMemo } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import api from "../../../api/axios";
import type { CostDetail } from "./index";
import BebanSelect, { type BebanOption } from "./BebanSelect";
import styles from "./LogbookDetailForm.module.css";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface LogbookDetailFormRef {
  focusEndKm: () => void;
}

interface FormState {
  start_km: string;
  end_km: string;
  description: string;
}

type FormErrors = Partial<Record<keyof FormState | "beban", string>>;

interface Props {
  headerId: number;
  lastKm: number | null;
  detail?: CostDetail | null;
  onSuccess: () => void;
  onCancel: () => void;
  inline?: boolean; // optional, used by parent
}

// ─────────────────────────────────────────────
const LogbookDetailForm = forwardRef<LogbookDetailFormRef, Props>(
  ({ headerId, lastKm, detail, onSuccess, onCancel, inline }, ref) => {
    const isEdit = !!detail?.id;

    // Refs for focusable inputs
    const endKmInputRef = useRef<HTMLInputElement>(null);

    // Expose focusEndKm to parent
    useImperativeHandle(ref, () => ({
      focusEndKm: () => {
        endKmInputRef.current?.focus();
      },
    }));

    // ── State ────────────────────────────────────
    const [form, setForm] = useState<FormState>({
      start_km: "",
      end_km: "",
      description: "",
    });
    const [beban, setBeban] = useState<BebanOption | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    // ── Init / reset ──────────────────────────
    const makeInitial = useCallback((): FormState => {
      if (detail) {
        return {
          start_km: String(detail.start_km),
          end_km: String(detail.end_km),
          description: detail.description ?? "",
        };
      }
      return {
        start_km: lastKm !== null ? String(lastKm) : "",
        end_km: "",
        description: "",
      };
    }, [detail, lastKm]);

    useEffect(() => {
      setForm(makeInitial());
      setError(null);
      setErrors({});

      if (detail?.cost_center) {
        setBeban({
          type: "cost_center",
          sap_id: detail.cost_center,
          name: (detail as any).cost_center_name ?? detail.cost_center,
          short_name: null,
        });
      } else if (detail?.customer_code) {
        setBeban({
          type: "customer",
          sap_id: detail.customer_code,
          name: (detail as any).customer_name ?? detail.customer_code,
          short_name: null,
        });
      } else {
        setBeban(null);
      }
    }, [detail, makeInitial]);

    // ── Derived ──────────────────────────────────
    const kmDiff = useMemo(() => {
      const s = parseInt(form.start_km);
      const e = parseInt(form.end_km);
      if (!isNaN(s) && !isNaN(e) && e > s) return e - s;
      return null;
    }, [form.start_km, form.end_km]);

    // ── Validate ─────────────────────────────────
    const validate = (): boolean => {
      const errs: FormErrors = {};
      const s = parseInt(form.start_km);
      const e = parseInt(form.end_km);

      if (!form.start_km) errs.start_km = "KM awal wajib diisi.";
      if (!form.end_km) errs.end_km = "KM akhir wajib diisi.";
      if (!isNaN(s) && !isNaN(e) && e <= s)
        errs.end_km = "KM akhir harus lebih besar dari KM awal.";
      if (!form.description.trim()) errs.description = "Keterangan wajib diisi.";
      if (!beban) errs.beban = "Pilih beban (cost center atau customer).";

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
          cost_center: beban?.type === "cost_center" ? beban.sap_id : null,
          customer_code: beban?.type === "customer" ? beban.sap_id : null,
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
          const mapped: FormErrors = {};
          Object.entries(errs).forEach(([k, v]) => {
            (mapped as any)[k] = Array.isArray(v) ? v[0] : v;
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
        {/* KM Range */}
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
            ref={endKmInputRef}
            label="KM Akhir"
            type="number"
            value={form.end_km}
            onChange={(e) => setForm((p) => ({ ...p, end_km: e.target.value }))}
            error={errors.end_km}
            required
            hint={kmDiff !== null ? `${new Intl.NumberFormat("id-ID").format(kmDiff)} km` : undefined}
          />
        </div>

        {/* Keterangan */}
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

        {/* Beban */}
        <BebanSelect
          value={beban}
          onChange={setBeban}
          error={errors.beban}
          disabled={saving}
        />

        {error && (
          <Alert
            variant="danger"
            description={error}
            dismissible
            onDismiss={() => setError(null)}
          />
        )}

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            {isEdit ? "Simpan Perubahan" : "Tambah Baris"}
          </Button>
        </div>

        <p className={styles.hint}>
          Biaya dikalkulasi otomatis saat "Kalkulasi Ulang" diklik. Rate = Total Biaya SAP ÷ Total KM semua baris.
        </p>
      </div>
    );
  }
);

LogbookDetailForm.displayName = "LogbookDetailForm";

export default LogbookDetailForm; 