import { FC, useState, useMemo, ChangeEvent } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import styles from "./BusAreas.module.css";
import api from "../../../api/axios"; // ← ganti ke import api

// ======================== TYPES ========================

interface BusA {
  id: number;
  sap_id: string;
  company_id: string;
  name: string;
  name_long: string;
  sap_customer_code: string | null;
  sap_vendor_code: string | null;
}

interface BusAreaFormModalProps {
  busArea?: BusA;
  onClose: () => void;
  onSaved: () => void;
}

interface FormData {
  id: number;
  sap_id: string;
  company_id: string;
  name: string;
  name_long: string;
  sap_customer_code: string;
  sap_vendor_code: string;
}

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

interface FetchOptions {
  endpoint: string;
  searchParam?: string;
  filters?: Record<string, any>;
  limit?: number;
}

// ======================== COMPONENT ========================

const BusAreaFormModal: FC<BusAreaFormModalProps> = ({
  busArea,
  onClose,
  onSaved,
}) => {
  const isEdit = Boolean(busArea);

  const [form, setForm] = useState<FormData>({
  id: busArea?.id ?? 0,
  sap_id: busArea?.sap_id.toString() ?? "",
  company_id: busArea?.company_id != null ? String(busArea.company_id) : "",
  name: busArea?.name != null ? String(busArea.name) : "",
  name_long: busArea?.name_long != null ? String(busArea.name_long) : "",
  sap_vendor_code: busArea?.sap_vendor_code != null ? String(busArea.sap_vendor_code) : "",
  sap_customer_code: busArea?.sap_customer_code != null ? String(busArea.sap_customer_code) : "",
});

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange =
    (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSelectChange =
    (field: keyof FormData) =>
    (event: { target: { value: any } }) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const companyFetchOptions = useMemo<FetchOptions>(
    () => ({ endpoint: "/companies", searchParam: "search", limit: 5 }),
    []
  );

  const validate = (): FormErrors => {
    const err: FormErrors = {};
    if (!form.sap_id) err.sap_id = "SAP ID wajib diisi.";
    if (!form.name?.trim()) err.name = "Nama wajib diisi.";
    if (!form.name_long?.trim()) err.name_long = "Deskripsi wajib diisi.";
    if (!form.company_id) err.company_id = "Perusahaan wajib dipilih.";
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
        sap_id: form.sap_id || null,
        name: form.name.substring(0, 25) || null,
        name_long: form.name_long.substring(0, 50) || null,
        company_id: form.company_id || null,
        sap_customer_code: form.sap_customer_code || null,
        sap_vendor_code: form.sap_vendor_code || null,
      };

      // ← TAMBAH INI
      console.log("=== DEBUG SAVE ===");
      console.log("isEdit:", isEdit);
      console.log("busArea prop:", busArea);
      console.log("payload:", payload);
      // ← SAMPAI SINI

      if (isEdit && busArea) {
        const res = await api.put(`/busa/${busArea.id}`, payload);
        console.log("PUT response:", res.data); // ← dan ini
      } else {
        const res = await api.post("/busa", payload);
        console.log("POST response:", res.data); // ← dan ini
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
            (isEdit
              ? "Gagal menyimpan perubahan."
              : "Gagal menambah Business Area."),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="lg">
      <Modal.Header
        onClose={onClose}
        title={isEdit ? "Edit Business Area" : "Tambah Business Area Baru"}
        subtitle={
          isEdit && busArea
            ? `Business Area: ${busArea.name}`
            : "Isi data business area dengan lengkap"
        }
        actions={null}
        children={null}
      />
      <Modal.Body>
        <div className={styles.formGrid}>
          <Select
            label="Perusahaan"
            value={form.company_id}
            onChange={handleSelectChange("company_id")}
            placeholder="— Pilih Perusahaan —"
            fetchOptions={companyFetchOptions}
            error={errors.company_id}
            required
          />

          <Input
            label="SAP ID"
            type="number"
            value={form.sap_id}
            onChange={handleInputChange("sap_id")}
            error={errors.sap_id}
            required
          />

          <Input
            label="Bus Area"
            value={form.name}
            type="text"
            onChange={handleInputChange("name")}
            placeholder="— Business Area —"
            error={errors.name}
            required
          />

          <Input
            label="Deskripsi"
            value={form.name_long}
            type="text"
            onChange={handleInputChange("name_long")}
            placeholder="— Deskripsi —"
            error={errors.name_long}
            required
          />

          <Input
            label="Customer Code"
            value={form.sap_customer_code}
            type="text"
            onChange={handleInputChange("sap_customer_code")}
            placeholder="— Customer Code —"
            error={errors.sap_customer_code}
          />

          <Input
            label="Vendor Code"
            value={form.sap_vendor_code}
            type="text"
            onChange={handleInputChange("sap_vendor_code")}
            placeholder="— Vendor Code —"
            error={errors.sap_vendor_code}
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
          {isEdit ? "Simpan Perubahan" : "Tambah Business Area"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BusAreaFormModal;