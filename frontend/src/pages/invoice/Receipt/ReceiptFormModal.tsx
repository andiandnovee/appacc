import { FC, ReactNode, ReactElement, useState, useMemo } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import styles from "./ReceiptManagement.module.css";

interface ReceiptFormModalProps {
  receipt?: any;
  onClose?: any;
  onSaved?: any;
  api?: any;
}


// Enhanced API wrapper for better error handling
const enhancedApi = (path, options = {}) => {
  const token =
    localStorage.getItem("appacc_token") ??
    sessionStorage.getItem("appacc_token");
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const method = options.method || "GET";

  // Only add Content-Type for requests with body
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${apiBase}${path}`, {
    ...options,
    headers,
  }).then((r) =>
    r.json().then((json) => {
      if (!r.ok) {
        const error = new Error(json.message || "Request failed");
        error.status = r.status;
        error.data = json;
        throw error;
      }
      return json;
    }),
  );
};

const ReceiptFormModal: FC<ReceiptFormModalProps> = ({
  receipt,
  onClose,
  onSaved,
  api,
}) => {
  const isEdit = Boolean(receipt);
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    receipt_date: receipt?.receipt_date ?? "",
    vendor_id: receipt?.vendor_id ?? "",
    company_id: receipt?.company_id ?? "",
    stage_id: receipt?.stage_id ?? "",
    year: receipt?.year ?? currentYear,
    po_number: receipt?.po_number ?? "",
    invoice_number: receipt?.invoice_number ?? "",
    amount: receipt?.amount ?? "",
    business_area_id: receipt?.business_area_id ?? "",
    category: receipt?.category ?? "",
    payment_location: receipt?.payment_location ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Memoize fetchOptions to prevent infinite dependency loops
  const vendorFetchOptions = useMemo(
    () => ({
      endpoint: "/vendors",
      searchParam: "search",
      limit: 5,
    }),
    [],
  );

  const companyFetchOptions = useMemo(
    () => ({
      endpoint: "/companies",
      searchParam: "search",
      limit: 5,
    }),
    [],
  );

  const stageFetchOptions = useMemo(
    () => ({
      endpoint: "/stages",
      searchParam: "search",
      filters: { year: form.year },
      limit: 5,
    }),
    [form.year],
  );

  const businessAreaFetchOptions = useMemo(
    () => ({
      endpoint: "/business-areas",
      searchParam: "search",
      filters: { company_id: form.company_id },
      limit: 5,
    }),
    [form.company_id],
  );

  const validate = () => {
    const err = {};
    if (!form.receipt_date?.trim())
      err.receipt_date = "Tanggal receipt wajib diisi.";
    if (!form.vendor_id) err.vendor_id = "Vendor wajib dipilih.";
    if (!form.company_id) err.company_id = "Perusahaan wajib dipilih.";
    if (!form.stage_id) err.stage_id = "Stage wajib dipilih.";
    if (
      !form.amount?.toString().trim() ||
      isNaN(form.amount) ||
      parseFloat(form.amount) < 0
    )
      err.amount = "Jumlah harus berupa angka positif.";
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
        vendor_id: parseInt(form.vendor_id),
        company_id: parseInt(form.company_id),
        stage_id: parseInt(form.stage_id),
        po_number: form.po_number || null,
        invoice_number: form.invoice_number || null,
        amount: parseFloat(form.amount),
        business_area_id: form.business_area_id
          ? parseInt(form.business_area_id)
          : null,
        category: form.category ? parseInt(form.category) : null,
        payment_location: form.payment_location
          ? parseInt(form.payment_location)
          : null,
      };

      await enhancedApi(isEdit ? `/receipts/${receipt.id}` : "/receipts", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      onSaved();
    } catch (e) {
      // Handle Laravel validation errors
      if (e.data?.errors && typeof e.data.errors === "object") {
        const formattedErrors = {};
        Object.entries(e.data.errors).forEach(([field, messages]) => {
          formattedErrors[field] = Array.isArray(messages)
            ? messages[0]
            : messages;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({
          general:
            e.message ||
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
        title={isEdit ? `Edit Invoice Receipt` : "Tambah Invoice Receipt Baru"}
        subtitle={
          isEdit
            ? `Invoice #${receipt.invoice_number}`
            : "Isi data invoice receipt dengan lengkap"
        }
      />
      <Modal.Body>
        <div className={styles.formGrid}>
          <Input
            label="Tanggal Receipt"
            type="date"
            value={form.receipt_date}
            onChange={set("receipt_date")}
            error={errors.receipt_date}
            required
          />
          <Select
            label="Vendor"
            value={form.vendor_id}
            onChange={set("vendor_id")}
            placeholder="— Pilih Vendor —"
            fetchOptions={vendorFetchOptions}
            error={errors.vendor_id}
            required
          />
          <Select
            label="Perusahaan"
            value={form.company_id}
            onChange={set("company_id")}
            placeholder="— Pilih Perusahaan —"
            fetchOptions={companyFetchOptions}
            error={errors.company_id}
            required
          />
          <Input
            label="Tahun"
            type="number"
            value={form.year}
            onChange={set("year")}
            error={errors.year}
            hint="Filter untuk Stage"
            min="2000"
            max="2099"
          />
          <Select
            label="Stage"
            value={form.stage_id}
            onChange={set("stage_id")}
            placeholder="— Pilih Stage —"
            fetchOptions={stageFetchOptions}
            error={errors.stage_id}
            required
          />
          <Select
            label="Area Bisnis"
            value={form.business_area_id}
            onChange={set("business_area_id")}
            placeholder="— Pilih Area Bisnis —"
            fetchOptions={businessAreaFetchOptions}
            error={errors.business_area_id}
          />
          <Input
            label="PO Number"
            placeholder="contoh: PO-2026-001"
            value={form.po_number}
            onChange={set("po_number")}
            error={errors.po_number}
          />
          <Input
            label="Invoice Number"
            placeholder="contoh: INV-2026-001"
            value={form.invoice_number}
            onChange={set("invoice_number")}
            error={errors.invoice_number}
          />
          <Input
            label="Jumlah"
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={set("amount")}
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
            onChange={set("category")}
            error={errors.category}
          />
          <Input
            label="Lokasi Pembayaran"
            type="number"
            placeholder="0"
            value={form.payment_location}
            onChange={set("payment_location")}
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
