import { ChangeEvent, FC, useEffect, useState } from "react";
import api from "../../../api/axios";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import styles from "./GLAccountManagement.module.css";

export interface GLAccount {
  id: number;
  gl_acc: string | null;
  gl_text: string | null;
  gl_group: string | null;
  group_src: "sheet" | "inferred";
  desc: string | null;
  other_desc: string | null;
}

interface FormData {
  gl_acc: string;
  gl_text: string;
  gl_group: string;
  group_src: "sheet" | "inferred";
  desc: string;
  other_desc: string;
}

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

interface Props {
  account: GLAccount | null;
  onCancel: () => void;
  onSaved: () => void;
}

const makeInitialForm = (account: GLAccount | null): FormData => ({
  gl_acc: account?.gl_acc ?? "",
  gl_text: account?.gl_text ?? "",
  gl_group: account?.gl_group ?? "",
  group_src: account?.group_src ?? "sheet",
  desc: account?.desc ?? "",
  other_desc: account?.other_desc ?? "",
});

const GLAccountForm: FC<Props> = ({ account, onCancel, onSaved }) => {
  const isEdit = Boolean(account?.id);
  const [form, setForm] = useState<FormData>(() => makeInitialForm(account));
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(makeInitialForm(account));
    setErrors({});
  }, [account]);

  const handleChange =
    (field: keyof FormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (form.gl_acc && !/^\d{1,8}$/.test(form.gl_acc.trim())) {
      next.gl_acc = "GL Account harus berisi maksimal 8 digit angka.";
    }
    if (!form.group_src) next.group_src = "Sumber group wajib dipilih.";
    return next;
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
      gl_acc: form.gl_acc.trim() || null,
      gl_text: form.gl_text.trim() || null,
      gl_group: form.gl_group.trim() || null,
      group_src: form.group_src,
      desc: form.desc.trim() || null,
      other_desc: form.other_desc.trim() || null,
    };

    try {
      if (isEdit && account) {
        await api.put(`/gl-accounts/${account.id}`, payload);
      } else {
        await api.post("/gl-accounts", payload);
      }
      onSaved();
      if (!isEdit) setForm(makeInitialForm(null));
    } catch (error: any) {
      const response = error?.response?.data;
      if (response?.errors && typeof response.errors === "object") {
        const formatted: FormErrors = {};
        Object.entries(response.errors).forEach(([field, messages]) => {
          formatted[field as keyof FormData] = Array.isArray(messages)
            ? String(messages[0])
            : String(messages);
        });
        setErrors(formatted);
      } else {
        setErrors({ general: response?.message || "Gagal menyimpan GL Account." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formGrid}>
      <Input
        label="GL Account"
        placeholder="Contoh: 75111001"
        value={form.gl_acc}
        onChange={handleChange("gl_acc")}
        error={errors.gl_acc}
        maxLength={8}
      />
      <Input
        label="Nama GL"
        placeholder="Nama akun dari SAP"
        value={form.gl_text}
        onChange={handleChange("gl_text")}
        error={errors.gl_text}
      />
      <Input
        label="Group GL"
        placeholder="Contoh: 7511 - GENERAL EXPENSES"
        value={form.gl_group}
        onChange={handleChange("gl_group")}
        error={errors.gl_group}
      />
      <div>
        <Select
          label="Jenis sumber group"
          value={form.group_src}
          onChange={(event: { target: { value: string } }) =>
            setForm((previous) => ({
              ...previous,
              group_src: event.target.value as FormData["group_src"],
            }))
          }
          options={[
            { value: "sheet", label: "Sheet" },
            { value: "inferred", label: "Inferred" },
          ]}
          error={errors.group_src}
        />
      </div>
      <Input
        label="Keterangan"
        type="textarea"
        rows={3}
        value={form.desc}
        onChange={handleChange("desc")}
        error={errors.desc}
      />
      <div className={styles.fullWidth}>
        <Input
          label="Keterangan Tambahan"
          type="textarea"
          rows={3}
          value={form.other_desc}
          onChange={handleChange("other_desc")}
          error={errors.other_desc}
        />
      </div>
      {errors.general && (
        <p className={`${styles.errorText} ${styles.fullWidth}`}>{errors.general}</p>
      )}
      <div className={`${styles.formActions} ${styles.fullWidth}`}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          {isEdit ? "Simpan Perubahan" : "Tambah GL Account"}
        </Button>
      </div>
    </div>
  );
};

export default GLAccountForm;
