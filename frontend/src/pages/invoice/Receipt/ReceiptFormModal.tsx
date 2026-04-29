import { FC, useState, useMemo, useCallback, ChangeEvent, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import styles from "./ReceiptManagement.module.css";
import api from "../../../api/axios";
import { useFilterStore } from '../../../stores/filterReceipt';

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
  business_area_code: string | null;
  pgr_id: string | null;  // ← string bukan number
}

interface ReceiptFormModalProps {
  receipt?: Receipt | null;
  onClose: () => void;
  onSaved: () => void;
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
  business_area_code: string;
  buyer_name: string;
  pgr_id: string;
}

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

// ======================== HELPERS ========================

const today = () => new Date().toISOString().split("T")[0];

// ======================== COMPONENT ========================

const ReceiptFormModal: FC<ReceiptFormModalProps> = ({ receipt, onClose, onSaved }) => {
  const isEdit = Boolean(receipt?.id);
  const currentYear = new Date().getFullYear();

  const { selectedStage, selectedYear, setSelectedStage, setSelectedYear } = useFilterStore();

  const [form, setForm] = useState<FormData>({
    receipt_date:       receipt?.receipt_date          ?? today(),
    vendor_id:          receipt?.vendor_id?.toString() ?? "",
    company_id:         receipt?.company_id?.toString() ?? "",
    stage_id:           receipt?.stage_id?.toString()  ?? selectedStage ?? "",
    year:               receipt?.year                  ?? (selectedYear ? parseInt(selectedYear) : currentYear),
    po_number:          receipt?.po_number             ?? "",
    invoice_number:     receipt?.invoice_number        ?? "",
    amount:             receipt?.amount?.toString()    ?? "",
    business_area_code: receipt?.business_area_code    ?? "",
    buyer_name:         "",
    pgr_id:             receipt?.pgr_id                ?? "",
  });

  const [loading, setLoading]       = useState(false);
  const [poLooking, setPoLooking]   = useState(false);
  const [poFound, setPoFound]       = useState<boolean | null>(null);
  const [autoFilled, setAutoFilled] = useState<Set<keyof FormData>>(new Set());
  const [errors, setErrors]         = useState<FormErrors>({});
  const [ppnEnabled, setPpnEnabled] = useState(false);
const [ppnRate, setPpnRate]       = useState(11);

// ── kalkulasi PPN ──────────────────────────────────────
const [baseAmount, setBaseAmount] = useState<string>("");  // net_value asli dari SAP

useEffect(() => {
  if (!baseAmount) return;
  const base = parseFloat(baseAmount);
  if (isNaN(base)) return;

  if (ppnEnabled) {
    const total = base + (base * ppnRate / 100);
    setForm((prev) => ({ ...prev, amount: total.toFixed(0) }));
  } else {
    setForm((prev) => ({ ...prev, amount: baseAmount }));
  }
}, [ppnEnabled, ppnRate, baseAmount]);

  // ── saat edit: lookup buyer name dari pgr_id ke pr_group_tabel ──
  useEffect(() => {
    if (!isEdit || !form.pgr_id) return;

    const lookupPgr = async () => {
      try {
        const res     = await api.get(`/pgr`, { params: { search: form.pgr_id } });
        const list    = res.data?.data ?? res.data ?? [];
        const matched = Array.isArray(list)
          ? list.find((p: any) => p.PGr === form.pgr_id)
          : null;

        if (matched?.Description) {
          setForm((prev) => ({
            ...prev,
            pgr_id: `${matched.PGr} — ${matched.Description}`,
          }));
        }
      } catch {
        // gagal lookup — tampilkan kode saja
      }
    };

    lookupPgr();
  }, []); // hanya saat mount

  // ── field change handlers ──────────────────────────────
  const handleInputChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (field === "po_number") {
      setPoFound(null);
      setAutoFilled(new Set());
      setBaseAmount("");             // ← reset
  setPpnEnabled(false);        
      setForm((prev) => ({
        ...prev,
        po_number:          value,
        buyer_name:         "",
        company_id:         "",
        business_area_code: "",
        pgr_id:             "",
      }));
      return;
    }

    if (field === "year") {
      setSelectedYear(value);
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof FormData) => (e: { target: { value: any } }) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "stage_id") {
      setSelectedStage(value);
    }
  };

  // ── PO Lookup saat blur ────────────────────────────────
  const handlePoBlur = useCallback(async () => {
    const poNumber = form.po_number.trim();
    if (!poNumber) return;

    setPoLooking(true);
    setPoFound(null);

    try {
      const res  = await api.get(`/sap/po-lookup`, { params: { po_number: poNumber } });
      const data = res.data;

      if (data.found) {
        const filled = new Set<keyof FormData>();
        const next: FormData = { ...form };

        if (data.vendor_id && !form.vendor_id) {
          next.vendor_id = data.vendor_id.toString();
          filled.add("vendor_id");
        }
        if (data.amount !== undefined) {
  const amountStr = data.amount.toString();
  setBaseAmount(amountStr);      // ← simpan base
  next.amount = amountStr;       // ← set ke form (belum kena PPN)
  filled.add("amount");
}
        if (data.sap_business_area_id) {
          next.business_area_code = data.sap_business_area_id;
          filled.add("business_area_code");
        }

        // ── pgr_id: gabungkan purc_grp + buyer_name ──
        if (data.purc_grp) {
          next.pgr_id = data.buyer_name
            ? `${data.purc_grp} — ${data.buyer_name}`
            : data.purc_grp;
          filled.add("pgr_id");
        }



        setForm(next);

        // ── lookup company_id dari business_area ──
        if (data.sap_business_area_id) {
          try {
            const baRes  = await api.get(`/busa`, { params: { search: data.sap_business_area_id } });
            const baList = baRes.data?.data ?? baRes.data ?? [];
            const ba     = Array.isArray(baList)
              ? baList.find((b: any) => b.sap_id === data.sap_business_area_id)
              : null;

            if (ba?.company_id) {
              setForm((prev) => ({ ...prev, company_id: ba.company_id.toString() }));
              filled.add("company_id");
            }
          } catch {
            // gagal lookup BA — biarkan company_id kosong
          }
        }

        setAutoFilled(new Set(filled));
        setPoFound(true);
      } else {
        setPoFound(false);
      }
    } catch {
      setPoFound(false);
    } finally {
      setPoLooking(false);
    }
  }, [form.po_number]);

  // ── fetch options ──────────────────────────────────────
  const vendorFetchOptions  = useMemo(() => ({ endpoint: "/vendors",   searchParam: "search", limit: 5 }), []);
  const companyFetchOptions = useMemo(() => ({ endpoint: "/companies", searchParam: "search", limit: 5 }), []);
  const stageFetchOptions   = useMemo(() => ({ endpoint: "/stages",    searchParam: "search", filters: { year: form.year }, limit: 5 }), [form.year]);

  // ── validate ───────────────────────────────────────────
  const validate = (): FormErrors => {
    const err: FormErrors = {};
    if (!form.receipt_date?.trim()) err.receipt_date = "Tanggal receipt wajib diisi.";
    if (!form.vendor_id)            err.vendor_id    = "Vendor wajib dipilih.";
    if (!form.company_id)           err.company_id   = "Perusahaan wajib dipilih.";
    if (!form.stage_id)             err.stage_id     = "Stage wajib dipilih.";
    if (!form.amount?.trim() || isNaN(Number(form.amount)) || parseFloat(form.amount) < 0)
      err.amount = "Jumlah harus berupa angka positif.";
    return err;
  };

  // ── submit ─────────────────────────────────────────────
  const handleSave = async () => {
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        receipt_date:       form.receipt_date,
        vendor_id:          parseInt(form.vendor_id, 10),
        company_id:         parseInt(form.company_id, 10),
        stage_id:           parseInt(form.stage_id, 10),
        po_number:          form.po_number          || null,
        invoice_number:     form.invoice_number     || null,
        amount:             parseFloat(form.amount),
        business_area_code: form.business_area_code || null,
        // ← ambil hanya kode sebelum " — "
        pgr_id:             form.pgr_id ? form.pgr_id.split(" — ")[0].trim() || null : null,
      };

      if (isEdit && receipt) {
        await api.put(`/receipts/${receipt.id}`, payload);
      } else {
        await api.post("/receipts", payload);
      }

      onSaved();
    } catch (e: any) {
      const responseData = e?.response?.data;
      if (responseData?.errors && typeof responseData.errors === "object") {
        const formattedErrors: FormErrors = {};
        Object.entries(responseData.errors).forEach(([field, messages]) => {
          formattedErrors[field as keyof FormData] = Array.isArray(messages) ? messages[0] : (messages as string);
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ general: responseData?.message || (isEdit ? "Gagal menyimpan perubahan." : "Gagal menambah invoice receipt.") });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── render ─────────────────────────────────────────────
  return (
    <Modal isOpen onClose={onClose} size="lg">
      <Modal.Header
        onClose={onClose}
        title={isEdit ? "Edit Invoice Receipt" : "Tambah Invoice Receipt Baru"}
        subtitle={isEdit && receipt ? `Invoice #${receipt.invoice_number}` : "Isi data invoice receipt dengan lengkap"}
        actions={null}
        children={null}
      />
      <Modal.Body>
        <div className={styles.formGrid}>

          {/* PO Number dengan lookup */}
          <div className={styles.poField}>
            <Input
              label="PO Number"
              placeholder="contoh: 4506911487"
              value={form.po_number}
              onChange={handleInputChange("po_number")}
              onBlur={handlePoBlur}
              error={errors.po_number}
              hint={
                poLooking         ? "Mencari data SAP..."                          :
                poFound === true  ? "✓ Data ditemukan di SAP PO Import"            :
                poFound === false ? "Data tidak ditemukan di SAP"                  :
                                    "Isi lalu pindah fokus untuk auto-fill dari SAP"
              }
            />
            {poFound && autoFilled.size > 0 && (
              <span className={styles.sapBadge}>Data dari SAP</span>
            )}
          </div>

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
            disabled={autoFilled.has("vendor_id")}
          />

          <Select
            label="Perusahaan"
            value={form.company_id}
            onChange={handleSelectChange("company_id")}
            placeholder="— Pilih Perusahaan —"
            fetchOptions={companyFetchOptions}
            error={errors.company_id}
            required
            disabled={autoFilled.has("company_id")}
            hint={autoFilled.has("company_id") ? "Dari SAP" : undefined}
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
            label="Periode"
            value={form.stage_id}
            onChange={handleSelectChange("stage_id")}
            placeholder="— Pilih Periode —"
            fetchOptions={stageFetchOptions}
            error={errors.stage_id}
            required
          />

          <Input
            label="Area Bisnis"
            placeholder="contoh: BA001"
            value={form.business_area_code}
            onChange={handleInputChange("business_area_code")}
            error={errors.business_area_code}
            disabled={autoFilled.has("business_area_code")}
            hint={autoFilled.has("business_area_code") ? "Dari SAP" : undefined}
          />

          <Input
            label="Invoice Number"
            placeholder="contoh: INV-2026-001"
            value={form.invoice_number}
            onChange={handleInputChange("invoice_number")}
            error={errors.invoice_number}
          />

          <Input
  label="Jumlah (Net Value)"
  type="number"
  placeholder="0"
  value={form.amount}
  onChange={handleInputChange("amount")}
  error={errors.amount}
  required
  step="0.01"
  min="0"
  disabled={autoFilled.has("amount")}
  hint={autoFilled.has("amount") ? "Dari SAP" : undefined}
/>

{/* PPN toggle — hanya muncul jika amount dari SAP */}
{autoFilled.has("amount") && (
  <div className={styles.ppnWrapper}>
    <label className={styles.ppnToggleLabel}>
      <input
        type="checkbox"
        checked={ppnEnabled}
        onChange={(e) => setPpnEnabled(e.target.checked)}
        className={styles.ppnCheckbox}
      />
      <span>Tambah PPN</span>
    </label>

    {ppnEnabled && (
      <div className={styles.ppnDetail}>
        <div className={styles.ppnRateRow}>
          <span>Tarif PPN</span>
          <div className={styles.ppnRateInput}>
            <input
              type="number"
              value={ppnRate}
              onChange={(e) => setPpnRate(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.1"
              className={styles.ppnRateField}
            />
            <span>%</span>
          </div>
        </div>
        <div className={styles.ppnBreakdown}>
          <span className={styles.ppnBreakdownRow}>
            <span>Net Value</span>
            <span>Rp {parseFloat(baseAmount || "0").toLocaleString("id-ID")}</span>
          </span>
          <span className={styles.ppnBreakdownRow}>
            <span>PPN {ppnRate}%</span>
            <span>Rp {(parseFloat(baseAmount || "0") * ppnRate / 100).toLocaleString("id-ID")}</span>
          </span>
          <span className={`${styles.ppnBreakdownRow} ${styles.ppnTotal}`}>
            <span>Total</span>
            <span>Rp {parseFloat(form.amount || "0").toLocaleString("id-ID")}</span>
          </span>
        </div>
      </div>
    )}
  </div>
)}

          {/* Purchasing Group — gabungan purc_grp + buyer_name */}
          <Input
            label="Purchasing Group"
            placeholder="Otomatis dari PO SAP"
            value={form.pgr_id}
            onChange={handleInputChange("pgr_id")}
            error={errors.pgr_id}
            disabled={autoFilled.has("pgr_id") || isEdit}
            hint={
              autoFilled.has("pgr_id") ? "Dari SAP" :
              isEdit                   ? "Dari data tersimpan" :
                                         "Isi PO Number untuk auto-fill"
            }
          />

        </div>

        {errors.general && (
          <p className={`${styles.errorText} ${styles.errorGeneral}`}>{errors.general}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose} disabled={loading}>Batal</Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          {isEdit ? "Simpan Perubahan" : "Tambah Receipt"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReceiptFormModal;