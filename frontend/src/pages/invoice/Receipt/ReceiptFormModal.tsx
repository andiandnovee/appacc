import {
  FC,
  useState,
  useMemo,
  useCallback,
  ChangeEvent,
  useEffect,
  useRef,
} from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import styles from "./ReceiptManagement.module.css";
import api from "../../../api/axios";
import { useFilterStore } from "../../../stores/filterReceipt";
import Badge from "../../../components/ui/Badge";

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
  pgr_id: string | null;
  is_pkp: boolean;
}

interface ReceiptFormModalProps {
  receipt?: Receipt | null;
  onCancel: () => void;
  onSaved: () => void;
  onSavedAndNew: () => void;
  onPoAlreadyExists?: (poNumber: string) => void; // ← callback ke parent
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
  is_pkp: boolean;
}

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

const PPN_RATE = 11;
const today = () => new Date().toISOString().split("T")[0];

const makeInitialForm = (
  receipt?: Receipt | null,
  selectedStage?: string,
  selectedYear?: string,
  receiptDate?: string,
): FormData => ({
  receipt_date: receipt?.receipt_date ?? receiptDate ?? today(),
  vendor_id: receipt?.vendor_id?.toString() ?? "",
  company_id: receipt?.company_id?.toString() ?? "",
  stage_id: receipt?.stage_id?.toString() ?? selectedStage ?? "",

  year:
    receipt?.year ??
    (selectedYear ? parseInt(selectedYear) : new Date().getFullYear()),
  po_number: receipt?.po_number ?? "",
  invoice_number: receipt?.invoice_number ?? "",
  amount: receipt?.amount?.toString() ?? "",
  business_area_code: receipt?.business_area_code ?? "",
  buyer_name: "",
  pgr_id: receipt?.pgr_id ?? "",
  is_pkp: receipt?.is_pkp ?? false,
});

// ======================== COMPONENT ========================

const ReceiptFormModal: FC<ReceiptFormModalProps> = ({
  receipt,
  onCancel,
  onSaved,
  onSavedAndNew,
  onPoAlreadyExists,
}) => {
  const isEdit = Boolean(receipt?.id);
  const {
    selectedStage,
    selectedYear,
    receiptDate,
    setSelectedStage,
    setSelectedYear,
    setReceiptDate,
  } = useFilterStore();

  const [form, setForm] = useState<FormData>(() =>
    makeInitialForm(receipt, selectedStage, selectedYear, receiptDate),
  );

  const poInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<FormData>(form);

  const [loading, setLoading] = useState(false);
  const [poLooking, setPoLooking] = useState(false);
  const [poFound, setPoFound] = useState<boolean | null>(null);
  const [poDuplicate, setPoDuplicate] = useState(false); // ← PO sudah pernah diinput
  const [autoFilled, setAutoFilled] = useState<Set<keyof FormData>>(new Set());
  const [errors, setErrors] = useState<FormErrors>({});

  // ── PPN state ──────────────────────────────────────────────────────────────
  const [ppnEnabled, setPpnEnabled] = useState(false);

  const [baseAmount, setBaseAmount] = useState<string>("");
  const [amountRaw, setAmountRaw] = useState<number>(receipt?.amount ?? 0);
  const [amountDisplay, setAmountDisplay] = useState<string>(
    receipt?.amount?.toString() ?? "",
  );

  // ── Sync formRef ───────────────────────────────────────────────────────────
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  // ── Reset saat receipt prop berubah ───────────────────────────────────────
  useEffect(() => {
    setForm(makeInitialForm(receipt, selectedStage, selectedYear,receiptDate));
    setAmountRaw(receipt?.amount ?? 0);
    setAmountDisplay(receipt?.amount?.toString() ?? "");
    setBaseAmount("");
    setPoFound(null);
    setPoDuplicate(false);
    setAutoFilled(new Set());
    setPpnEnabled(false);

    setErrors({});
  }, [receipt]);

  // ── PPN: aktifkan setelah baseAmount siap ─────────────────────────────────

  // ── PPN: hitung total saat ppnEnabled atau baseAmount berubah ─────────────
  useEffect(() => {
    if (!baseAmount) return;
    const base = parseFloat(baseAmount);
    if (isNaN(base)) return;

    const total = ppnEnabled
      ? Math.round(base + (base * PPN_RATE) / 100)
      : Math.round(base);

    setAmountRaw(total);
    setForm((prev) => ({ ...prev, amount: String(total) }));
    setAmountDisplay(String(total));
  }, [ppnEnabled, baseAmount]);

  // ── Edit mode: lookup buyer name dari pgr_id ──────────────────────────────
  useEffect(() => {
    if (!isEdit || !form.pgr_id) return;
    const lookupPgr = async () => {
      try {
        const res = await api.get(`/pgr`, { params: { search: form.pgr_id } });
        const list = res.data?.data ?? res.data ?? [];
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

  // ── Ctrl+S ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        await handleSave(true);
        poInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [amountRaw, form]);

  // ── Field handlers ─────────────────────────────────────────────────────────
  const handleInputChange =
    (field: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;

        if (field === "receipt_date") {
      setReceiptDate(value);   // ← persist ke store
    }

      if (field === "po_number") {
        if (!isEdit) {
          setPoFound(null);
          setPoDuplicate(false);
          setAutoFilled(new Set());
          setBaseAmount("");
          setPpnEnabled(false);
          setAmountRaw(0);
          setAmountDisplay("");
          setForm((prev) => ({
            ...prev,
            po_number: value,
            amount: "",
            buyer_name: "",
            company_id: "",
            business_area_code: "",
            pgr_id: "",
            is_pkp: false,
          }));
        } else {
          setForm((prev) => ({ ...prev, po_number: value }));
        }
        return;
      }

      if (field === "year") setSelectedYear(value);
      setForm((prev) => ({ ...prev, [field]: value }));
    }; // ← INI YANG HILANG

  const handleSelectChange =
    (field: keyof FormData) => (e: { target: { value: any } }) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (field === "stage_id") setSelectedStage(value);
    };

  // ── Handler checklist PPN ──────────────────────────────────────────────────
  const handlePpnToggle = useCallback(async (checked: boolean) => {
    if (!checked) {
      setPpnEnabled(false);
      return;
    }

    const vendorId = parseInt(formRef.current.vendor_id, 10);
    if (!vendorId || isNaN(vendorId)) {
      window.alert("Pilih vendor terlebih dahulu.");
      return;
    }

    const confirmed = window.confirm(
      "Apakah vendor ini berstatus PKP (Pengusaha Kena Pajak)?\n\nJika Ya, status PKP vendor akan disimpan ke database dan nilai akan ditambah PPN 11%.",
    );
    if (!confirmed) return;

    try {
      await api.patch(`/vendors/${vendorId}/pkp`);
      setForm((prev) => ({ ...prev, is_pkp: true }));
      setPpnEnabled(true);
    } catch {
      window.alert("Gagal memperbarui status PKP vendor. Coba lagi.");
    }
  }, []);

  // ── PO Lookup ──────────────────────────────────────────────────────────────

  const handlePoBlur = useCallback(async () => {
    if (isEdit) return; // ← TAMBAH INI
    const poNumber = form.po_number.trim();
    if (!poNumber) return;

    setPoLooking(true);
    setPoFound(null);
    setPoDuplicate(false);

    // 1. Cek duplikat di invoice receipts — TERPISAH, tidak block SAP lookup
    try {
      const dupRes = await api.get(`/receipts`, {
        params: { po_number: poNumber, per_page: 1 },
      });
      const total =
        dupRes.data?.meta?.total ??
        dupRes.data?.total ??
        dupRes.data?.data?.length ??
        0;

      if (total > 0) {
        setPoDuplicate(true);
        onPoAlreadyExists?.(poNumber);
      }
    } catch {
      // gagal cek duplikat — abaikan, lanjut ke SAP
    }

    // 2. Lookup SAP — blok sendiri, tidak terpengaruh hasil cek duplikat
    try {
      const res = await api.get(`/sap/po-lookup`, {
        params: { po_number: poNumber },
      });
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
          setBaseAmount(amountStr);
          setAmountDisplay(amountStr);
          setAmountRaw(parseFloat(amountStr));
          next.amount = amountStr;
          filled.add("amount");
        }
        if (data.sap_business_area_id) {
          next.business_area_code = data.sap_business_area_id;
          filled.add("business_area_code");
        }
        if (data.purc_grp) {
          next.pgr_id = data.buyer_name
            ? `${data.purc_grp} — ${data.buyer_name}`
            : data.purc_grp;
          filled.add("pgr_id");
        }
        if (data.is_pkp !== undefined) {
          next.is_pkp = Boolean(data.is_pkp);
          filled.add("is_pkp");
          if (data.is_pkp === true) {
            // setTimeout(() => setPpnEnabled(true), 0);
          }
        }

        setForm(next);

        // lookup BA
        if (data.sap_business_area_id) {
          try {
            const baRes = await api.get(`/busa`, {
              params: { search: data.sap_business_area_id },
            });
            const baList = baRes.data?.data ?? baRes.data ?? [];
            const ba = Array.isArray(baList)
              ? baList.find((b: any) => b.sap_id === data.sap_business_area_id)
              : null;
            if (ba?.company_id) {
              setForm((prev) => ({
                ...prev,
                company_id: ba.company_id.toString(),
              }));
              filled.add("company_id");
            }
          } catch {
            // gagal lookup BA
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
  }, [form.po_number, isEdit]);

  // ── Fetch options ──────────────────────────────────────────────────────────
  const vendorFetchOptions = useMemo(
    () => ({ endpoint: "/vendors", searchParam: "search", limit: 5 }),
    [],
  );
  const companyFetchOptions = useMemo(
    () => ({ endpoint: "/companies", searchParam: "search", limit: 5 }),
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

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = (): FormErrors => {
    const err: FormErrors = {};
    if (!form.receipt_date?.trim())
      err.receipt_date = "Tanggal receipt wajib diisi.";
    if (!form.vendor_id) err.vendor_id = "Vendor wajib dipilih.";
    if (!form.company_id) err.company_id = "Perusahaan wajib dipilih.";
    if (!form.stage_id) err.stage_id = "Stage wajib dipilih.";
    if (!amountRaw || amountRaw <= 0)
      err.amount = "Jumlah harus berupa angka positif.";
    return err;
  };

  // ── Reset ke form kosong ───────────────────────────────────────────────────
  const resetToNew = () => {
    setForm(makeInitialForm(null, selectedStage, selectedYear));
    setPoFound(null);
    setPoDuplicate(false);
    setAutoFilled(new Set());
    setBaseAmount("");
    setAmountRaw(0);
    setAmountDisplay("");
    setPpnEnabled(false);

    setErrors({});
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSave = async (andNew = false) => {
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
        amount: amountRaw,
        business_area_code: form.business_area_code || null,
        pgr_id: form.pgr_id ? form.pgr_id.split(" — ")[0].trim() || null : null,
        is_pkp: form.is_pkp,
      };

      if (isEdit && receipt) {
        await api.put(`/receipts/${receipt.id}`, payload);
        onSaved();
      } else {
        await api.post("/receipts", payload);
        if (andNew) {
          resetToNew();
          onSavedAndNew();
        } else {
          onSaved();
        }
      }
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
              : "Gagal menambah invoice receipt."),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.formGrid}>
      {/* PO Number */}
      <div className={styles.poField}>
        <Input
          ref={poInputRef}
          label="PO Number"
          placeholder="contoh: 4506911487"
          value={form.po_number}
          onChange={handleInputChange("po_number")}
          onBlur={handlePoBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handlePoBlur();
            }
          }}
          error={errors.po_number}
          hint={
            poLooking
              ? "Mencari data SAP..."
              : poFound === true
                ? "✓ Data ditemukan di SAP PO Import"
                : poFound === false
                  ? "Data tidak ditemukan di SAP"
                  : "Isi lalu pindah fokus untuk auto-fill dari SAP"
          }
        />
        <div className={styles.poBadgeRow}>
          {poFound && autoFilled.size > 0 && (
            <Badge variant="success" size="sm" pill dot>
              Data dari SAP
            </Badge>
          )}
          {poDuplicate && (
            <Badge variant="warning" size="sm" pill dot>
              PO ini sudah pernah diinput
            </Badge>
          )}
        </div>
      </div>{" "}
      {/* ← ini penutup poField yang hilang */}
      <Input
        label="Tanggal Receipt"
        type="date"
        value={form.receipt_date}
        onChange={handleInputChange("receipt_date")}
        error={errors.receipt_date}
        required
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
        value={amountDisplay}
        onChange={() => {}}
        onValueChange={(raw) => {
          setAmountRaw(raw);
          setAmountDisplay(String(raw));
          setBaseAmount(String(raw)); // manual input → baseAmount ikut
          setForm((prev) => ({ ...prev, amount: String(raw) }));
        }}
        error={errors.amount}
        required
        hint={autoFilled.has("amount") ? "Dari SAP" : undefined}
      />
      {/* PPN */}
      {(autoFilled.has("amount") || amountRaw > 0) && (
        <div className={`${styles.ppnWrapper} ${styles.fullWidth}`}>
          <label className={styles.ppnToggleLabel}>
            <input
              type="checkbox"
              checked={ppnEnabled}
              onChange={(e) => handlePpnToggle(e.target.checked)}
              className={styles.ppnCheckbox}
              disabled={form.is_pkp === true}
            />
            <span>
              Tambah PPN 11%
              {form.is_pkp && (
                <span className={styles.pkpBadge}>Vendor PKP</span>
              )}
            </span>
          </label>

          {/* {ppnEnabled && baseAmount && (
            <div className={styles.ppnBreakdown}>
              <span className={styles.ppnBreakdownRow}>
                <span>Net Value</span>
                <span>
                  Rp {parseFloat(baseAmount).toLocaleString("id-ID")}
                </span>
              </span>
              <span className={styles.ppnBreakdownRow}>
                <span>PPN {PPN_RATE}%</span>
                <span>
                  Rp{" "}
                  {((parseFloat(baseAmount) * PPN_RATE) / 100).toLocaleString(
                    "id-ID",
                  )}
                </span>
              </span>
              <span
                className={`${styles.ppnBreakdownRow} ${styles.ppnTotal}`}
              >
                <span>Total</span>
                <span>Rp {amountRaw.toLocaleString("id-ID")}</span>
              </span>
            </div>
          )} */}
        </div>
      )}
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
        label="Purchasing Group"
        placeholder="Otomatis dari PO SAP"
        value={form.pgr_id}
        onChange={handleInputChange("pgr_id")}
        error={errors.pgr_id}
        disabled={autoFilled.has("pgr_id") || isEdit}
        hint={
          autoFilled.has("pgr_id")
            ? "Dari SAP"
            : isEdit
              ? "Dari data tersimpan"
              : "Isi PO Number untuk auto-fill"
        }
      />
      {errors.general && (
        <p
          className={`${styles.errorText} ${styles.errorGeneral} ${styles.fullWidth}`}
        >
          {errors.general}
        </p>
      )}
      <div className={`${styles.formActions} ${styles.fullWidth}`}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        {!isEdit && (
          <Button
            variant="outline"
            onClick={() => handleSave(true)}
            loading={loading}
          >
            Simpan (Ctrl+S)
          </Button>
        )}
        <Button
          variant="primary"
          onClick={() => handleSave(false)}
          loading={loading}
        >
          {isEdit ? "Simpan Perubahan" : "Simpan Receipt"}
        </Button>
      </div>
    </div>
  );
};

export default ReceiptFormModal;
