import { FC, useState, useEffect, ChangeEvent } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import styles from "./CostCenterManagement.module.css";
import api from "../../../api/axios";

interface CostCenter {
  id?: number;
  sap_id: string | null;
  description: string | null;
  short_name: string | null;
}

interface FormData {
  sap_id: string;
  description: string;
  short_name: string;
}

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

interface Props {
  costCenter?: CostCenter | null;
  onCancel: () => void;
  onSaved: () => void;
}

const makeInitialForm = (cc?: CostCenter | null): FormData => ({
  sap_id: cc?.sap_id ?? "",
  description: cc?.description ?? "",
  short_name: cc?.short_name ?? "",
});

const CostCenterForm: FC<Props> = ({ costCenter, onCancel, onSaved }) => {
  const isEdit = Boolean(costCenter?.id);
  const [form, setForm] = useState<FormData>(() => makeInitialForm(costCenter));
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(makeInitialForm(costCenter));
    setErrors({});
  }, [costCenter]);

  const handleChange =
    (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validate = (): FormErrors => {
    const err: FormErrors = {};
    if (!form.sap_id.trim()) err.sap_id = "SAP ID wajib diisi.";
    return err;
  };

  const handleSave = async () => {
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    setLoading(true);
    setErrors({});

    const payload = {
      sap_id: form.sap_id || null,
      description: form.description || null,
      short_name: form.short_name || null,
    };

    try {
      if (isEdit && costCenter?.id) {
        await api.put(`/cost-centers/${costCenter.id}`, payload);
      } else {
        await api.post("/cost-centers", payload);
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
          general: responseData?.message || "Gagal menyimpan data.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formGrid}>
      <Input
        label="SAP ID"
        placeholder="contoh: CC001"
        value={form.sap_id}
        onChange={handleChange("sap_id")}
        error={errors.sap_id}
        required
      />
      <Input
        label="Nama Singkat"
        placeholder="contoh: ADMIN"
        value={form.short_name}
        onChange={handleChange("short_name")}
        error={errors.short_name}
      />
      <div className={styles.fullWidth}>
        <Input
          label="Keterangan"
          placeholder="Deskripsi lengkap Cost Center"
          value={form.description}
          onChange={handleChange("description")}
          error={errors.description}
        />
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
          {isEdit ? "Simpan Perubahan" : "Tambah Cost Center"}
        </Button>
      </div>
    </div>
  );
};

export default CostCenterForm;
