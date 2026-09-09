// Path: src/pages/invoice/BusArea/index.tsx

import { useState, useCallback, useRef, useMemo } from 'react';
import BusAreasFormModal from "./BusAreasFormModal";
import Button from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import Select from "../../../components/ui/Select";
import Badge from "../../../components/ui/Badge";
import { useToast } from "../../../components/ui/Toast";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import styles from "./BusAreas.module.css";
import api from "../../../api/axios";
import { useFilterStore } from '../../../stores/filterReceipt';

interface BusA {
  id: number;
  sap_id: number;
  company_id: string;
  name: string;
  name_long: string;
  sap_customer_code: string | null;
  sap_vendor_code: string | null;
  current_bus_area: boolean;
}

export default function BusAreas() {
  const { selectedCompany, setSelectedCompany, resetFilters } = useFilterStore();

  const [formTarget, setFormTarget] = useState<BusA | {} | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingCurrentId, setSettingCurrentId] = useState<number | null>(null);
  const tableRef = useRef<any>(null);
  const { addToast } = useToast();

  const fullUrl = `/busa`;

  const filterParams = useMemo<Record<string, any>>(() => {
    const params: Record<string, any> = {};
    if (selectedCompany) params.company_id = selectedCompany;
    return params;
  }, [selectedCompany]);

  // ── Set Current ──────────────────────────────
  const handleSetCurrent = useCallback(
    async (busArea: BusA) => {
      if (busArea.current_bus_area) return; // sudah current, skip

      if (
        !confirm(
          `Set "${busArea.name}" sebagai BusArea pembayar jurnal RO untuk company ini?\n\nBusArea lain di company yang sama akan di-unset.`
        )
      )
        return;

      setSettingCurrentId(busArea.id);
      try {
        await api.patch(`/busa/${busArea.id}/set-current`);
        addToast({
          variant: "success",
          title: `${busArea.name} ditetapkan sebagai Current BusArea.`,
        });
        tableRef.current?.refetch();
      } catch {
        addToast({ variant: "danger", title: "Gagal set Current BusArea." });
      } finally {
        setSettingCurrentId(null);
      }
    },
    [addToast],
  );

  // ── Delete ───────────────────────────────────
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
    [addToast],
  );

  const handleSaved = useCallback(() => {
    setFormTarget(null);
    addToast({ variant: "success", title: "Data business area berhasil disimpan." });
    tableRef.current?.refetch();
  }, [addToast]);

  // ── Columns ──────────────────────────────────
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
        render: (row: BusA) => (
          <div className={styles.busAreaCell}>
            <span className={styles.code}>{row.sap_id || "—"}</span>
            {row.current_bus_area && (
              <Badge variant="success" size="sm">
                <Star size={9} /> Current
              </Badge>
            )}
          </div>
        ),
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
        render: (row: BusA) => (
          <span className={styles.code}>{row.name_long || "—"}</span>
        ),
      },
      {
        key: "sap_vendor_code",
        label: "Vendor",
        sortable: true,
        render: (row: BusA) => (
          <span className={styles.muted}>{row.sap_vendor_code || "—"}</span>
        ),
      },
      {
        key: "sap_customer_code",
        label: "Customer",
        sortable: true,
        render: (row: BusA) => (
          <span className={styles.muted}>{row.sap_customer_code || "—"}</span>
        ),
      },
      {
        key: "actions",
        label: "Aksi",
        sortable: false,
        render: (row: BusA) => (
          <div className={styles.actions}>
            {/* Set Current */}
            <Button
              variant={row.current_bus_area ? "ghost" : "outline"}
              size="sm"
              iconLeft={<Star size={13} />}
              onClick={() => handleSetCurrent(row)}
              disabled={row.current_bus_area || settingCurrentId === row.id}
              loading={settingCurrentId === row.id}
              title={
                row.current_bus_area
                  ? "Sudah menjadi Current BusArea"
                  : "Set sebagai Current BusArea"
              }
              className={row.current_bus_area ? styles.currentBtn : styles.setCurrentBtn}
            >
              {row.current_bus_area ? "Current" : "Set Current"}
            </Button>

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
    [handleDelete, handleSetCurrent, deletingId, settingCurrentId],
  );

  // ─────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Business Area</h1>
          <p className={styles.pageSubtitle}>
            Kelola Business Area — tandai satu sebagai <strong>Current</strong> per company untuk jurnal BusArea RO
          </p>
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
          busArea={(formTarget as BusA).id ? (formTarget as BusA) : undefined}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}