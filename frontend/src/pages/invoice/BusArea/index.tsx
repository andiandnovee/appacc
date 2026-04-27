import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import BusAreasFormModal from "./BusAreasFormModal";
import Button from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import Select from "../../../components/ui/Select";
import { useToast } from "../../../components/ui/Toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./BusAreas.module.css";
import apiClient from "../../../api/axios";
import { useFilterStore } from '../../../stores/filterReceipt';

const api = async (path: string, options: { method?: string; body?: string } = {}) => {
  const method = (options.method || "GET").toLowerCase();
  const data = options.body ? JSON.parse(options.body) : undefined;
  const res = await (apiClient as any)[method](path, data);
  return res.data;
};

export default function BusAreas() {
  const {
      selectedCompany,
      setSelectedCompany,
      resetFilters,
    } = useFilterStore();



  const [formTarget, setFormTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const tableRef = useRef(null);
  const { addToast } = useToast();
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const fullUrl = useMemo(() => `/busa`, [apiBase]);

  // State untuk filter
 
  //const [stageOptions, setStageOptions] = useState([]);
  const [loadingStages, setLoadingStages] = useState(false);
 

  // Fetch stages berdasarkan tahun
  
const filterParams = useMemo<Record<string, any>>(() => {
    const params: Record<string, any> = {};
    if (selectedCompany) params.company_id = selectedCompany;
    return params;
  }, [selectedCompany]);


  const handleDelete = useCallback(
    async (busa, refetch) => {
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
        key: "'Company'",
        label: "Company",
        sortable: true,
        render: (row) => <span className={styles.muted}>{row.company?.name || "—"}</span>,
      },
      {
        key: "sap_id",
        label: "Bus Area",
        sortable: true,
        render: (row) => <span className={styles.code}>{row.sap_id || "—"}</span>,
      },
      {
        key: "name",
        label: "Nama",
        sortable: true,
        render: (row) => <span className={styles.code}>{row.name || "—"}</span>,
      },
      {
        key: "description",
        label: "Deskripsi",
        sortable: true,
        render: (row) => <span className={styles.code}>{row.name_long || "—"}</span>,
      },
      {
        key: "sap_vendor_code",
        label: "Vendor",
        sortable: true,
        render: (row) => <span className={styles.muted}>{row.sap_vendor_code || "—"}</span>,
      },
      {
        key: "sap_customer_code",
        label: "Customer",
        sortable: true,
        render: (row) => <span className={styles.muted}>{row.sap_customer_code || "—"}</span>,
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
          <h1 className={styles.pageTitle}>Business Area</h1>
          <p className={styles.pageSubtitle}>Business Area </p>
        </div>
        <Button iconLeft={<Plus size={14} />} onClick={() => setFormTarget({})}>
          Tambah Bus. Area
        </Button>
      </div>

      <div className={styles.filterBar}>
              <div className={styles.filterGroup}>
                <label>Perusahaan</label>
                <Select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  placeholder="Semua Perusahaan"
                  fetchOptions={{ endpoint: "/companies", searchParam: "search", limit: 10 }}
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
        exportName="Business_areas_export"
        title="Daftar Business Area"
        searchable={true}
        selectable={false}
        serverSide={true}
        serverSideFiltering={true}
        defaultParams={filterParams}
        
      />

      {formTarget !== null && (
        <BusAreasFormModal
          receipt={formTarget.id ? formTarget : null}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
          api={api}
        />
      )}
    </div>
  );
}