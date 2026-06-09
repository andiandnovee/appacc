import { useState, useCallback, useRef, useMemo } from "react";
import CostCenterForm from "./CostCenterForm";
import Button from "../../../components/ui/Button";
import { SplitButton } from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import type { Column } from "../../../components/ui/Table";
import Collapsible from "../../../components/ui/Collapsible";
import { useToast } from "../../../components/ui/Toast";
import { Trash2 } from "lucide-react";
import styles from "./CostCenterManagement.module.css";
import apiClient from "../../../api/axios";
import Drawer from "../../../components/ui/Drawer";

interface TableHandle {
  refetch: () => void;
  setSearch: (value: string) => void;
}

interface CostCenter {
  id: number;
  sap_id: string | null;
  description: string | null;
  short_name: string | null;
}

export default function CostCenterManagement() {
  const tableRef = useRef<TableHandle | null>(null);
  const { addToast } = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CostCenter | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(true);

  const handleDelete = useCallback(
    async (cc: CostCenter) => {
      if (
        !confirm(
          `Hapus Cost Center "${cc.sap_id || cc.description || `ID ${cc.id}`}"?\nTindakan ini tidak dapat dibatalkan.`,
        )
      )
        return;
      setDeletingId(cc.id);
      try {
        await apiClient.delete(`/cost-centers/${cc.id}`);
        addToast({
          variant: "success",
          title: "Cost Center berhasil dihapus.",
        });
        tableRef.current?.refetch();
      } catch {
        addToast({ variant: "danger", title: "Gagal menghapus Cost Center." });
      } finally {
        setDeletingId(null);
      }
    },
    [addToast],
  );

  const handleSaved = useCallback(() => {
    addToast({ variant: "success", title: "Cost Center berhasil disimpan." });
    tableRef.current?.refetch();
    setDrawerOpen(false);
    setEditTarget(null);
  }, [addToast]);

  const columns = useMemo<Column[]>(
    () => [
      {
        key: "sap_id",
        label: "SAP ID",
        sortable: true,
        cardRole: "title",
        render: (row: CostCenter) => (
          <span className={styles.code}>{row.sap_id || "—"}</span>
        ),
        exportValue: (row: CostCenter) => row.sap_id ?? "",
      },
      {
        key: "short_name",
        label: "Nama Singkat",
        sortable: true,
        cardRole: "badge",
        render: (row: CostCenter) => (
          <span className={styles.muted}>{row.short_name || "—"}</span>
        ),
        exportValue: (row: CostCenter) => row.short_name ?? "",
      },
      {
        key: "description",
        label: "Keterangan",
        sortable: true,
        collapsible: true,
        collapseOrder: 0,
        cardRole: "subtitle",
        render: (row: CostCenter) => (
          <span className={styles.muted}>{row.description || "—"}</span>
        ),
        exportValue: (row: CostCenter) => row.description ?? "",
      },
      {
        key: "actions",
        label: "Aksi",
        sortable: false,
        exportable: false,
        render: (row: CostCenter) => (
          <SplitButton
            label="Edit"
            variant="outline"
            size="sm"
            onClick={() => {
              setEditTarget(row);
              setDrawerOpen(true);
            }}
            options={[
              {
                label: "Hapus",
                icon: <Trash2 size={13} />,
                onClick: () => handleDelete(row),
              },
            ]}
            disabled={deletingId === row.id}
          />
        ),
      },
    ],
    [handleDelete, deletingId],
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manajemen Cost Center</h1>
          <p className={styles.pageSubtitle}>Data Cost Center dari SAP</p>
        </div>
      </div>

      <Collapsible
        title="Tambah Cost Center Baru"
        subtitle="Isi data Cost Center"
        defaultOpen={true}
        open={addOpen}
        onToggle={setAddOpen}
      >
        <CostCenterForm
          costCenter={null}
          onCancel={() => setAddOpen(false)}
          onSaved={() => {
            addToast({
              variant: "success",
              title: "Cost Center berhasil ditambahkan.",
            });
            tableRef.current?.refetch();
          }}
        />
      </Collapsible>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        size="md"
      >
        <Drawer.Header
          title="Edit Cost Center"
          subtitle={`SAP ID: ${editTarget?.sap_id ?? "—"}`}
          onClose={() => {
            setDrawerOpen(false);
            setEditTarget(null);
          }}
        />
        <Drawer.Body>
          <CostCenterForm
            costCenter={editTarget}
            onCancel={() => {
              setDrawerOpen(false);
              setEditTarget(null);
            }}
            onSaved={handleSaved}
          />
        </Drawer.Body>
      </Drawer>

      <Collapsible title="Daftar Cost Center" defaultOpen={true}>
        <Table
          ref={tableRef}
          url="/cost-centers"
          columns={columns}
          dataKey="data"
          pageSize={15}
          exportName="cost_centers_export"
          title=""
          searchable={true}
          selectable={false}
          serverSide={true}
          serverSideFiltering={true}
          tableId="cost-centers"
        />
      </Collapsible>
    </div>
  );
}
