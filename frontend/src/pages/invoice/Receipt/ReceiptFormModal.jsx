import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Toggle from "../../../components/ui/Toggle";
import styles from "./ReceiptManagement.module.css";

// ─── Konstanta service_type (sesuai backend enum) ─────────────
const SERVICE_TYPES = [
  { value: "", label: "— Pilih Jenis Layanan —" },
  { value: "HF9", label: "HF9 - Barang/Jasa Umum" },
  { value: "HT4", label: "HT4 - Layanan Khusus" },
  { value: "OTHER", label: "Lainnya" },
];

const PPH_TYPES = [
  { value: "21", label: "PPh 21 - Gaji/Upah" },
  { value: "23", label: "PPh 23 - Jasa" },
  { value: "26", label: "PPh 26 - Dividen" },
];

// ─── Receipt Form Modal (Add / Edit) ───────────────────────────
export default function ReceiptFormModal({ receipt, onClose, onSaved, api }) {
  const isEdit = Boolean(receipt);

  const [form, setForm] = useState({
    sap_id: receipt?.sap_id ?? "",
    name: receipt?.name ?? "",
    npwp: receipt?.npwp ?? "",
    address: receipt?.address ?? "",
    service_type: receipt?.service_type ?? "",
    pph_type: receipt?.pph_type ?? "23",
    pph_rate: receipt?.pph_rate ?? "2",
  });

  // ─── Toggle state untuk active/inactive ─────────────────
  const [isActive, setIsActive] = useState(receipt?.deleted_at === null ?? true);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!form.sap_id?.toString().trim()) err.sap_id = "SAP ID wajib diisi.";
    if (!form.name?.trim?.()) err.name = "Nama receipt wajib diisi.";
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
      // ─── Save form data ─────────────────────────────────
      const res = isEdit
        ? await api(`/receipts/${receipt.id}`, {
            method: "PUT",
            body: JSON.stringify(form),
          })
        : await api("/receipts", {
            method: "POST",
            body: JSON.stringify(form),
          });

      // ─── Handle active/inactive toggle ─────────────────
      if (isEdit && receipt.deleted_at === null && !isActive) {
        // User toggle dari aktif ke tidak aktif
        // Call DELETE endpoint untuk soft delete
        await api(`/receipts/${receipt.id}`, { method: "DELETE" });
        res.data.deleted_at = new Date().toISOString();
      } else if (isEdit && receipt.deleted_at !== null && isActive) {
        // User toggle dari tidak aktif ke aktif
        // TODO: Implement restore endpoint (future feature)
        console.warn("Restore belum diimplementasikan");
      }

      onSaved(res.data, isEdit);
    } catch (e) {
      // Handle Laravel validation errors
      if (e.errors && Object.keys(e.errors).length > 0) {
        const formattedErrors = {};
        Object.entries(e.errors).forEach(([field, messages]) => {
          formattedErrors[field] = Array.isArray(messages)
            ? messages[0]
            : messages;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({
          general:
            e.message ||
            (isEdit ? "Gagal menyimpan perubahan." : "Gagal menambah receipt."),
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
        title={isEdit ? `Edit receipt: ${receipt.name}` : "Tambah receipt Baru"}
        subtitle={
          isEdit ? `SAP ID: ${receipt.sap_id}` : "Isi data receipt dengan lengkap"
        }
      />
      <Modal.Body>
        <div className={styles.formGrid}>
          <Input
            label="SAP ID"
            placeholder="contoh: 10001"
            value={form.sap_id}
            onChange={set("sap_id")}
            error={errors.sap_id}
            disabled={isEdit}
            hint={isEdit ? "SAP ID tidak dapat diubah." : ""}
          />
          <Input
            label="Nama receipt"
            placeholder="Nama perusahaan atau perorangan"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
          />
          <Input
            label="NPWP"
            placeholder="12.345.678.9-012.345"
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
            placeholder="2.0"
            value={form.pph_rate}
            onChange={set("pph_rate")}
            error={errors.pph_rate}
            step="0.01"
            min="0"
            max="100"
          />
          <div className={`${styles.formField} ${styles.fullWidth}`}>
            <label className={styles.label}>Alamat</label>
            <textarea
              className={styles.textarea}
              placeholder="Alamat lengkap receipt"
              value={form.address}
              onChange={set("address")}
              rows={3}
            />
          </div>

          {/* ─── Toggle Status (hanya di edit mode) ──────────────────────── */}
          {isEdit && (
            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <Toggle
                value={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                label={isActive ? "receipt Aktif" : "receipt Tidak Aktif"}
                description={
                  isActive
                    ? "receipt dapat dipilih di transaksi baru"
                    : "receipt tidak dapat dipilih di transaksi baru"
                }
                variant={isActive ? "success" : "danger"}
                size="md"
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
          {isEdit ? "Simpan Perubahan" : "Tambah receipt"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
