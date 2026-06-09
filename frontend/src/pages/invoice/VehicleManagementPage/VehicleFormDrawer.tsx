import { FC, useState, useEffect, useCallback, ChangeEvent } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Drawer from "../../../components/ui/Drawer";
import styles from "./VehicleManagement.module.css";
import api from "../../../api/axios";

// ── Types ─────────────────────────────────────────────────────
interface Vehicle {
  id?: number;
  vehicle_type: string | null;
  company_code: string | null;
  business_area_code: string | null;
  description: string | null;
  plate_number: string | null;
  plate_number_old: string | null;
  cost_center: string | null;
  chassis_number: string | null;
  engine_number: string | null;
  is_active: string | null;
  notes: string | null;
  stnkb_valid_until: string | null;
  pkb_valid_until: string | null;
  kier_valid_until: string | null;
}

interface FormData {
  vehicle_type: string;
  company_code: string;
  business_area_code: string;
  description: string;
  plate_number: string;
  plate_number_old: string;
  cost_center: string;
  chassis_number: string;
  engine_number: string;
  is_active: string;
  notes: string;
  stnkb_valid_until: string;
  pkb_valid_until: string;
  kier_valid_until: string;
}

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

interface Props {
  vehicle?: Vehicle | null;
  onCancel: () => void;
  onSaved: () => void;
  // drawer mode
  isDrawer?: boolean;
  drawerOpen?: boolean;
  onDrawerClose?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────
const VEHICLE_TYPES = [
  { value: "R4", label: "Mobil" },
  { value: "R2", label: "Sepeda Motor" },
];

const IS_ACTIVE_OPTIONS = [
  { value: "1", label: "Aktif" },
  { value: "0", label: "Nonaktif" },
];

const makeInitialForm = (vehicle?: Vehicle | null): FormData => ({
  vehicle_type: vehicle?.vehicle_type ?? "",
  company_code: vehicle?.company_code ?? "",
  business_area_code: vehicle?.business_area_code ?? "",
  description: vehicle?.description ?? "",
  plate_number: vehicle?.plate_number ?? "",
  plate_number_old: vehicle?.plate_number_old ?? "",
  cost_center: vehicle?.cost_center ?? "",
  chassis_number: vehicle?.chassis_number ?? "",
  engine_number: vehicle?.engine_number ?? "",
  is_active: vehicle?.is_active ?? "1",
  notes: vehicle?.notes ?? "",
  stnkb_valid_until: vehicle?.stnkb_valid_until ?? "",
  pkb_valid_until: vehicle?.pkb_valid_until ?? "",
  kier_valid_until: vehicle?.kier_valid_until ?? "",
});

// ── Component ─────────────────────────────────────────────────
const VehicleFormDrawer: FC<Props> = ({
  vehicle,
  onCancel,
  onSaved,
  isDrawer = false,
  drawerOpen = false,
  onDrawerClose,
}) => {
  const isEdit = Boolean(vehicle?.id);

  const [form, setForm] = useState<FormData>(() => makeInitialForm(vehicle));
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Reset saat vehicle berubah
  useEffect(() => {
    setForm(makeInitialForm(vehicle));
    setErrors({});
  }, [vehicle]);

  // ── Field handlers ─────────────────────────────────────────
  const handleChange =
    (field: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSelectChange =
    (field: keyof FormData) => (e: { target: { value: any } }) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // ── BA → Company auto-fill ─────────────────────────────────
  const handleBaBlur = useCallback(async () => {
    const baCode = form.business_area_code.trim();
    if (!baCode || form.company_code) return; // sudah ada company, skip
    try {
      const res = await api.get(`/busa`, { params: { search: baCode } });
      const list = res.data?.data ?? res.data ?? [];
      const ba = Array.isArray(list)
        ? list.find((b: any) => b.sap_id === baCode)
        : null;
      if (ba?.company?.sap_id || ba?.company_code) {
        setForm((prev) => ({
          ...prev,
          company_code:
            ba?.company?.sap_id ?? ba?.company_code ?? prev.company_code,
        }));
      }
    } catch {
      // gagal auto-fill, abaikan
    }
  }, [form.business_area_code, form.company_code]);

  // ── Validate ───────────────────────────────────────────────
  const validate = (): FormErrors => {
    const err: FormErrors = {};
    if (!form.plate_number.trim()) err.plate_number = "Plat nomor wajib diisi.";
    if (!form.vehicle_type) err.vehicle_type = "Tipe kendaraan wajib dipilih.";
    if (!form.company_code.trim())
      err.company_code = "Company Code wajib diisi.";
    return err;
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSave = async () => {
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    setLoading(true);
    setErrors({});

    const payload = {
      vehicle_type: form.vehicle_type || null,
      company_code: form.company_code || null,
      business_area_code: form.business_area_code || null,
      description: form.description || null,
      plate_number: form.plate_number || null,
      plate_number_old: form.plate_number_old || null,
      cost_center: form.cost_center || null,
      chassis_number: form.chassis_number || null,
      engine_number: form.engine_number || null,
      is_active: form.is_active,
      notes: form.notes || null,
      stnkb_valid_until: form.stnkb_valid_until || null,
      pkb_valid_until: form.pkb_valid_until || null,
      kier_valid_until: form.kier_valid_until || null,
    };

    try {
      if (isEdit && vehicle?.id) {
        await api.put(`/vehicles/${vehicle.id}`, payload);
      } else {
        await api.post("/vehicles", payload);
        // reset setelah tambah
        setForm(makeInitialForm(null));
      }
      onSaved();
    } catch (e: any) {
      const responseData = e?.response?.data;
      if (responseData?.errors && typeof responseData.errors === "object") {
        const formatted: FormErrors = {};
        Object.entries(responseData.errors).forEach(([field, messages]) => {
          formatted[field as keyof FormData] = Array.isArray(messages)
            ? messages[0]
            : (messages as string);
        });
        setErrors(formatted);
      } else {
        setErrors({
          general:
            responseData?.message ||
            (isEdit
              ? "Gagal menyimpan perubahan."
              : "Gagal menambah kendaraan."),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Form body ──────────────────────────────────────────────
  const formBody = (
    <div className={styles.formGrid}>
      {/* Row 1 */}
      <Input
        label="Plat Nomor"
        placeholder="contoh: BM 1234 AB"
        value={form.plate_number}
        onChange={handleChange("plate_number")}
        error={errors.plate_number}
        required
      />
      <Input
        label="Plat Nomor Lama"
        placeholder="opsional"
        value={form.plate_number_old}
        onChange={handleChange("plate_number_old")}
        error={errors.plate_number_old}
      />

      {/* Row 2 */}
      <Select
        label="Tipe Kendaraan"
        value={form.vehicle_type}
        onChange={handleSelectChange("vehicle_type")}
        placeholder="— Pilih Tipe —"
        options={VEHICLE_TYPES}
        error={errors.vehicle_type}
        required
      />
      <Select
        label="Status"
        value={form.is_active}
        onChange={handleSelectChange("is_active")}
        options={IS_ACTIVE_OPTIONS}
        error={errors.is_active}
      />

      {/* Row 3 */}
      <div className={styles.fullWidth}>
        <Input
          label="Keterangan / Nama Kendaraan"
          placeholder="contoh: Toyota Avanza 2022"
          value={form.description}
          onChange={handleChange("description")}
          error={errors.description}
        />
      </div>

      {/* Separator */}
      <div className={`${styles.sectionLabel} ${styles.fullWidth}`}>
        Referensi SAP
      </div>

      {/* Row 4 */}
      <Input
        label="Company Code"
        placeholder="contoh: INA1"
        value={form.company_code}
        onChange={handleChange("company_code")}
        error={errors.company_code}
        required
      />
      <Input
        label="Business Area Code"
        placeholder="contoh: BA01"
        value={form.business_area_code}
        onChange={handleChange("business_area_code")}
        onBlur={handleBaBlur}
        error={errors.business_area_code}
        hint="Auto-fill Company Code dari BA"
      />
      <Input
        label="Cost Center"
        placeholder="contoh: CC001"
        value={form.cost_center}
        onChange={handleChange("cost_center")}
        error={errors.cost_center}
      />

      {/* Separator */}
      <div className={`${styles.sectionLabel} ${styles.fullWidth}`}>
        Data Teknis
      </div>

      <Input
        label="Nomor Rangka (Chassis)"
        placeholder="VIN / Nomor rangka"
        value={form.chassis_number}
        onChange={handleChange("chassis_number")}
        error={errors.chassis_number}
      />
      <Input
        label="Nomor Mesin"
        placeholder="Nomor mesin"
        value={form.engine_number}
        onChange={handleChange("engine_number")}
        error={errors.engine_number}
      />

      {/* Separator */}
      <div className={`${styles.sectionLabel} ${styles.fullWidth}`}>
        Masa Berlaku Dokumen
      </div>

      <Input
        label="STNKB Berlaku s/d"
        type="date"
        value={form.stnkb_valid_until}
        onChange={handleChange("stnkb_valid_until")}
        error={errors.stnkb_valid_until}
      />
      <Input
        label="PKB Berlaku s/d"
        type="date"
        value={form.pkb_valid_until}
        onChange={handleChange("pkb_valid_until")}
        error={errors.pkb_valid_until}
      />
      <Input
        label="KIR Berlaku s/d"
        type="date"
        value={form.kier_valid_until}
        onChange={handleChange("kier_valid_until")}
        error={errors.kier_valid_until}
      />

      {/* Notes */}
      <div className={`${styles.formField} ${styles.fullWidth}`}>
        <label className={styles.label}>Catatan</label>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="Catatan tambahan (opsional)"
          value={form.notes}
          onChange={handleChange("notes")}
        />
        {errors.notes && <p className={styles.errorText}>{errors.notes}</p>}
      </div>

      {errors.general && (
        <p
          className={`${styles.errorText} ${styles.errorGeneral} ${styles.fullWidth}`}
        >
          {errors.general}
        </p>
      )}

      <div className={`${styles.formActions} ${styles.fullWidth}`}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          {isEdit ? "Simpan Perubahan" : "Tambah Kendaraan"}
        </Button>
      </div>
    </div>
  );

  // ── Drawer mode ────────────────────────────────────────────
  if (isDrawer) {
    return (
      <Drawer isOpen={drawerOpen} onClose={onDrawerClose ?? onCancel} size="lg">
        <Drawer.Header
          title={isEdit ? "Edit Kendaraan" : "Tambah Kendaraan"}
          subtitle={
            isEdit
              ? `Plat: ${vehicle?.plate_number ?? "—"}`
              : "Isi data kendaraan baru"
          }
          onClose={onDrawerClose ?? onCancel}
        />
        <Drawer.Body>{formBody}</Drawer.Body>
      </Drawer>
    );
  }

  // ── Inline mode (di dalam Collapsible) ────────────────────
  return formBody;
};

export default VehicleFormDrawer;
