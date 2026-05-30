import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import ReceiptFormModal from "./ReceiptFormModal";
import Button from "../../../components/ui/Button";
import { SplitButton, SplitButtonOption } from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import type { Column } from "../../../components/ui/Table";
import Select from "../../../components/ui/Select";
import Collapsible from "../../../components/ui/Collapsible";
import { useToast } from "../../../components/ui/Toast";
import { Trash2, Download } from "lucide-react";
import styles from "./ReceiptManagement.module.css";
import apiClient from "../../../api/axios";
import { useFilterStore } from "../../../stores/filterReceipt";
import { useInterval } from "../../../hooks/useInterval";
import { getToken } from "../../../api/axios";
import { downloadME2N, downloadMIR7 } from "../../../utils/sapShortcuts";
import { useAuth } from "../../../hooks/useAuth";

const IS_PROD = import.meta.env.PROD;

// ── Interfaces ────────────────────────────────────────────────
interface TableHandle {
  refetch: () => void;
  setSearch: (value: string) => void;
  data: any[];
  loading: boolean;
  clearAllFilters: () => void;
}

interface Receipt {
  id: number;
  invoice_number?: string;
  po_number?: string;
  [key: string]: any;
}

// ── Komponen ──────────────────────────────────────────────────
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
    resetFilters,
  } = useFilterStore();

  const [formTarget, setFormTarget] = useState<any>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const tableRef = useRef<TableHandle | null>(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  const [tableOpen, setTableOpen] = useState(true);
  const [FormEditing, setFormEditing] = useState(false);

  // ── Handler: PO sudah ada → buka tabel & set search ──────────
  const handlePoAlreadyExists = useCallback((poNumber: string) => {
    setTableOpen(true);
    setTimeout(() => {
      tableRef.current?.setSearch(poNumber);
    }, 50);
  }, []);

  // ── Stage options ─────────────────────────────────────────────
  const [loadingStages, setLoadingStages] = useState(false);
 const [stageOptions, setStageOptions] = useState< { value: string; label: string }[]
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

  // ── Polling ───────────────────────────────────────────────────
  const POLL_INTERVAL_MS = 1 * 60 * 1000;
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useInterval(
    useCallback(() => {
      if (!IS_PROD && !getToken()) return;
      tableRef.current?.refetch();
      setLastUpdated(new Date());
    }, []),
    POLL_INTERVAL_MS,
  );

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  // ── Filter params ─────────────────────────────────────────────
  const filterParams = useMemo<Record<string, any>>(() => {
    const params: Record<string, any> = {};
    if (selectedCompany) params.company_id = selectedCompany;
    if (selectedVendor) params.vendor_id = selectedVendor;
    if (selectedStage) params.stage_id = selectedStage;
    if (selectedIsPkp !== null) params.is_pkp = selectedIsPkp ? 1 : 0;
    return params;
  }, [selectedCompany, selectedVendor, selectedStage, selectedIsPkp]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleDelete = useCallback(
    async (receipt: Receipt, refetch: () => void) => {
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
  }, [addToast]);

  const handleSAPMir7 = useCallback(
    (
      poNumber: string,
      vendorName: string,
      sapCocd: string,
      sapInvoiceDate: string,
      sapInvoiceAmount: string,
      sapBusArea: string,
    ) => {
      downloadMIR7(
        poNumber,
        user?.sap_user,
        user?.sap_server_con,
        sapCocd,
        vendorName,
        sapInvoiceDate,
        sapInvoiceAmount,
        sapBusArea,
      );
    },
    [user],
  );

  const handleSAPME2n = useCallback(
    (poNumber: string) => {
      downloadME2N(poNumber, user?.sap_user, user?.sap_server_con);
    },
    [user],
  );

  const handleSAPcekICA = useCallback((poNumber: string) => {
    window.open(
      `https://icat.indoagri.co.id/User/Purchase/Details/${poNumber}`,
      "_blank",
    );
  }, []);

  // ── Columns ───────────────────────────────────────────────────
  const columns = useMemo<Column[]>(
    () => [
      {
        key: "po_number",
        label: "PO Number",
        sortable: true,
        render: (row: any) => (
          <span className={styles.code}>{row.po_number || "—"}</span>
        ),
      },
      {
        key: "invoice_number",
        label: "Invoice Number",
        sortable: true,
        collapsible: true,
        collapseOrder: 0,
        render: (row: any) => (
          <span className={styles.code}>{row.invoice_number || "—"}</span>
        ),
      },
      {
        key: "receipt_date",
        label: "Tanggal Receipt",
        sortable: true,
        collapsible: true,
        exportValue: (row: any) =>
          row.receipt_date
            ? new Date(row.receipt_date).toLocaleDateString("id-ID")
            : "",
        render: (row: any) => (
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
        sortable: true,
        collapsible: true,
        collapseOrder: 4,
        exportValue: (row: any) => row.vendor?.name ?? "",
        render: (row: any) => (
          <span className={styles.muted}>{row.vendor?.name || "—"}</span>
        ),
      },
      {
        key: "company",
        label: "Perusahaan",
        sortable: false,
        collapsible: true,
        collapseOrder: 3,
        exportValue: (row: any) => row.company?.name ?? "",
        render: (row: any) => (
          <span className={styles.muted}>{row.company?.name || "—"}</span>
        ),
      },
      {
        key: "stage",
        label: "Stage",
        sortable: false,
        collapsible: true,
        collapseOrder: 2,
        exportValue: (row: any) => row.stage?.name ?? "",
        render: (row: any) => (
          <span className={styles.muted}>{row.stage?.name || "—"}</span>
        ),
      },
      {
        key: "amount",
        label: "Jumlah",
        sortable: true,
        collapsible: true,
        collapseOrder: 1,
        exportValue: (row: any) =>
          row.amount ? parseFloat(row.amount).toLocaleString("id-ID") : "",
        render: (row: any) => (
          <span className={styles.muted}>
            {row.amount ? parseFloat(row.amount).toLocaleString("id-ID") : "—"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Aksi",
        sortable: false,
        exportable: false,
        render: (row: any) => {
          const pgr = row.pgr_id ?? "";

          let sapMain: { label: string; onClick: () => void } | null = null;
          let sapSecondary: SplitButtonOption[] = [];

          if (pgr === "ICA") {
            sapMain = {
              label: "ICAT",
              onClick: () => handleSAPcekICA(row.po_number),
            };
            sapSecondary = [
              {
                label: "ME2N",
                icon: <Download size={13} />,
                onClick: () => handleSAPME2n(row.po_number),
              },
            ];
          } else if (pgr !== "") {
            sapMain = {
              label: "MIR7",
              onClick: () =>
                handleSAPMir7(
                  row.po_number,
                  row.vendor?.name,
                  row.company?.sap_id,
                  new Date(row.receipt_date).toLocaleDateString("de-DE"),
                  row.amount,
                  row.business_area_code,
                ),
            };
            sapSecondary = [
              {
                label: "ME2N",
                icon: <Download size={13} />,
                onClick: () => handleSAPME2n(row.po_number),
              },
            ];
          }

          return (
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <SplitButton
                label="Edit"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormTarget(row);
                  setFormEditing(true);
                }}
                options={[
                  {
                    label: "Hapus",
                    icon: <Trash2 size={13} />,
                    onClick: () =>
                      handleDelete(
                        row,
                        tableRef.current?.refetch ?? (() => {}),
                      ),
                  },
                ]}
                disabled={deletingId === row.id}
              />
              <SplitButton
                label={sapMain?.label ?? "SAP"}
                variant="outline"
                size="sm"
                onClick={sapMain?.onClick ?? (() => {})}
                options={sapSecondary}
                disabled={!sapMain || deletingId === row.id}
              />
            </div>
          );
        },
      },
    ],
    [handleDelete, handleSAPMir7, handleSAPME2n, handleSAPcekICA, deletingId],
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
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
        open={FormEditing}
        defaultOpen={true}
        onToggle={(v) => setFormEditing(v)}
      >
        <ReceiptFormModal
          receipt={formTarget?.id ? formTarget : null}
          onCancel={() => {
            setFormTarget({});
            setFormEditing(false);
          }}
          onSaved={() => {
            handleSaved();
            if (formTarget?.id) setFormTarget({});
            setFormEditing(false);
          }}
          onSavedAndNew={() => {
            handleSavedAndNew();
            setFormEditing(false);
          }}
          onPoAlreadyExists={handlePoAlreadyExists}
        />
      </Collapsible>

      {/* ── Filter + Tabel ── */}
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
              type="text"
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
