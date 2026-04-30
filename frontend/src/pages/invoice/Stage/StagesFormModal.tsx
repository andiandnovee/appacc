import { FC, useState, ChangeEvent } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import styles from "./Stages.module.css";
import api from "../../../api/axios";

// ======================== TYPES ========================

interface Stage {
  id: number;
  name: string;
  start_date: string;
  year: number;
}

interface StageFormModalProps {
  stage?: Stage;
  onClose: () => void;
  onSaved: () => void;
}

interface FormData {
  name: string;
  start_date: string;
  year: string;
}

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

// ======================== COMPONENT ========================

const StageFormModal: FC<StageFormModalProps> = ({ stage, onClose, onSaved }) => {
  const isEdit = Boolean(stage);

  const [form, setForm] = useState<FormData>({
    name:       stage?.name ?? "",
    start_date: stage?.start_date ?? "",
    year:       stage?.year != null ? String(stage.year) : String(new Date().getFullYear()),
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState<FormErrors>({});

  const handleChange =
    (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Hapus error field saat user mulai mengetik
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): FormErrors => {
    const err: FormErrors = {};
    if (!form.name.trim())       err.name       = "Nama stage wajib diisi.";
    if (!form.start_date)        err.start_date = "Tanggal mulai wajib diisi.";
    if (!form.year)              err.year       = "Tahun wajib diisi.";
    else if (!/^\d{4}$/.test(form.year)) err.year = "Tahun harus 4 digit angka.";
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

    try {
      const payload = {
        name:       form.name.trim(),
        start_date: form.start_date,
        year:       Number(form.year),
      };

      if (isEdit && stage) {
        await api.put(`/stages/${stage.id}`, payload);
      } else {
        await api.post("/stages", payload);
      }

      onSaved();
    } catch (e: any) {
      const responseData = e?.response?.data;

      if (responseData?.errors && typeof responseData.errors === "object") {
        const formattedErrors: FormErrors = {};
        Object.entries(responseData.errors).forEach(([field, messages]) => {
          formattedErrors[field as keyof FormData] = Array.isArray(messages)
            ? messages[0]
            : (messages as string);
        });
        setErrors(formattedErrors);
      } else {
        setErrors({
          general:
            responseData?.message ||
            (isEdit ? "Gagal menyimpan perubahan." : "Gagal menambah stage."),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="md">
      <Modal.Header
        onClose={onClose}
        title={isEdit ? "Edit Stage" : "Tambah Stage Baru"}
        subtitle={
          isEdit && stage
            ? `Stage: ${stage.name} (${stage.year})`
            : "Isi data periode penerimaan invoice"
        }
        actions={null}
        children={null}
      />

      <Modal.Body>
        <div className={styles.formGrid}>
          <Input
            label="Nama Stage"
            value={form.name}
            type="text"
            onChange={handleChange("name")}
            placeholder="Contoh: Stage 1, Q1, Periode Januari"
            error={errors.name}
            required
          />

          <Input
            label="Tahun"
            value={form.year}
            type="number"
            onChange={handleChange("year")}
            placeholder="Contoh: 2025"
            error={errors.year}
            required
          />

          <Input
            label="Tanggal Mulai"
            value={form.start_date}
            type="date"
            onChange={handleChange("start_date")}
            error={errors.start_date}
            required
          />
        </div>

        {errors.general && (
          <p className={`${styles.errorText} ${styles.errorGeneral}`}>
            {errors.general}
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          {isEdit ? "Simpan Perubahan" : "Tambah Stage"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StageFormModal;