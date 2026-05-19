import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import ReceiptFormModal from "./ReceiptFormModal";
import Button from "../../../components/ui/Button";
import { SplitButton } from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import Select from "../../../components/ui/Select";
import Collapsible from "../../../components/ui/Collapsible";
import { useToast } from "../../../components/ui/Toast";
import { Plus, Trash2 } from "lucide-react";
import styles from "./ReceiptManagement.module.css";
import apiClient from "../../../api/axios";
import { useFilterStore } from "../../../stores/filterReceipt";
import { useInterval } from "../../../hooks/useInterval";
import { getToken } from "../../../api/axios";

const IS_PROD = import.meta.env.PROD;

export default function InvoiceReceiptManagement() {
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

  const [formTarget, setFormTarget] = useState<any>({});
  const [deletingId, setDeletingId] = useState(null);
  const tableRef = useRef(null);
  const { addToast } = useToast();
  // tambah state ini

  // state
  const [tableOpen, setTableOpen] = useState(false);
  const [tableSearchPo, setTableSearchPo] = useState("");

  // handler dari ReceiptFormModal
  const handlePoAlreadyExists = useCallback((poNumber: string) => {
    setTableOpen(true); // buka collapsible tabel
    // set search setelah collapsible terbuka (tunggu render)
    setTimeout(() => {
      tableRef.current?.setSearch(poNumber);
    }, 50);
  }, []);

  const [loadingStages, setLoadingStages] = useState(false);
  // ✅ benar
  const [stageOptions, setStageOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (!selectedYear) {
      setStageOptions([]);
      return;
    }
    const fetchStages = async () => {
      setLoadingStages(true);
      try {
        const res = await apiClient.get(`/stages`, {
          params: { year: selectedYear },
        });
        const stages = res.data?.data || [];
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

  const POLL_INTERVAL_MS = 1 * 60 * 1000;
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  //const isModalOpen = formTarget !== null;

  useInterval(
    useCallback(() => {
      if (!IS_PROD && !getToken()) return;
      tableRef.current?.refetch();
      setLastUpdated(new Date());
    }, []),
    POLL_INTERVAL_MS, // ← polling jalan terus, form sudah tidak modal
  );

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const filterParams = useMemo<Record<string, any>>(() => {
    const params: Record<string, any> = {};
    if (selectedCompany) params.company_id = selectedCompany;
    if (selectedVendor) params.vendor_id = selectedVendor;
    if (selectedStage) params.stage_id = selectedStage;
    if (selectedIsPkp !== null) params.is_pkp = selectedIsPkp ? 1 : 0;
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
        await apiClient.delete(`/receipts/${receipt.id}`);
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

  const handleSavedAndNew = useCallback(() => {
    addToast({
      variant: "success",
      title: "Receipt disimpan. Form siap untuk data baru.",
    });
    tableRef.current?.refetch();
    // formTarget tetap {}, form direset oleh ReceiptFormModal sendiri
  }, [addToast]);

  const handleSAPMir7 = useCallback(() => {
    alert("Fitur integrasi SAP MIR7 belum diimplementasikan.");
  }, []);

  const handleSAPME2n = useCallback(() => {
    alert("Fitur integrasi SAP ME2n belum diimplementasikan.");
  }, []);

  const handleSAPcekICA = useCallback(() => {
    alert("Fitur cek PGR ID ICA belum diimplementasikan.");
  }, []);

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
        render: (row) => {
          const pgr = row.pgr_id ?? "";
          const sapOptions =
            pgr === "ICA"
              ? [
                  {
                    label: "ICAT Check",
                    icon: <Trash2 size={13} />,
                    onClick: () => handleSAPcekICA(),
                  },
                ]
              : pgr !== ""
                ? [
                    {
                      label: "MIR7",
                      icon: <Trash2 size={13} />,
                      onClick: () => handleSAPMir7(),
                    },
                  ]
                : [];

          return (
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <SplitButton
                label="Edit"
                variant="outline"
                size="sm"
                onClick={() => setFormTarget(row)}
                options={[
                  {
                    label: "Hapus",
                    icon: <Trash2 size={13} />,
                    onClick: () => handleDelete(row, tableRef.current?.refetch),
                  },
                ]}
                disabled={deletingId === row.id}
              />
              <SplitButton
                label="ME2N"
                variant="outline"
                size="sm"
                onClick={() => handleSAPME2n()}
                options={sapOptions}
                disabled={pgr === "" || deletingId === row.id}
              />
            </div>
          );
        },
      },
    ],
    [handleDelete, deletingId],
  );

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manajemen Invoice Receipt</h1>
          <p className={styles.pageSubtitle}>
            Kelola data invoice receipt perusahaan
          </p>
          {lastUpdated && (
            <p className={styles.lastUpdated}>
              Diperbarui:{" "}
              {lastUpdated.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>

      {/* ── Form panel ── */}
      <Collapsible
        title={
          formTarget?.id
            ? "Edit Invoice Receipt"
            : "Tambah Invoice Receipt Baru"
        }
        subtitle={
          formTarget?.id
            ? `Invoice #${formTarget.invoice_number ?? "—"}`
            : "Isi data invoice receipt dengan lengkap"
        }
        defaultOpen={true}
      >
        <ReceiptFormModal
          receipt={formTarget?.id ? formTarget : null}
          onCancel={() => setFormTarget({})}
          onSaved={() => {
            handleSaved();
            if (formTarget?.id) setFormTarget({});
          }}
          onSavedAndNew={handleSavedAndNew}
          onPoAlreadyExists={handlePoAlreadyExists} // ← tambah ini
        />
      </Collapsible>

      {/* ── Filter bar ── */}
      <Collapsible
        title="Daftar Invoice Receipt"
        defaultOpen={false}
        open={tableOpen}
        onToggle={(v) => setTableOpen(v)}
      >
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

        {/* ── Tabel ── */}

        <Table
          ref={tableRef}
          url={`/receipts`}
          columns={columns}
          dataKey="data"
          pageSize={15}
          exportName="invoice_receipts_export"
          title=""
          searchable={true}
          selectable={false}
          serverSide={true}
          serverSideFiltering={true}
          defaultParams={filterParams}
        />
      </Collapsible>
    </div>
  );
}
