import { useState, useCallback, useRef, useMemo } from 'react';
import BusAreasFormModal from "./BusAreasFormModal";
import Button from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import Select from "../../../components/ui/Select";
import { useToast } from "../../../components/ui/Toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./BusAreas.module.css";
import api from "../../../api/axios"; // ← langsung pakai api
import { useFilterStore } from '../../../stores/filterReceipt';

interface BusA {
  id: number;
  sap_id: number;
  company_id: string;
  name: string;
  name_long: string;
  sap_customer_code: string | null;
  sap_vendor_code: string| null;
}

export default function BusAreas() {
  const { selectedCompany, setSelectedCompany, resetFilters } = useFilterStore();

  const [formTarget, setFormTarget] = useState<BusA | {} | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const tableRef = useRef<any>(null);
  const { addToast } = useToast();

  const fullUrl = `/busa`;

  const filterParams = useMemo<Record<string, any>>(() => {
    const params: Record<string, any> = {};
    if (selectedCompany) params.company_id = selectedCompany;
    return params;
  }, [selectedCompany]);

  const handleDelete = useCallback(
    async (busArea: BusA, refetch: () => void) => {
      if (
        !confirm(
          `Hapus business area "${busArea?.name || busArea.sap_id || `ID ${busArea.id}`}"? Tindakan ini tidak dapat dibatalkan.`
        )
      )
        return;

      setDeletingId(busArea.id);
      try {
        await api.delete(`/busa/${busArea.id}`);
        addToast({ variant: "success", title: "Business area berhasil dihapus." });
        refetch();
      } catch {
        addToast({ variant: "danger", title: "Gagal menghapus business area." });
      } finally {
        setDeletingId(null);
      }
    },
    [addToast]
  );

  const handleSaved = useCallback(() => {
    setFormTarget(null);
    addToast({ variant: "success", title: "Data business area berhasil disimpan." });
    tableRef.current?.refetch();
  }, [addToast]);

  const columns = useMemo(
    () => [
      {
        key: "company",
        label: "Company",
        sortable: true,
        render: (row: BusA & { company?: { name: string } }) => (
          <span className={styles.muted}>{row.company?.name || "—"}</span>
        ),
      },
      {
        key: "sap_id",
        label: "Bus Area",
        sortable: true,
        render: (row: BusA) => <span className={styles.code}>{row.sap_id || "—"}</span>,
      },
      {
        key: "name",
        label: "Nama",
        sortable: true,
        render: (row: BusA) => <span className={styles.code}>{row.name || "—"}</span>,
      },
      {
        key: "description",
        label: "Deskripsi",
        sortable: true,
        render: (row: BusA) => <span className={styles.code}>{row.name_long || "—"}</span>,
      },
      {
        key: "sap_vendor_code",
        label: "Vendor",
        sortable: true,
        render: (row: BusA) => <span className={styles.muted}>{row.sap_vendor_code || "—"}</span>,
      },
      {
        key: "sap_customer_code",
        label: "Customer",
        sortable: true,
        render: (row: BusA) => <span className={styles.muted}>{row.sap_customer_code || "—"}</span>,
      },
      {
        key: "actions",
        label: "Aksi",
        sortable: false,
        render: (row: BusA) => (
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
    [handleDelete, deletingId]
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Business Area</h1>
          <p className={styles.pageSubtitle}>Business Area</p>
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
  <>
    {console.log("formTarget raw:", JSON.stringify(formTarget))}
    <BusAreasFormModal
      busArea={(formTarget as BusA).id ? (formTarget as BusA) : undefined}
      onClose={() => setFormTarget(null)}
      onSaved={handleSaved}
    />
  </>
)}
    </div>
  );
}