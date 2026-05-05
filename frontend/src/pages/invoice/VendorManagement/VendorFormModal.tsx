import { FC, useState, ChangeEvent } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Toggle from "../../../components/ui/Toggle";
import styles from "./VendorManagement.module.css";

// 1. Definisikan struktur data form
interface VendorFormData {
  sap_id: string | number;
  name: string;
  npwp: string;
  address: string;
  service_type: string;
  pph_type: string;
  pph_rate: string | number;
  is_pkp: boolean;
}

// 2. Definisikan struktur error (opsional: record string agar fleksibel)
interface FormErrors {
  sap_id?: string;
  name?: string;
  npwp?: string;
  service_type?: string;
  pph_type?: string;
  pph_rate?: string;
  general?: string;

  [key: string]: string | undefined; // Index signature untuk akses dinamis
}

interface VendorFormModalProps {
  vendor?: any;
  onClose: () => void; // Sebaiknya gunakan tipe fungsi yang jelas
  onSaved: (data: any, isEdit: boolean) => void;
  api: any;
}

const SERVICE_TYPES = [
  { value: "", label: "— Pilih Jenis Layanan —" },
  { value: "Jasa Service", label: "Jasa Service" },
  { value: "Jasa Kalibrasi", label: "Jasa Kalibrasi" },
  { value: "HF9", label: "HF9 - Barang/Jasa Umum" },
  { value: "HT4", label: "HT4 - Layanan Khusus" },
  { value: "Barang/Jasa Umum", label: "Barang/Jasa Umum" },
  { value: "OTHER", label: "Lainnya" },
];

const PPH_TYPES = [
  { value: "21", label: "PPh 21 - Gaji/Upah" },
  { value: "23", label: "PPh 23 - Jasa" },
  { value: "26", label: "PPh 26 - Dividen" },
];

const VendorFormModal: FC<VendorFormModalProps> = ({
  vendor,
  onClose,
  onSaved,
  api,
}) => {
  const isEdit = Boolean(vendor);

  // Gunakan Generic <VendorFormData>
  const [form, setForm] = useState<VendorFormData>({
    sap_id: vendor?.sap_id ?? "",
    name: vendor?.name ?? "",
    npwp: vendor?.npwp ?? "",
    address: vendor?.address ?? "",
    service_type: vendor?.service_type ?? "",
    pph_type: vendor?.pph_type ?? "23",
    pph_rate: vendor?.pph_rate ?? "2",
    is_pkp: vendor?.is_pkp ?? false,
  });

  const [isActive, setIsActive] = useState(
    vendor ? vendor.deleted_at === null : true,
  );

  //const [isPkp, setIsPkp] = useState(vendor ? vendor.is_pkp : false);

  const [loading, setLoading] = useState(false);

  // Gunakan Generic <FormErrors>
  const [errors, setErrors] = useState<FormErrors>({});

  // Tambahkan tipe pada parameter field dan event
  const set =
    (field: keyof VendorFormData) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const err: FormErrors = {};
    if (!form.sap_id?.toString().trim()) err.sap_id = "SAP ID wajib diisi.";
    if (!form.name?.trim?.()) err.name = "Nama vendor wajib diisi.";
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
      const res = isEdit
        ? await api.put(`/vendors/${vendor.id}`, form)
        : await api.post("/vendors", form);

      if (isEdit && vendor.deleted_at === null && !isActive) {
        await api.delete(`/vendors/${vendor.id}`);
        res.data.deleted_at = new Date().toISOString();
      }

      onSaved(res.data, isEdit);
    } catch (e: any) {
      if (e.errors && Object.keys(e.errors).length > 0) {
        const formattedErrors: FormErrors = {};
        Object.entries(e.errors).forEach(([field, messages]) => {
          formattedErrors[field] = Array.isArray(messages)
            ? messages[0]
            : (messages as string);
        });
        setErrors(formattedErrors);
      } else {
        setErrors({
          general:
            e.message ||
            (isEdit ? "Gagal menyimpan perubahan." : "Gagal menambah vendor."),
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
        title={isEdit ? `Edit Vendor: ${vendor.name}` : "Tambah Vendor Baru"}
        subtitle={
          isEdit ? `SAP ID: ${vendor.sap_id}` : "Isi data vendor dengan lengkap"
        }
        // Tambahkan properti actions dan children jika dibutuhkan oleh komponen Modal Anda
        actions={null}
      >
        {null}
      </Modal.Header>
      <Modal.Body>
        <div className={styles.formGrid}>
          <Input
            label="SAP ID"
            value={form.sap_id}
            onChange={set("sap_id")}
            error={errors.sap_id}
            disabled={isEdit}
            hint={isEdit ? "SAP ID tidak dapat diubah." : ""}
          />
          <Input
            label="Nama Vendor"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
          />
          <Input
            label="NPWP"
            value={form.npwp}
            onChange={set("npwp")}
            error={errors.npwp}
          />
          <Select
            label="Jenis Layanan"
            value={form.service_type}
            onChange={set("service_type")}
            options={SERVICE_TYPES}
            error={errors.service_type}
          />
          <Select
            label="Tipe PPh"
            value={form.pph_type}
            onChange={set("pph_type")}
            options={PPH_TYPES}
            error={errors.pph_type}
          />
          <Input
            label="Tarif PPh (%)"
            type="number"
            value={form.pph_rate}
            onChange={set("pph_rate")}
            error={errors.pph_rate}
          />
          <div className={`${styles.formField} ${styles.fullWidth}`}>
            <label className={styles.label}>Alamat</label>
            <textarea
              className={styles.textarea}
              value={form.address}
              onChange={set("address")}
              rows={3}
            />
          </div>
          {isEdit && (
            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <Toggle
                value={form.is_pkp}
                onChange={(e) => setForm({ ...form, is_pkp: e.target.checked })}
                label={form.is_pkp ? "Vendor PKP/Faktur pajak" : "Vendor Bukan PKP"}
                variant={form.is_pkp ? "success" : "danger"}
              />
            </div>
          )}

          {isEdit && (
            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <Toggle
                value={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                label={isActive ? "Vendor Aktif" : "Vendor Tidak Aktif"}
                variant={isActive ? "success" : "danger"}
              />
            </div>
          )}
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
          {isEdit ? "Simpan Perubahan" : "Tambah Vendor"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VendorFormModal;
