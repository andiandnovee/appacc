import { ChangeEvent, FC, useEffect, useState } from "react";
import api from "../../../api/axios";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import styles from "./CustomerManagement.module.css";

interface Customer {
  id?: number;
  sap_id: string | null;
  name: string | null;
  short_name: string | null;
}

interface FormData {
  sap_id: string;
  name: string;
  short_name: string;
}

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

interface Props {
  customer?: Customer | null;
  onCancel: () => void;
  onSaved: () => void;
}

const makeInitialForm = (customer?: Customer | null): FormData => ({
  sap_id: customer?.sap_id ?? "",
  name: customer?.name ?? "",
  short_name: customer?.short_name ?? "",
});

const CustomerForm: FC<Props> = ({ customer, onCancel, onSaved }) => {
  const isEdit = Boolean(customer?.id);
  const [form, setForm] = useState<FormData>(() => makeInitialForm(customer));
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(makeInitialForm(customer));
    setErrors({});
  }, [customer]);

  const handleChange =
    (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!form.sap_id.trim()) nextErrors.sap_id = "SAP ID wajib diisi.";
    if (!form.name.trim()) nextErrors.name = "Nama customer wajib diisi.";
    return nextErrors;
  };

  const handleSave = async () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const payload = {
      sap_id: form.sap_id.trim(),
      name: form.name.trim(),
      short_name: form.short_name.trim() || null,
    };

    try {
      if (isEdit && customer?.id) {
        await api.put(`/customers/${customer.id}`, payload);
      } else {
        await api.post("/customers", payload);
        setForm(makeInitialForm(null));
      }
      onSaved();
    } catch (error: any) {
      const responseData = error?.response?.data;
      if (responseData?.errors && typeof responseData.errors === "object") {
        const formatted: FormErrors = {};
        Object.entries(responseData.errors).forEach(([field, messages]) => {
          formatted[field as keyof FormData] = Array.isArray(messages)
            ? String(messages[0])
            : String(messages);
        });
        setErrors(formatted);
      } else {
        setErrors({
          general: responseData?.message || "Gagal menyimpan customer.",
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
        placeholder="contoh: 1000000001"
        value={form.sap_id}
        onChange={handleChange("sap_id")}
        error={errors.sap_id}
        required
      />
      <Input
        label="Nama Singkat"
        placeholder="contoh: HEAD OFFICE"
        value={form.short_name}
        onChange={handleChange("short_name")}
        error={errors.short_name}
      />
      <div className={styles.fullWidth}>
        <Input
          label="Nama Customer"
          placeholder="Nama lengkap customer"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
          required
        />
      </div>

      {errors.general && (
        <p className={`${styles.errorText} ${styles.errorGeneral} ${styles.fullWidth}`}>
          {errors.general}
        </p>
      )}

      <div className={`${styles.formActions} ${styles.fullWidth}`}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          {isEdit ? "Simpan Perubahan" : "Tambah Customer"}
        </Button>
      </div>
    </div>
  );
};

export default CustomerForm;
