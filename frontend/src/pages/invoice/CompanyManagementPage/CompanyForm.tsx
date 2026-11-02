import { ChangeEvent, FC, useEffect, useState } from "react";
import api from "../../../api/axios";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import styles from "./CompanyManagement.module.css";

interface Company { id?: number; sap_id: number | null; name: string; npwp: string | null; address: string | null; accbank: string | null }
interface FormData { sap_id: string; name: string; npwp: string; address: string; accbank: string }
type FormErrors = Partial<Record<keyof FormData | "general", string>>;
interface Props { company?: Company | null; onCancel: () => void; onSaved: () => void }
const initial = (company?: Company | null): FormData => ({ sap_id: company?.sap_id == null ? "" : String(company.sap_id), name: company?.name ?? "", npwp: company?.npwp ?? "", address: company?.address ?? "", accbank: company?.accbank ?? "" });

const CompanyForm: FC<Props> = ({ company, onCancel, onSaved }) => {
  const isEdit = Boolean(company?.id);
  const [form, setForm] = useState<FormData>(() => initial(company));
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => { setForm(initial(company)); setErrors({}); }, [company]);
  const change = (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm(current => ({ ...current, [field]: event.target.value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const save = async () => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Nama Company wajib diisi.";
    if (!form.sap_id.trim()) next.sap_id = "SAP ID wajib diisi.";
    else if (!/^\d+$/.test(form.sap_id.trim())) next.sap_id = "SAP ID harus berupa angka.";
    if (Object.keys(next).length) { setErrors(next); return; }
    setLoading(true); setErrors({});
    const payload = { sap_id: Number(form.sap_id.trim()), name: form.name.trim(), npwp: form.npwp.trim() || null, address: form.address.trim() || null, accbank: form.accbank.trim() || null };
    try {
      if (isEdit && company?.id) await api.put(`/companies/${company.id}`, payload);
      else { await api.post("/companies", payload); setForm(initial(null)); }
      onSaved();
    } catch (error: any) {
      const data = error?.response?.data;
      if (data?.errors && typeof data.errors === "object") {
        const formatted: FormErrors = {};
        Object.entries(data.errors).forEach(([field, messages]) => { formatted[field as keyof FormData] = Array.isArray(messages) ? String(messages[0]) : String(messages); });
        setErrors(formatted);
      } else setErrors({ general: data?.message || "Gagal menyimpan Company." });
    } finally { setLoading(false); }
  };

  return <div className={styles.formGrid}>
    <Input label="SAP ID" placeholder="Contoh: 1000" value={form.sap_id} onChange={change("sap_id")} error={errors.sap_id} required />
    <Input label="Nama Company" placeholder="Nama resmi perusahaan" value={form.name} onChange={change("name")} error={errors.name} required />
    <Input label="NPWP" placeholder="Nomor NPWP perusahaan" value={form.npwp} onChange={change("npwp")} error={errors.npwp} />
    <div className={styles.fullWidth}><Input label="Alamat" placeholder="Alamat perusahaan" value={form.address} onChange={change("address")} error={errors.address} /></div>
    <div className={styles.fullWidth}><Input label="Rekening Bank" placeholder="Informasi rekening bank" value={form.accbank} onChange={change("accbank")} error={errors.accbank} /></div>
    {errors.general && <p className={`${styles.errorText} ${styles.errorGeneral} ${styles.fullWidth}`}>{errors.general}</p>}
    <div className={`${styles.formActions} ${styles.fullWidth}`}><Button variant="ghost" onClick={onCancel} disabled={loading}>Batal</Button><Button variant="primary" onClick={save} loading={loading}>{isEdit ? "Simpan Perubahan" : "Tambah Company"}</Button></div>
  </div>;
};
export default CompanyForm;
