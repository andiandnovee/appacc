import { FC, useState, useMemo, ChangeEvent } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import styles from "./ReceiptManagement.module.css";

// ======================== TYPES ========================

interface Receipt {
  id: number;
  receipt_date: string;
  vendor_id: number;
  company_id: number;
  stage_id: number;
  year: number;
  po_number: string | null;
  invoice_number: string | null;
  amount: number;
  business_area_id: number | null;
  category: number | null;
  payment_location: number | null;
}

interface ReceiptFormModalProps {
  receipt?: Receipt;
  onClose: () => void;
  onSaved: () => void;
  api?: any;
}

interface FormData {
  receipt_date: string;
  vendor_id: string;
  company_id: string;
  stage_id: string;
  year: number;
  po_number: string;
  invoice_number: string;
  amount: string;
  business_area_id: string;
  category: string;
  payment_location: string;
}

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

interface FetchOptions {
  endpoint: string;
  searchParam?: string;
  filters?: Record<string, any>;
  limit?: number;
}

// ======================== API HELPER ========================

interface ApiError extends Error {
  status?: number;
  data?: any;
}

const enhancedApi = async (path: string, options: RequestInit = {}) => {
  const token =
    localStorage.getItem("appacc_token") ??
    sessionStorage.getItem("appacc_token");
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const method = options.method || "GET";

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers,
  });

  const json = await response.json();

  if (!response.ok) {
    const error = new Error(json.message || "Request failed") as ApiError;
    error.status = response.status;
    error.data = json;
    throw error;
  }

  return json;
};

// ======================== COMPONENT ========================

const ReceiptFormModal: FC<ReceiptFormModalProps> = ({
  receipt,
  onClose,
  onSaved,
}) => {
  const isEdit = Boolean(receipt);
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState<FormData>({
    receipt_date: receipt?.receipt_date ?? "",
    vendor_id: receipt?.vendor_id?.toString() ?? "",
    company_id: receipt?.company_id?.toString() ?? "",
    stage_id: receipt?.stage_id?.toString() ?? "",
    year: receipt?.year ?? currentYear,
    po_number: receipt?.po_number ?? "",
    invoice_number: receipt?.invoice_number ?? "",
    amount: receipt?.amount?.toString() ?? "",
    business_area_id: receipt?.business_area_id?.toString() ?? "",
    category: receipt?.category?.toString() ?? "",
    payment_location: receipt?.payment_location?.toString() ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormData) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Select onChange menerima { target: { value } }
  const handleSelectChange = (field: keyof FormData) => (event: { target: { value: any } }) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const vendorFetchOptions = useMemo<FetchOptions>(
    () => ({
      endpoint: "/vendors",
      searchParam: "search",
      limit: 5,
    }),
    []
  );

  const companyFetchOptions = useMemo<FetchOptions>(
    () => ({
      endpoint: "/companies",
      searchParam: "search",
      limit: 5,
    }),
    []
  );

  const stageFetchOptions = useMemo<FetchOptions>(
    () => ({
      endpoint: "/stages",
      searchParam: "search",
      filters: { year: form.year },
      limit: 5,
    }),
    [form.year]
  );

  const businessAreaFetchOptions = useMemo<FetchOptions>(
    () => ({
      endpoint: "/business-areas",
      searchParam: "search",
      filters: { company_id: form.company_id },
      limit: 5,
    }),
    [form.company_id]
  );

  const validate = (): FormErrors => {
    const err: FormErrors = {};
    if (!form.receipt_date?.trim()) err.receipt_date = "Tanggal receipt wajib diisi.";
    if (!form.vendor_id) err.vendor_id = "Vendor wajib dipilih.";
    if (!form.company_id) err.company_id = "Perusahaan wajib dipilih.";
    if (!form.stage_id) err.stage_id = "Stage wajib dipilih.";
    if (
      !form.amount?.toString().trim() ||
      isNaN(Number(form.amount)) ||
      parseFloat(form.amount) < 0
    ) {
      err.amount = "Jumlah harus berupa angka positif.";
    }
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
        receipt_date: form.receipt_date,
        vendor_id: parseInt(form.vendor_id, 10),
        company_id: parseInt(form.company_id, 10),
        stage_id: parseInt(form.stage_id, 10),
        po_number: form.po_number || null,
        invoice_number: form.invoice_number || null,
        amount: parseFloat(form.amount),
        business_area_id: form.business_area_id ? parseInt(form.business_area_id, 10) : null,
        category: form.category ? parseInt(form.category, 10) : null,
        payment_location: form.payment_location ? parseInt(form.payment_location, 10) : null,
      };

      if (isEdit && receipt) {
        await enhancedApi(`/receipts/${receipt.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await enhancedApi("/receipts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      onSaved();
    } catch (e) {
      const error = e as ApiError;
      if (error.data?.errors && typeof error.data.errors === "object") {
        const formattedErrors: FormErrors = {};
        Object.entries(error.data.errors).forEach(([field, messages]) => {
          formattedErrors[field as keyof FormData] = Array.isArray(messages)
            ? messages[0]
            : (messages as string);
        });
        setErrors(formattedErrors);
      } else {
        setErrors({
          general:
            error.message ||
            (isEdit
              ? "Gagal menyimpan perubahan."
              : "Gagal menambah invoice receipt."),
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
        title={isEdit ? "Edit Invoice Receipt" : "Tambah Invoice Receipt Baru"}
        subtitle={
          isEdit && receipt
            ? `Invoice #${receipt.invoice_number}`
            : "Isi data invoice receipt dengan lengkap"
        }
        actions={null}
        children={null}
      />
      <Modal.Body>
        <div className={styles.formGrid}>
          <Input
            label="Tanggal Receipt"
            type="date"
            value={form.receipt_date}
            onChange={handleInputChange("receipt_date")}
            error={errors.receipt_date}
            required
          />
          <Select
            label="Vendor"
            value={form.vendor_id}
            onChange={handleSelectChange("vendor_id")}
            placeholder="— Pilih Vendor —"
            fetchOptions={vendorFetchOptions}
            error={errors.vendor_id}
            required
          />
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
            label="Tahun"
            type="number"
            value={form.year}
            onChange={handleInputChange("year")}
            error={errors.year}
            hint="Filter untuk Stage"
            min="2000"
            max="2099"
          />
          <Select
            label="Stage"
            value={form.stage_id}
            onChange={handleSelectChange("stage_id")}
            placeholder="— Pilih Stage —"
            fetchOptions={stageFetchOptions}
            error={errors.stage_id}
            required
          />
          <Select
            label="Area Bisnis"
            value={form.business_area_id}
            onChange={handleSelectChange("business_area_id")}
            placeholder="— Pilih Area Bisnis —"
            fetchOptions={businessAreaFetchOptions}
            error={errors.business_area_id}
          />
          <Input
            label="PO Number"
            placeholder="contoh: PO-2026-001"
            value={form.po_number}
            onChange={handleInputChange("po_number")}
            error={errors.po_number}
          />
          <Input
            label="Invoice Number"
            placeholder="contoh: INV-2026-001"
            value={form.invoice_number}
            onChange={handleInputChange("invoice_number")}
            error={errors.invoice_number}
          />
          <Input
            label="Jumlah"
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={handleInputChange("amount")}
            error={errors.amount}
            required
            step="0.01"
            min="0"
          />
          <Input
            label="Kategori"
            type="number"
            placeholder="0"
            value={form.category}
            onChange={handleInputChange("category")}
            error={errors.category}
          />
          <Input
            label="Lokasi Pembayaran"
            type="number"
            placeholder="0"
            value={form.payment_location}
            onChange={handleInputChange("payment_location")}
            error={errors.payment_location}
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
          {isEdit ? "Simpan Perubahan" : "Tambah Receipt"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReceiptFormModal;