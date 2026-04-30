import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import ReceiptFormModal from "./ReceiptFormModal";
import Button from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import Select from "../../../components/ui/Select";
import Toggle from "../../../components/ui/Toggle";
import { useToast } from "../../../components/ui/Toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./ReceiptManagement.module.css";
import apiClient from "../../../api/axios";
import { useFilterStore } from "../../../stores/filterReceipt";

const api = async (
  path: string,
  options: { method?: string; body?: string } = {},
) => {
  const method = (options.method || "GET").toLowerCase();
  const data = options.body ? JSON.parse(options.body) : undefined;
  const res = await (apiClient as any)[method](path, data);
  return res.data;
};

export default function InvoiceReceiptManagement() {
  // Zustand store
  const {
    selectedCompany,
    selectedVendor,
    selectedYear,
    selectedStage,
    selectedIsPkp,
    setSelectedCompany,
    setSelectedVendor,
    setSelectedYear,
    setSelectedStage,
    setSelectedIsPkp,
    resetFilters,
  } = useFilterStore();

  const [formTarget, setFormTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const tableRef = useRef(null);
  const { addToast } = useToast();
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const fullUrl = useMemo(() => `/receipts`, [apiBase]);

  // State untuk options stage
  const [loadingStages, setLoadingStages] = useState(false);
  const [stageOptions, setStageOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  // Fetch stages berdasarkan selectedYear
  useEffect(() => {
    if (!selectedYear) {
      setStageOptions([]);
      return;
    }
    const fetchStages = async () => {
      setLoadingStages(true);
      try {
        const res = await api(`/stages?year=${selectedYear}`);
        const stages = res.data || [];
        setStageOptions(
          stages.map((s: any) => ({ value: s.id.toString(), label: s.name })),
        );
      } catch (err) {
        console.error("Gagal fetch stages:", err);
        setStageOptions([]);
      } finally {
        setLoadingStages(false);
      }
    };
    fetchStages();
  }, [selectedYear]);

  // 🔥 HAPUS useEffect yang mereset stage jika ingin stage tetap tersimpan
  // Jika Anda tetap ingin reset stage saat tahun berubah namun tidak saat refresh, gunakan kode di bawah ini (dikomentari)
  /*
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSelectedStage("");
  }, [selectedYear, setSelectedStage]);
  */

  // Filter params untuk tabel
  const filterParams = useMemo<Record<string, any>>(() => {
    const params: Record<string, any> = {};
    if (selectedCompany) params.company_id = selectedCompany;
    if (selectedVendor) params.vendor_id = selectedVendor;
    if (selectedStage) params.stage_id = selectedStage;
    if (selectedIsPkp !== null) params.is_pkp = selectedIsPkp ? 1 : 0; // ← tambah
    return params;
  }, [selectedCompany, selectedVendor, selectedStage, selectedIsPkp]);

  const handleDelete = useCallback(
    async (receipt, refetch) => {
      if (
        !confirm(
          `Hapus invoice receipt "${receipt.invoice_number || receipt.po_number || `ID ${receipt.id}`}"? Tindakan ini tidak dapat dibatalkan.`,
        )
      )
        return;
      setDeletingId(receipt.id);
      try {
        await api(`/receipts/${receipt.id}`, { method: "DELETE" });
        addToast({
          variant: "success",
          title: "Invoice receipt berhasil dihapus.",
        });
        refetch();
      } catch (err) {
        addToast({
          variant: "danger",
          title: "Gagal menghapus invoice receipt.",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [addToast],
  );

  const handleSaved = useCallback(() => {
    addToast({
      variant: "success",
      title: "Data invoice receipt berhasil disimpan.",
    });
    tableRef.current?.refetch();
  }, [addToast]);

  const handleSavedAndClose = useCallback(() => {
    setFormTarget(null);
    addToast({
      variant: "success",
      title: "Data invoice receipt berhasil disimpan.",
    });
    tableRef.current?.refetch();
  }, [addToast]);

  const columns = useMemo(
    () => [
      {
        key: "po_number",
        label: "PO Number",
        sortable: true,
        render: (row) => (
          <span className={styles.code}>{row.po_number || "—"}</span>
        ),
      },
      {
        key: "invoice_number",
        label: "Invoice Number",
        sortable: true,
        render: (row) => (
          <span className={styles.code}>{row.invoice_number || "—"}</span>
        ),
      },
      {
        key: "receipt_date",
        label: "Tanggal Receipt",
        sortable: true,
        render: (row) => (
          <span className={styles.muted}>
            {row.receipt_date
              ? new Date(row.receipt_date).toLocaleDateString("id-ID")
              : "—"}
          </span>
        ),
      },
      {
        key: "vendor",
        label: "Vendor",
        sortable: false,
        render: (row) => (
          <span className={styles.muted}>{row.vendor?.name || "—"}</span>
        ),
      },
      {
        key: "company",
        label: "Perusahaan",
        sortable: false,
        render: (row) => (
          <span className={styles.muted}>{row.company?.name || "—"}</span>
        ),
      },
      {
        key: "stage",
        label: "Stage",
        sortable: false,
        render: (row) => (
          <span className={styles.muted}>{row.stage?.name || "—"}</span>
        ),
      },
      {
        key: "amount",
        label: "Jumlah",
        sortable: true,
        render: (row) => (
          <span className={styles.muted}>
            {row.amount
              ? `Rp ${parseFloat(row.amount).toLocaleString("id-ID")}`
              : "—"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Aksi",
        sortable: false,
        render: (row) => (
          <div className={styles.actions}>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Pencil size={13} />}
              onClick={() => setFormTarget(row)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Trash2 size={13} />}
              onClick={() => handleDelete(row, tableRef.current?.refetch)}
              disabled={deletingId === row.id}
              className={styles.deleteBtn}
            >
              Hapus
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete, deletingId],
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manajemen Invoice Receipt</h1>
          <p className={styles.pageSubtitle}>
            Kelola data invoice receipt perusahaan
          </p>
        </div>
        <Button iconLeft={<Plus size={14} />} onClick={() => setFormTarget({})}>
          Tambah Receipt
        </Button>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label>Perusahaan</label>
          <Select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            placeholder="Semua Perusahaan"
            fetchOptions={{
              endpoint: "/companies",
              searchParam: "search",
              limit: 10,
            }}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Vendor</label>
          <Select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            placeholder="Semua Vendor"
            fetchOptions={{
              endpoint: "/vendors",
              searchParam: "search",
              limit: 10,
            }}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Tahun Stage</label>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className={styles.yearInput}
            min="2000"
            max="2099"
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Stage</label>
          <Select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            placeholder="Semua Stage"
            options={stageOptions}
            disabled={loadingStages}
          />
        </div>

        <div className={styles.filterActions}>
          <Button variant="ghost" onClick={resetFilters} size="sm">
            Reset Filter
          </Button>
        </div>
      </div>

      <Table
        ref={tableRef}
        url={fullUrl}
        columns={columns}
        dataKey="data"
        pageSize={15}
        exportName="invoice_receipts_export"
        title="Daftar Invoice Receipt"
        searchable={true}
        selectable={false}
        serverSide={true}
        serverSideFiltering={true}
        defaultParams={filterParams}
      />

      {formTarget !== null && (
        <ReceiptFormModal
          receipt={formTarget.id ? formTarget : null}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved} // ← untuk tambah: refetch saja, tidak close
          onSavedAndClose={handleSavedAndClose} // ← untuk edit: refetch + close
        />
      )}
    </div>
  );
}
